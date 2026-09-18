<script setup>
import HeroHeader from '../components/HeroHeader.vue'
import WelcomeSection from '../components/WelcomeSection.vue'
import EventDetails from '../components/EventDetails.vue'
import RsvpSection from '../components/RsvpSection.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <div style="max-width:940px;margin:0 auto;padding:24px 20px 64px">
    <div style="background:var(--color-surface);border:2px solid var(--color-accent-300);border-radius:28px;padding:0 clamp(18px,4vw,40px) 36px;box-shadow:0 18px 44px rgba(147,31,72,.10)">
      <HeroHeader />
      <WelcomeSection />
      <EventDetails />
      <RsvpSection />
      <SiteFooter />
    </div>
  </div>
</template>
