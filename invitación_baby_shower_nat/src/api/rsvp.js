const API_URL = import.meta.env.VITE_API_URL

export class RsvpError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

// POST /api/rsvp. Lanza RsvpError con el código de la API, o "network" si no hubo respuesta.
export async function sendRsvp({ name, guests, message, website }) {
  let res
  try {
    res = await fetch(`${API_URL}/api/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, guests, message, website }),
    })
  } catch {
    throw new RsvpError('network')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // respuesta sin JSON válido
  }

  if (!res.ok || !data?.ok) throw new RsvpError(data?.error ?? 'server_error')
}
