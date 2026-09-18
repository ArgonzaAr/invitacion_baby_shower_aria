<script setup>
import { ref } from 'vue'
import { event } from '../content/event.js'

const failed = ref(false)
</script>

<template>
  <figure style="margin:0">
    <img v-if="!failed" :src="event.photo" :alt="`Foto de los papás de ${event.babyName}`" style="display:block;aspect-ratio:4/5;width:100%;max-width:402px;object-fit:cover;border:2px solid var(--color-accent-300);border-radius:24px;box-sizing:border-box" @error="failed = true">
    <div v-else style="aspect-ratio:4/5;background:var(--color-accent-100);border:2px dashed var(--color-accent-300);border-radius:24px;display:flex;flex-direction:column;justify-content:space-between;padding:18px;width:100%;max-width:402px;box-sizing:border-box">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-400)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"></path><path d="M15 12h.01"></path><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5.5 3.5.5"></path></svg>
      <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-800)">Espacio para foto</span>
    </div>
  </figure>
</template>
