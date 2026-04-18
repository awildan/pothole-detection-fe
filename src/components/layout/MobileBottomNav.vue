<script setup lang="ts">
import { Home, Camera, History } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useDetectionStore } from '@/stores/detection'
import { cn } from '@/lib/utils'

const route = useRoute()
const store = useDetectionStore()

const items = [
  { key: 'home', route: '/', label: 'Home', Icon: Home },
  { key: 'history', route: '/history', label: 'History', Icon: History },
] as const

const goHome = (to: string) => {
  if (to === 'home') {
    store.triggerReset()
  }
}
</script>

<template>
  <nav aria-label="Primary" class="fixed inset-x-0 bottom-0 z-40 md:hidden">
    <div class="relative">
      <div
        class="flex h-16 items-stretch border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-background/80"
      >
        <template v-for="item in items" :key="item.key">
          <RouterLink
            :to="item.route"
            :class="
              cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
                route.path === item.key ? 'text-foreground' : 'text-muted-foreground',
              )
            "
            :aria-current="route.path === item.key ? 'page' : undefined"
            @click="goHome(item.key)"
          >
            <component :is="item.Icon" class="size-5" aria-hidden="true" />
            <span class="uppercase tracking-wide">{{ item.label }}</span>
          </RouterLink>
        </template>
      </div>

      <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <RouterLink
          to="/camera"
          type="button"
          aria-label="Open camera"
          :class="
            cn(
              'flex size-16 items-center justify-center rounded-full border-4 border-background bg-foreground text-background shadow-lg transition',
              'hover:bg-foreground/90 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )
          "
        >
          <Camera class="size-6" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
