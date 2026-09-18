// Notificación por Telegram (mejor esfuerzo).
// Si faltan las variables o el envío falla, no se lanza error: la confirmación ya está guardada.
// Texto plano sin parse_mode: nombre y mensaje los escribe el invitado.

import { listRsvps, totalAttendees } from './rsvps.js'

const TIMEOUT_MS = 5000

async function getTotal() {
  try {
    return totalAttendees(await listRsvps())
  } catch (err) {
    console.error('Telegram: no se pudo calcular el total:', err.message)
    return null
  }
}

function buildText({ name, guests, message }, total) {
  const lines = ['Nueva confirmación', `${name} (+${guests})`]
  if (message) lines.push(`Mensaje: ${message}`)
  if (total !== null) lines.push(`Total: ${total} asistentes`)
  return lines.join('\n')
}

// Un intento de envío. Devuelve null si salió bien o una descripción del error (sin token ni URL).
async function sendOnce(token, chatId, text) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (res.ok) return null
    const data = await res.json().catch(() => null)
    return `HTTP ${res.status}${data?.description ? ` - ${data.description}` : ''}`
  } catch (err) {
    return `${err.name}: fallo de red o timeout`
  }
}

export async function notifyRsvp(rsvp) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return false

  const text = buildText(rsvp, await getTotal())

  let failure = await sendOnce(token, chatId, text)
  if (!failure) return true

  failure = await sendOnce(token, chatId, text)
  if (!failure) return true

  console.error('Telegram: no se pudo enviar el aviso tras un reintento:', failure)
  return false
}
