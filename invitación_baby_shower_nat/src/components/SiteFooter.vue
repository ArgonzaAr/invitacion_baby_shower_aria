<script setup>
import { event } from '../content/event.js'
</script>

<template>
  <footer style="margin-top:34px;padding-top:24px;border-top:2px dashed var(--color-accent-300);display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;font-size:13px;color:color-mix(in srgb,var(--color-text) 55%,transparent)">
    <span>Baby Shower de {{ event.babyName }}</span>
    <span>Alexandra &amp; Angel · 10.10.2026</span>
  </footer>
</template>
