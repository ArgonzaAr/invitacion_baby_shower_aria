// Verifica la conexión con Supabase y la existencia de la tabla rsvps.
// Uso: npm run check:supabase (carga backend/.env.local). Nunca imprime credenciales.
const { createClient } = require('@supabase/supabase-js')

function rolDeLaClave(key) {
  if (key.startsWith('sb_publishable_')) return 'anon'
  if (key.startsWith('sb_secret_')) return 'service_role'
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString())
    return payload.role
  } catch {
    return undefined
  }
}

async function main() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    console.error('ERROR: faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en backend/.env.local')
    process.exit(1)
  }

  if (rolDeLaClave(key) === 'anon') {
    console.error('ERROR: SUPABASE_SERVICE_KEY parece ser la anon key. Usa la clave service_role.')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { error, count } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error(`ERROR: ${error.message || error.code || 'fallo al consultar rsvps'}`)
    if (error.code === 'PGRST205' || error.code === '42P01') {
      console.error('La tabla rsvps no existe: ejecuta backend/supabase/schema.sql en el SQL Editor.')
    }
    process.exit(1)
  }

  console.log(`OK: conexión correcta y tabla rsvps disponible (${count} filas).`)
}

main().catch((e) => {
  console.error(`ERROR: ${e.message}`)
  process.exit(1)
})
