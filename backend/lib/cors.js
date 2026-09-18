// CORS limitado a FRONTEND_ORIGIN (sin comodín).
// Peticiones sin cabecera Origin (curl, servidor a servidor) se dejan pasar.

export function isOriginAllowed(request) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  return origin === process.env.FRONTEND_ORIGIN
}

export function corsHeaders(request, methods) {
  const headers = { Vary: 'Origin' }
  const origin = request.headers.get('origin')
  if (origin && origin === process.env.FRONTEND_ORIGIN) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = methods
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
  }
  return headers
}
