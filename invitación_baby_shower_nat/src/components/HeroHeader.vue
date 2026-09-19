<script setup>
import { event } from '../content/event.js'
</script>

<template>
  <header style="padding:44px 0 26px;border-bottom:2px dashed var(--color-accent-300)">
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:22px;align-items:center">
      <span class="tag tag-accent" style="border-radius:999px">Es niña</span>
      <span class="tag tag-outline" style="border-radius:999px">Confirmar antes del {{ event.rsvpDeadline }}</span>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:6px">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="animation:floatUp 4s ease-in-out infinite"><path d="M9.5 13h.01"></path><path d="M14.5 13h.01"></path><path d="M10.3 16.6c.5.3 1.1.4 1.7.4s1.2-.1 1.7-.4"></path><path d="M4.6 11.5a2 2 0 0 0 0 3.2 8 8 0 0 0 14.8 0 2 2 0 0 0 0-3.2A8 8 0 0 0 12 7.3a8 8 0 0 0-7.4 4.2Z"></path><path d="M12 7.3c0-1.2 0-2 .4-2.6"></path><path d="M12.4 4.7C13 3 15 2 16.6 3.2c1.2 1 .6 2.5-.6 2.9-1.4.5-3.2-.1-3.6-1.4Z" fill="var(--color-accent)" fill-opacity=".25"></path><path d="M12.4 4.7C11.8 3 9.8 2 8.2 3.2c-1.2 1-.6 2.5.6 2.9 1.4.5 3.2-.1 3.6-1.4Z" fill="var(--color-accent)" fill-opacity=".25"></path></svg>
      <h6 style="margin:0;color:var(--color-accent-700);font-family:var(--font-baby);letter-spacing:.1em">¡Baby Shower!</h6>
    </div>
    <h1 style="font-family:var(--font-baby);font-weight:800;font-size:clamp(44px,10vw,98px);line-height:0.98;margin:0 0 14px;letter-spacing:-0.01em;color:var(--color-accent-700)">{{ event.babyName }}</h1>
    <p style="max-width:44ch;font-size:17px;margin:0">Sábado 10 de octubre de 2026 · 3:00 pm<br>{{ event.address.street }}, {{ event.address.area }}</p>
    <div style="display:flex;gap:10px;margin-top:22px;align-items:center;color:var(--color-accent-400)">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"></path><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"></path></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8"></path><path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"></path><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"></path></svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
    </div>
  </header>
</template>
