<script setup lang="ts">
import { Clock } from "lucide-vue-next"
import { Card, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">History</h1>
      <p class="text-sm text-muted-foreground">Your past detections will appear here.</p>
    </div>

    <Card>
      <CardContent class="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Clock class="h-5 w-5 text-muted-foreground" />
        </div>
        <div class="space-y-1">
          <div class="text-sm font-semibold">No detections yet</div>
          <p class="max-w-xs text-xs text-muted-foreground">
            Once you run a detection it will be saved here for quick access on this device.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
