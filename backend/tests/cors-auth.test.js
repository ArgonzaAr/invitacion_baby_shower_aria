import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { corsHeaders, isOriginAllowed } from '../lib/cors.js'
import { requireAdmin } from '../lib/auth.js'

const req = (headers = {}) => new Request('http://localhost/api', { headers })

beforeEach(() => {
  process.env.FRONTEND_ORIGIN = 'https://front.example.com'
  process.env.ADMIN_PASSWORD = 'secreta'
})

test('CORS permite solo el origen exacto o sin Origin', () => {
  assert.equal(isOriginAllowed(req()), true)
  assert.equal(isOriginAllowed(req({ origin: 'https://front.example.com' })), true)
  assert.equal(isOriginAllowed(req({ origin: 'https://otro.com' })), false)
})

test('corsHeaders no expone Allow-Origin a orígenes ajenos', () => {
  const h = corsHeaders(req({ origin: 'https://otro.com' }), 'GET')
  assert.equal(h['Access-Control-Allow-Origin'], undefined)
})

test('requireAdmin devuelve 401 sin token o con token incorrecto', async () => {
  assert.equal((await requireAdmin(req(), 'GET')).status, 401)
  assert.equal(requireAdmin(req({ authorization: 'Bearer mala' }), 'GET').status, 401)
})

test('requireAdmin acepta la contraseña correcta', () => {
  assert.equal(requireAdmin(req({ authorization: 'Bearer secreta' }), 'GET'), null)
})

test('requireAdmin rechaza todo si ADMIN_PASSWORD no está definida', () => {
  delete process.env.ADMIN_PASSWORD
  assert.equal(requireAdmin(req({ authorization: 'Bearer ' }), 'GET').status, 401)
})
