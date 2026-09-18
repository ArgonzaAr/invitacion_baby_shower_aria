<script setup>
import { event } from '../content/event.js'
import { downloadIcs } from '../utils/calendar.js'
</script>

<template>
  <section style="padding:34px 0;border-bottom:2px dashed var(--color-accent-300)">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr));gap:14px">
      <div style="background:var(--color-accent-100);border:2px solid var(--color-accent-200);border-radius:20px;padding:20px 18px">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:10px"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="4"></rect><path d="M3 10h18"></path></svg>
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-700);margin-bottom:6px">Fecha</div>
        <div style="font-family:var(--font-baby);font-weight:800;font-size:25px;line-height:1.1">Sábado 10<br>de octubre</div>
      </div>
      <div style="background:var(--color-accent-100);border:2px solid var(--color-accent-200);border-radius:20px;padding:20px 18px">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:10px"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-700);margin-bottom:6px">Hora</div>
        <div style="font-family:var(--font-baby);font-weight:800;font-size:25px;line-height:1.1">3:00 pm</div>
      </div>
      <div style="background:var(--color-accent-100);border:2px solid var(--color-accent-200);border-radius:20px;padding:20px 18px">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:10px"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-700);margin-bottom:6px">Dirección</div>
        <div style="font-size:15px;line-height:1.4">{{ event.address.street }}<br>{{ event.address.area }}<br>C.P. {{ event.address.zip }}</div>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px">
      <a class="btn btn-primary" href="https://www.google.com/maps/search/?api=1&query=Calle+Hidalgo+159+San+Pablo+Tepetlapa+04620" target="_blank" rel="noopener" style="text-decoration:none;border-radius:999px;min-height:46px">Ver en Google Maps</a>
      <button class="btn btn-secondary" type="button" style="border-radius:999px;min-height:46px" @click="downloadIcs(event)">Agregar al calendario</button>
    </div>
  </section>
</template>
