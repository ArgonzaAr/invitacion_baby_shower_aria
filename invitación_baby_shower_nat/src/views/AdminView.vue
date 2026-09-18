<script setup>
import { onMounted, ref } from 'vue'
import { downloadCsv, fetchRsvps } from '../api/admin.js'

const STORAGE_KEY = 'admin-password'

const password = ref('')
const input = ref('')
const data = ref(null)
const loading = ref(false)
const error = ref('')

// La clave solo vive en sessionStorage (se borra al cerrar la pestaña).
function readStored() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}
function writeStored(value) {
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, value)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // sin sessionStorage: la sesión dura solo mientras la página siga abierta
  }
}

const ERRORS = {
  unauthorized: 'Clave incorrecta.',
  network: 'No pudimos conectar con el servidor.',
  server_error: 'El servidor tuvo un problema. Inténtalo de nuevo.',
}

async function load(candidate) {
  loading.value = true
  error.value = ''
  try {
    data.value = await fetchRsvps(candidate)
    password.value = candidate
    writeStored(candidate)
  } catch (err) {
    data.value = null
    password.value = ''
    if (err.code === 'unauthorized') writeStored('')
    error.value = ERRORS[err.code] ?? ERRORS.server_error
  } finally {
    loading.value = false
  }
}

function login() {
  if (input.value && !loading.value) load(input.value)
}

function logout() {
  data.value = null
  password.value = ''
  input.value = ''
  error.value = ''
  writeStored('')
}

async function exportCsv() {
  error.value = ''
  try {
    await downloadCsv(password.value)
  } catch (err) {
    error.value = ERRORS[err.code] ?? ERRORS.server_error
    if (err.code === 'unauthorized') logout()
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
}

onMounted(() => {
  const stored = readStored()
  if (stored) load(stored)
})
</script>

<template>
  <div style="max-width:940px;margin:0 auto;padding:24px 20px 64px">
    <div style="background:var(--color-surface);border:2px solid var(--color-accent-300);border-radius:28px;padding:32px clamp(18px,4vw,40px);box-shadow:0 18px 44px rgba(147,31,72,.10)">
      <h1 style="font-family:var(--font-baby);font-weight:800;font-size:clamp(28px,5vw,44px);margin:0 0 20px;color:var(--color-accent-700)">Confirmaciones</h1>

      <form v-if="!data" style="display:flex;flex-direction:column;gap:16px;max-width:360px" @submit.prevent="login">
        <div class="field">
          <label for="admin-pass">Clave de acceso</label>
          <input id="admin-pass" v-model="input" class="input" type="password" autocomplete="current-password" :disabled="loading" style="border-radius:14px;min-height:46px">
        </div>
        <p v-if="error" role="alert" style="margin:0;color:var(--color-accent-800);font-size:14px">{{ error }}</p>
        <button class="btn btn-primary" type="submit" :disabled="loading || !input" style="border-radius:999px;min-height:46px">
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <template v-else>
        <div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:20px">
          <div style="background:var(--color-accent-100);border:2px solid var(--color-accent-200);border-radius:20px;padding:14px 20px">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-700)">Confirmaciones</div>
            <div style="font-family:var(--font-baby);font-weight:800;font-size:30px">{{ data.totalRows }}</div>
          </div>
          <div style="background:var(--color-accent-100);border:2px solid var(--color-accent-200);border-radius:20px;padding:14px 20px">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-700)">Total de asistentes</div>
            <div style="font-family:var(--font-baby);font-weight:800;font-size:30px">{{ data.totalAttendees }}</div>
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px">
          <button class="btn btn-primary" type="button" style="border-radius:999px;min-height:46px" @click="exportCsv">Exportar CSV</button>
          <button class="btn btn-secondary" type="button" :disabled="loading" style="border-radius:999px;min-height:46px" @click="load(password)">Actualizar</button>
          <button class="btn btn-secondary" type="button" style="border-radius:999px;min-height:46px" @click="logout">Salir</button>
        </div>
        <p v-if="error" role="alert" style="margin:0 0 16px;color:var(--color-accent-800);font-size:14px">{{ error }}</p>

        <p v-if="!data.items.length" style="margin:0">Todavía no hay confirmaciones.</p>
        <div v-else style="overflow-x:auto">
          <table class="table">
            <thead>
              <tr><th>Nombre</th><th>Acompañantes</th><th>Mensaje</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in data.items" :key="row.id">
                <td>{{ row.name }}</td>
                <td>{{ row.guests }}</td>
                <td>{{ row.message }}</td>
                <td style="white-space:nowrap">{{ formatDate(row.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
