<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'
</script>

<template>
  <div class="min-h-dvh bg-muted/40 pb-24 md:pb-10 text-foreground flex flex-col font-sans">
    <AppHeader />

    <main class="mx-auto w-full max-w-3xl px-4 py-6 md:px-6 md:py-10 flex-1">
      <RouterView />
    </main>

    <MobileBottomNav />
  </div>
</template>
