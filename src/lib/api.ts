import axios from 'axios'
import type { PredictionResponse } from './pothole-detections'

// ── Axios instance ──────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    Accept: 'application/json',
  },
})

// ── Predict endpoint ────────────────────────────────────────────────

/**
 * Upload an image file to the backend for pothole detection.
 *
 * Sends the file as `multipart/form-data` to POST /api/v1/predict.
 * The backend runs inference with all registered models and returns
 * predicted images with bounding boxes drawn and per-model summaries.
 */
export async function predictPothole(file: File): Promise<PredictionResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<PredictionResponse>('/api/v1/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export default api
