<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="h-screen w-full bg-slate-900 flex flex-col items-center justify-center text-white">
    <h1 class="text-5xl font-black text-yellow-400 drop-shadow-lg">Pothole Detector</h1>
    <p class="mt-4 text-lg text-slate-400">
      Deteksi lubang jalan dengan mudah menggunakan teknologi terkini. Cukup unggah foto jalan, dan
      biarkan sistem kami menganalisisnya untuk menemukan lubang yang tersembunyi. Dengan Pothole
      Detector, Anda dapat membantu meningkatkan keselamatan jalan dan mengurangi risiko kecelakaan
      akibat lubang yang tidak terlihat. Mulailah deteksi sekarang dan jadilah bagian dari solusi
      untuk jalan yang lebih aman!
    </p>

    <Button> Mulai Deteksi </Button>
  </div>
</template>

<style scoped></style>
