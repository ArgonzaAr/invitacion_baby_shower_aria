// Verifica el bot de Telegram (getMe) y envía un mensaje de prueba al grupo.
// Uso: npm run check:telegram (carga backend/.env.local). Nunca imprime credenciales.
const TIMEOUT_MS = 5000

async function llamar(token, metodo, cuerpo) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${metodo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo ?? {}),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const data = await res.json().catch(() => null)
    if (res.ok && data?.ok) return { ok: true, data }
    return { ok: false, error: data?.description || `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, error: `fallo de red o timeout (${err.name})` }
  }
}

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error('ERROR: faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en backend/.env.local')
    process.exit(1)
  }

  if (!/^-\d+$/.test(chatId)) {
    console.error('ERROR: TELEGRAM_CHAT_ID debe ser un número negativo (ID del grupo).')
    process.exit(1)
  }

  const me = await llamar(token, 'getMe')
  if (!me.ok) {
    console.error(`ERROR: el token no es válido (${me.error}).`)
    process.exit(1)
  }

  const envio = await llamar(token, 'sendMessage', {
    chat_id: chatId,
    text: 'Prueba de check:telegram: las notificaciones funcionan.',
  })
  if (!envio.ok) {
    console.error(`ERROR: no se pudo enviar al grupo (${envio.error}).`)
    process.exit(1)
  }

  console.log(`OK: bot @${me.data.result.username} conectado y mensaje de prueba enviado al grupo.`)
}

main()
