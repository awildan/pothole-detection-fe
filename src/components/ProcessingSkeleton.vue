<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <Loader2 class="size-4 animate-spin" />
      <span class="font-mono uppercase tracking-wider">
        Running inference · RT-DETR &amp; YOLO
      </span>
    </div>

    <div class="flex items-center gap-2">
      <Skeleton class="h-8 w-28 rounded-md" />
      <Skeleton class="h-8 w-28 rounded-md" />
    </div>

    <Skeleton class="aspect-[4/3] w-full rounded-lg" />

    <div class="space-y-2">
      <Skeleton class="h-10 w-full rounded-md" />
      <Skeleton class="h-10 w-full rounded-md" />
      <Skeleton class="h-10 w-4/5 rounded-md" />
    </div>
  </div>
</template>