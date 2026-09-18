import { getSupabase } from '../../../lib/supabase.js'
import { corsHeaders, isOriginAllowed } from '../../../lib/cors.js'
import { notifyRsvp } from '../../../lib/telegram.js'

const METHODS = 'POST, OPTIONS'

function json(request, body, status) {
  return Response.json(body, { status, headers: corsHeaders(request, METHODS) })
}

function validate(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (name.length < 1 || name.length > 120) return { error: 'name_required' }

  const guests = body.guests ?? 0
  if (!Number.isInteger(guests) || guests < 0 || guests > 8) return { error: 'guests_invalid' }

  const rawMessage = body.message ?? ''
  if (typeof rawMessage !== 'string' || rawMessage.length > 500) return { error: 'message_too_long' }
  const message = rawMessage.trim() || null

  return { value: { name, guests, message } }
}

export function OPTIONS(request) {
  if (!isOriginAllowed(request)) return new Response(null, { status: 403 })
  return new Response(null, { status: 204, headers: corsHeaders(request, METHODS) })
}

export async function POST(request) {
  if (!isOriginAllowed(request)) {
    return Response.json({ ok: false, error: 'forbidden_origin' }, { status: 403 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    body = null
  }
  if (!body || typeof body !== 'object') body = {}

  // Honeypot: si trae contenido se responde 201 sin guardar nada.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(request, { ok: true }, 201)
  }

  const { value, error } = validate(body)
  if (error) return json(request, { ok: false, error }, 400)

  try {
    const { error: dbError } = await getSupabase().from('rsvps').insert(value)
    if (dbError) throw dbError
  } catch (err) {
    console.error('Error al guardar la confirmación:', err.message)
    return json(request, { ok: false, error: 'server_error' }, 500)
  }

  await notifyRsvp(value)
  return json(request, { ok: true }, 201)
}
