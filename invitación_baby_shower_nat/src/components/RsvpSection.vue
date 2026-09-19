<script setup>
import { computed, reactive, ref } from 'vue'
import { event } from '../content/event.js'
import UltrasoundImage from './UltrasoundImage.vue'
import { sendRsvp } from '../api/rsvp.js'

// idle | sending | sent | error
const status = ref('idle')
const errorMessage = ref('')

const form = reactive({ name: '', guests: 1, message: '', website: '' })

const sending = computed(() => status.value === 'sending')

function validate() {
  if (!form.name.trim()) return 'Escribe tu nombre para confirmar.'
  if (form.name.trim().length > 120) return 'El nombre es demasiado largo (máximo 120 caracteres).'
  if (!Number.isInteger(form.guests) || form.guests < 0 || form.guests > 8) {
    return 'El número de acompañantes debe ser un entero entre 0 y 8.'
  }
  if (form.message.length > 500) return 'El mensaje es demasiado largo (máximo 500 caracteres).'
  return ''
}

const API_ERRORS = {
  name_required: 'Escribe tu nombre para confirmar.',
  guests_invalid: 'El número de acompañantes debe ser un entero entre 0 y 8.',
  message_too_long: 'El mensaje es demasiado largo (máximo 500 caracteres).',
  network: 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
}
const GENERIC_ERROR = 'No pudimos enviar tu confirmación. Inténtalo de nuevo.'

async function submit() {
  if (sending.value) return
  const problem = validate()
  if (problem) {
    errorMessage.value = problem
    status.value = 'error'
    return
  }
  errorMessage.value = ''
  status.value = 'sending'
  try {
    await sendRsvp({ ...form })
    status.value = 'sent'
  } catch (err) {
    errorMessage.value = API_ERRORS[err.code] ?? GENERIC_ERROR
    status.value = 'error'
  }
}

function reset() {
  form.name = ''
  form.guests = 1
  form.message = ''
  form.website = ''
  errorMessage.value = ''
  status.value = 'idle'
}
</script>

<template>
  <section style="padding:34px 0 0">
    <h2 style="font-family:var(--font-baby);font-weight:800;font-size:clamp(26px,4vw,40px);margin:0 0 20px;max-width:20ch;line-height:1.1">Confírmanos antes del {{ event.rsvpDeadline }}.</h2>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:32px;align-items:stretch">
      <UltrasoundImage />

      <div v-if="status === 'sent'" style="border:2px solid var(--color-accent);background:var(--color-accent-100);border-radius:24px;padding:26px 22px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;box-sizing:border-box">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:10px"><path d="M9.5 13h.01"></path><path d="M14.5 13h.01"></path><path d="M10.3 16.6c.5.3 1.1.4 1.7.4s1.2-.1 1.7-.4"></path><path d="M4.6 11.5a2 2 0 0 0 0 3.2 8 8 0 0 0 14.8 0 2 2 0 0 0 0-3.2A8 8 0 0 0 12 7.3a8 8 0 0 0-7.4 4.2Z"></path><path d="M12 7.3c0-1.2 0-2 .4-2.6"></path><path d="M12.4 4.7C13 3 15 2 16.6 3.2c1.2 1 .6 2.5-.6 2.9-1.4.5-3.2-.1-3.6-1.4Z" fill="var(--color-accent)" fill-opacity=".25"></path><path d="M12.4 4.7C11.8 3 9.8 2 8.2 3.2c-1.2 1-.6 2.5.6 2.9 1.4.5 3.2-.1 3.6-1.4Z" fill="var(--color-accent)" fill-opacity=".25"></path></svg>
        <h3 style="margin:0 0 8px;font-family:var(--font-baby);font-weight:800;font-size:26px;color:var(--color-accent-800)">¡Gracias, te esperamos!</h3>
        <p style="margin:0 0 16px;font-size:15px">Tu confirmación quedó registrada.</p>
        <button class="btn btn-secondary" type="button" style="border-radius:999px;min-height:44px" @click="reset">Enviar otra respuesta</button>
      </div>

      <form v-else novalidate style="display:flex;flex-direction:column;gap:16px;border:2px solid var(--color-accent-200);border-radius:24px;padding:24px 22px;background:var(--color-accent-100)" @submit.prevent="submit">
        <div class="field">
          <label for="a-nombre">Nombre completo</label>
          <input id="a-nombre" v-model="form.name" class="input" type="text" placeholder="Escribe tu nombre" autocomplete="name" :disabled="sending" style="border-radius:14px;min-height:46px;background:#fff">
        </div>
        <div class="field">
          <label for="a-inv">Número de acompañantes</label>
          <input id="a-inv" v-model.number="form.guests" class="input" type="number" min="0" max="8" :disabled="sending" style="border-radius:14px;min-height:46px;background:#fff">
        </div>
        <div class="field">
          <label for="a-msg">Mensaje para la mamá <span style="opacity:.6">(opcional)</span></label>
          <textarea id="a-msg" v-model="form.message" class="input" placeholder="Unas palabras para Alexandra y Aria…" :disabled="sending" style="border-radius:14px;background:#fff"></textarea>
        </div>

        <!-- Honeypot: oculto para personas, los bots suelen llenarlo -->
        <div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">
          <label for="a-web">Sitio web</label>
          <input id="a-web" v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off">
        </div>

        <p v-if="status === 'error'" role="alert" style="margin:0;padding:10px 14px;border-radius:14px;background:#fff;border:2px solid var(--color-accent);color:var(--color-accent-800);font-size:14px">{{ errorMessage }}</p>

        <button class="btn btn-primary btn-block" type="submit" :disabled="sending" style="border-radius:999px;min-height:48px">
          {{ sending ? 'Enviando…' : status === 'error' ? 'Reintentar' : 'Confirmar asistencia' }}
        </button>
      </form>
    </div>
  </section>
</template>
