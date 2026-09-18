<script setup>
import { ref } from 'vue'
import { event } from '../content/event.js'

const failed = ref(false)
</script>

<template>
  <figure style="margin:20px 0 0">
    <img v-if="!failed" :src="event.ultrasound" :alt="`Ultrasonido de ${event.babyName}`" style="display:block;aspect-ratio:4/3;width:100%;object-fit:cover;border:2px solid var(--color-accent-300);border-radius:24px;box-sizing:border-box" @error="failed = true">
    <div v-else style="aspect-ratio:4/3;background:var(--color-accent-100);border:2px dashed var(--color-accent-300);border-radius:24px;display:flex;flex-direction:column;justify-content:space-between;padding:18px">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-400)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"></path><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"></path></svg>
      <span style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--color-accent-800)">Espacio para el ultrasonido</span>
    </div>
  </figure>
</template>
