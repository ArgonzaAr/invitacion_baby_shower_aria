// Base de la notificación por Telegram (mejor esfuerzo).
// Si faltan las variables o el envío falla, no se lanza error: la confirmación ya está guardada.
// La configuración precisa (bot, formato final, reintentos) se define en otro spec.

export async function notifyRsvp({ name, guests }) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return false

  const text = `Nueva confirmación: ${name} (+${guests} acompañantes)`
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}
