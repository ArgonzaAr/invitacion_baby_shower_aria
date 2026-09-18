import { getSupabase } from './supabase.js'

export async function listRsvps() {
  const { data, error } = await getSupabase()
    .from('rsvps')
    .select('id, name, guests, message, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Cada fila cuenta como 1 + guests asistentes.
export function totalAttendees(items) {
  return items.reduce((sum, row) => sum + 1 + row.guests, 0)
}

function csvCell(value) {
  let text = value == null ? '' : String(value)
  // Evita que Excel interprete el texto como fórmula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(items) {
  const header = 'name,guests,message,created_at'
  const rows = items.map((r) => [r.name, r.guests, r.message, r.created_at].map(csvCell).join(','))
  return [header, ...rows].join('\r\n') + '\r\n'
}
