const API_URL = import.meta.env.VITE_API_URL

export class AdminError extends Error {
  constructor(code) {
    super(code)
    this.code = code // "unauthorized" | "network" | "server_error"
  }
}

async function adminFetch(path, password) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${password}` } })
  } catch {
    throw new AdminError('network')
  }
  if (res.status === 401) throw new AdminError('unauthorized')
  if (!res.ok) throw new AdminError('server_error')
  return res
}

// -> { items, totalRows, totalAttendees }
export async function fetchRsvps(password) {
  const res = await adminFetch('/api/rsvps', password)
  return res.json()
}

export async function downloadCsv(password, filename = 'confirmaciones.csv') {
  const res = await adminFetch('/api/rsvps/export', password)
  const url = URL.createObjectURL(await res.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
