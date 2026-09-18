import { timingSafeEqual } from 'node:crypto'
import { corsHeaders } from './cors.js'

function safeEqual(a, b) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

// Verifica "Authorization: Bearer <ADMIN_PASSWORD>".
// Devuelve una Response 401 si falla, o null si la clave es correcta.
export function requireAdmin(request, methods) {
  const expected = process.env.ADMIN_PASSWORD
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!expected || !token || !safeEqual(token, expected)) {
    return Response.json(
      { ok: false, error: 'unauthorized' },
      { status: 401, headers: corsHeaders(request, methods) },
    )
  }
  return null
}
