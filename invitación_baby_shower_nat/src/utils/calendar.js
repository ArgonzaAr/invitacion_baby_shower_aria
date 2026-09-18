const pad = (n) => String(n).padStart(2, '0')

// "2026-10-10T15:00:00" -> "20261010T150000" (hora local flotante, sin zona)
function toLocalStamp(isoLocal) {
  return isoLocal.replace(/[-:]/g, '').slice(0, 15)
}

function toUtcStamp(date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

function escapeText(text) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export function buildIcs(event, now = new Date()) {
  const { street, area, zip } = event.address
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitacion Baby Shower//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:baby-shower-${toLocalStamp(event.startsAt)}@invitacion-baby-shower`,
    `DTSTAMP:${toUtcStamp(now)}`,
    `DTSTART:${toLocalStamp(event.startsAt)}`,
    `SUMMARY:${escapeText(`Baby Shower de ${event.babyName}`)}`,
    `LOCATION:${escapeText(`${street}, ${area}, C.P. ${zip}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n') + '\r\n'
}

export function downloadIcs(event, filename = 'baby-shower-aria.ics') {
  const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
