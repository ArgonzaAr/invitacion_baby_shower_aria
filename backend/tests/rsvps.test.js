import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toCsv, totalAttendees } from '../lib/rsvps.js'

test('totalAttendees cuenta al invitado más sus acompañantes', () => {
  assert.equal(totalAttendees([{ guests: 0 }, { guests: 2 }]), 4)
  assert.equal(totalAttendees([]), 0)
})

test('toCsv escapa comillas y saltos de línea', () => {
  const csv = toCsv([{ name: 'Ana "la" Pérez', guests: 1, message: 'a,b\nc', created_at: 'x' }])
  assert.equal(csv, 'name,guests,message,created_at\r\n"Ana ""la"" Pérez",1,"a,b\nc",x\r\n')
})

test('toCsv neutraliza fórmulas de Excel', () => {
  const csv = toCsv([{ name: '=SUM(A1)', guests: 0, message: null, created_at: 'x' }])
  assert.match(csv, /\r\n'=SUM\(A1\),0,,x\r\n$/)
})
