<script setup lang="ts">
import { ref } from 'vue'
import { ImagePlus, UploadCloud } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  file: [file: File]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const handleFiles = (files: FileList | null) => {
  if (!files || files.length === 0) return
  const file = files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return
  emit('file', file)
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (props.disabled) return
  if (e.dataTransfer) {
    handleFiles(e.dataTransfer.files)
  }
}
</script>

<template>
  <div
    role="button"
    tabindex="0"
    aria-label="Upload a road image"
    @click="!disabled && inputRef?.click()"
    @keydown.enter.prevent="!disabled && inputRef?.click()"
    @keydown.space.prevent="!disabled && inputRef?.click()"
    @dragover.prevent="!disabled && (isDragging = true)"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="onDrop"
    :class="
      cn(
        'group relative flex aspect-4/3 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 text-center transition-colors',
        'hover:border-foreground/40 hover:bg-muted/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isDragging && 'border-foreground/60 bg-muted/70',
        disabled && 'pointer-events-none opacity-60',
      )
    "
  >
    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      class="sr-only"
      @change="(e) => handleFiles((e.target as HTMLInputElement).files)"
    />
    <div
      class="flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-sm"
    >
      <UploadCloud class="size-5 text-muted-foreground" aria-hidden="true" />
    </div>
    <div class="mt-4 space-y-1">
      <p class="text-sm font-medium text-foreground text-balance">
        Drop a road image here, or click to browse
      </p>
      <p class="text-xs text-muted-foreground">PNG, JPG, or WEBP · up to 10MB</p>
    </div>
    <div
      class="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
    >
      <ImagePlus class="size-3.5" aria-hidden="true" />
      Select image
    </div>
  </div>
</template>
