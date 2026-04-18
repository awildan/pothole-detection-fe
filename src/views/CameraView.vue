<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDetectionStore } from '@/stores/detection'
import CameraComponent from '@/components/CameraView.vue'
const router = useRouter()
const store = useDetectionStore()

const handleCapture = (dataUrl: string) => {
  store.setCapturedImage(dataUrl)
  router.push('/')
}

const handleClose = () => {
  router.back()
}
</script>

<template>
  <CameraComponent @close="handleClose" @capture="handleCapture" />
</template>
