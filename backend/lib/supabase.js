import { createClient } from '@supabase/supabase-js'

let client

// Solo se usa en el servidor de Next.js, con la clave de servicio.
export function getSupabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) {
      throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en backend/.env.local')
    }
    client = createClient(url, key, { auth: { persistSession: false } })
  }
  return client
}
