/**
 * Type definitions for the Pothole Detection API response.
 *
 * Maps to the backend schema returned by POST /api/v1/predict.
 */

// ── Individual detection ────────────────────────────────────────────

export interface Detection {
  class_id: number
  class_name: string
  confidence: number
  bbox: {
    x_min: number
    y_min: number
    x_max: number
    y_max: number
  }
  area_pixels: number
}

// ── Per-model summary stats ─────────────────────────────────────────

export interface ModelSummary {
  total_detections: number
  average_confidence: number
  inference_time_ms: number
}

// ── Single model result ─────────────────────────────────────────────

export interface ModelResult {
  model_name: string
  predicted_image_url: string
  detections: Detection[]
  summary: ModelSummary
}

// ── Image metadata ──────────────────────────────────────────────────

export interface ImageMetadata {
  width: number
  height: number
  format: string
}

// ── Full prediction payload (inside `data`) ─────────────────────────

export interface PredictionData {
  prediction_id: string
  original_image_url: string
  image_metadata: ImageMetadata
  models_used: string[]
  results: ModelResult[]
  created_at: string
}

// ── Top-level API response ──────────────────────────────────────────

export interface PredictionResponse {
  success: boolean
  message: string
  data: PredictionData
}

// ── Accent colors per model (used for UI styling) ───────────────────

export const MODEL_COLORS: Record<string, string> = {
  rtdetr: '#ea580c', // orange-600
  yolo11: '#0ea5e9', // sky-500
  yolo26: '#8b5cf6', // violet-500
  yolov8: '#10b981', // emerald-500
}

// ── Human-readable model labels ─────────────────────────────────────

export const MODEL_LABELS: Record<string, string> = {
  rtdetr: 'RT-DETR',
  yolo11: 'YOLO11',
  yolo26: 'YOLO26',
  yolov8: 'YOLOv8',
}
