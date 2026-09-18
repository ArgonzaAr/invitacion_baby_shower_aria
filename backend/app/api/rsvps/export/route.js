import { requireAdmin } from '../../../../lib/auth.js'
import { corsHeaders, isOriginAllowed } from '../../../../lib/cors.js'
import { listRsvps, toCsv } from '../../../../lib/rsvps.js'

const METHODS = 'GET, OPTIONS'

export function OPTIONS(request) {
  if (!isOriginAllowed(request)) return new Response(null, { status: 403 })
  return new Response(null, { status: 204, headers: corsHeaders(request, METHODS) })
}

export async function GET(request) {
  if (!isOriginAllowed(request)) {
    return Response.json({ ok: false, error: 'forbidden_origin' }, { status: 403 })
  }
  const denied = requireAdmin(request, METHODS)
  if (denied) return denied

  try {
    const items = await listRsvps()
    // BOM para que Excel muestre bien los acentos.
    return new Response('﻿' + toCsv(items), {
      headers: {
        ...corsHeaders(request, METHODS),
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="confirmaciones.csv"',
      },
    })
  } catch (err) {
    console.error('Error al exportar confirmaciones:', err.message)
    return Response.json(
      { ok: false, error: 'server_error' },
      { status: 500, headers: corsHeaders(request, METHODS) },
    )
  }
}
