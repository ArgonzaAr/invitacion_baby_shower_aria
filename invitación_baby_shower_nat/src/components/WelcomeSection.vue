<script setup>
import { event } from '../content/event.js'
import PhotoImage from './PhotoImage.vue'
</script>

<template>
  <section style="padding:34px 0;border-bottom:2px dashed var(--color-accent-300)">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:28px;align-items:start">
      <div>
        <h2 style="font-family:var(--font-baby);font-weight:800;font-size:clamp(26px,4vw,40px);margin:0 0 14px;max-width:22ch;line-height:1.1">Pronto llega Nat.</h2>
        <p style="max-width:48ch;font-size:16px;text-wrap:pretty">Estamos contando los días para conocerla, y queremos esperarla acompañados de la gente que más queremos. Ven a celebrar con nosotros una tarde tranquila, con comida, juegos y muchas ganas de abrazarla pronto.</p>
        <p style="max-width:48ch;font-size:16px;text-wrap:pretty">Tu compañía es lo más importante del día.</p>
        <div style="margin-top:22px;padding-top:18px;border-top:2px dashed var(--color-accent-300);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr));gap:18px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-top:2px"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            <div>
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-700);margin-bottom:4px">Mamá</div>
              <div style="font-family:var(--font-baby);font-weight:600;font-size:19px;line-height:1.2">{{ event.mother }}</div>
            </div>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-top:2px"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            <div>
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-700);margin-bottom:4px">Papá</div>
              <div style="font-family:var(--font-baby);font-weight:600;font-size:19px;line-height:1.2">{{ event.father }}</div>
            </div>
          </div>
        </div>
      </div>
      <PhotoImage />
    </div>
  </section>
</template>
