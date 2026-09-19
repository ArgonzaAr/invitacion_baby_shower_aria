<script setup>
import { ref } from 'vue'
import { event } from '../content/event.js'

const failed = ref(false)
</script>

<template>
  <figure style="margin:0">
    <img v-if="!failed" :src="event.photo" :alt="`Foto de los papás de ${event.babyName}`" style="display:block;aspect-ratio:4/5;width:100%;max-width:402px;object-fit:cover;border:2px solid var(--color-accent-300);border-radius:24px;box-sizing:border-box" @error="failed = true">
    <div v-else style="aspect-ratio:4/5;background:var(--color-accent-100);border:2px dashed var(--color-accent-300);border-radius:24px;display:flex;flex-direction:column;justify-content:space-between;padding:18px;width:100%;max-width:402px;box-sizing:border-box">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-400)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 13h.01"></path><path d="M14.5 13h.01"></path><path d="M10.3 16.6c.5.3 1.1.4 1.7.4s1.2-.1 1.7-.4"></path><path d="M4.6 11.5a2 2 0 0 0 0 3.2 8 8 0 0 0 14.8 0 2 2 0 0 0 0-3.2A8 8 0 0 0 12 7.3a8 8 0 0 0-7.4 4.2Z"></path><path d="M12 7.3c0-1.2 0-2 .4-2.6"></path><path d="M12.4 4.7C13 3 15 2 16.6 3.2c1.2 1 .6 2.5-.6 2.9-1.4.5-3.2-.1-3.6-1.4Z" fill="var(--color-accent-400)" fill-opacity=".25"></path><path d="M12.4 4.7C11.8 3 9.8 2 8.2 3.2c-1.2 1-.6 2.5.6 2.9 1.4.5 3.2-.1 3.6-1.4Z" fill="var(--color-accent-400)" fill-opacity=".25"></path></svg>
      <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-800)">Espacio para foto</span>
    </div>
  </figure>
</template>
