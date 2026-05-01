<script setup lang="ts">
import { Github, History } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70"
  >
    <div class="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 md:px-6">
      <RouterLink to="/" class="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <img
          src="/public/android-chrome-192x192.png"
          alt="pothole-detect-logo"
          class="size-8 rounded-md"
        />
        <div class="flex items-baseline gap-2">
          <span class="text-sm font-semibold tracking-tight"> PotholeDetect </span>
          <span
            class="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline"
          >
            v1.0
          </span>
        </div>
      </RouterLink>

      <div class="flex items-center gap-2">
        <Button
          as-child
          variant="ghost"
          size="sm"
          class="hidden md:flex gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RouterLink to="/history">
            <History class="size-4" />
            History
          </RouterLink>
        </Button>

        <Button
          as="a"
          variant="ghost"
          size="icon"
          class="text-muted-foreground"
          aria-label="View source"
          href="https://github.com/stars/awildan/lists/pothole-detection"
          target="_blank"
          rel="noopener"
        >
          <Github class="size-4" />
        </Button>
      </div>
    </div>
  </header>
</template>
