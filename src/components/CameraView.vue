<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Camera, RefreshCw, Upload, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const emit = defineEmits<{
  close: []
  capture: [dataUrl: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const shot = ref<string | null>(null)
const error = ref<string | null>(null)
const streaming = ref(false)

let mediaStream: MediaStream | null = null

const startCamera = async () => {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      error.value = 'Camera not supported on this device.'
      return
    }
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      await videoRef.value.play()
      streaming.value = true
    }
  } catch (err) {
    error.value = 'Camera permission denied or unavailable.'
    console.error('Error accessing camera:', err)
  }
}

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
  }
}

onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})

const capture = () => {
  const video = videoRef.value
  const canvas = canvasRef.value
  if (!video || !canvas) return

  canvas.width = video.videoWidth || 1280
  canvas.height = video.videoHeight || 720

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  const url = canvas.toDataURL('image/jpeg', 0.9)
  shot.value = url
}

const retake = () => {
  shot.value = null
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-black text-white">
    <div class="flex items-center justify-between px-4 py-3">
      <Button
        variant="ghost"
        size="icon"
        @click="emit('close')"
        class="text-white hover:bg-white/10 hover:text-white"
        aria-label="Close camera"
      >
        <X class="size-5" />
      </Button>
      <span class="font-mono text-xs uppercase tracking-wider text-white/70">
        {{ shot ? 'Preview' : 'Viewfinder' }}
      </span>
      <div class="size-9"></div>
    </div>

    <div class="relative flex-1 overflow-hidden">
      <template v-if="!shot">
        <video
          ref="videoRef"
          class="absolute inset-0 h-full w-full object-cover"
          playsinline
          muted
        ></video>
        <div class="pointer-events-none absolute inset-6 rounded-xl border border-white/30"></div>
        <div
          class="pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
        ></div>

        <div
          v-if="error"
          class="absolute inset-0 flex items-center justify-center bg-black/60 px-6 text-center"
        >
          <p class="max-w-xs text-sm text-white/80">{{ error }}</p>
        </div>

        <div v-if="!streaming && !error" class="absolute inset-0 flex items-center justify-center">
          <p class="font-mono text-xs text-white/60">Starting camera…</p>
        </div>
      </template>

      <template v-else>
        <img :src="shot" alt="Captured preview" class="h-full w-full object-cover" />
      </template>
    </div>

    <div class="bg-black/90 px-6 pb-[calc(env(safe-area-inset-bottom,0)+1.5rem)] pt-6">
      <template v-if="!shot">
        <div class="flex items-center justify-center">
          <button
            type="button"
            @click="capture"
            aria-label="Capture photo"
            class="group relative flex size-20 items-center justify-center rounded-full border-4 border-white/90 transition active:scale-95 disabled:opacity-50"
            :disabled="!streaming"
          >
            <span class="size-14 rounded-full bg-white transition group-active:bg-white/80"></span>
          </button>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center gap-3">
          <Button
            variant="outline"
            @click="retake"
            class="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <RefreshCw class="mr-2 size-4" />
            Retake
          </Button>
          <Button
            @click="emit('capture', shot!)"
            class="flex-1 bg-white text-black hover:bg-white/90"
          >
            <Upload class="mr-2 size-4" />
            Upload & Detect
          </Button>
        </div>
      </template>
    </div>

    <canvas ref="canvasRef" class="hidden"></canvas>

    <span class="sr-only"> <Camera /> camera view active </span>
  </div>
</template>
