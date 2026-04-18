export type BoundingBox = {
  id: string
  /** percentages (0–100) of image dimensions */
  x: number
  y: number
  w: number
  h: number
  label: string
  confidence: number
}

export type ModelKey = "rt-detr" | "yolo"

export type ModelResult = {
  key: ModelKey
  name: string
  latencyMs: number
  boxes: BoundingBox[]
}

/**
 * Mock detections used to simulate the output of the two models.
 * Values are in percentages so they scale with the rendered image.
 */
export const MOCK_RESULTS: Record<ModelKey, ModelResult> = {
  "rt-detr": {
    key: "rt-detr",
    name: "RT-DETR",
    latencyMs: 184,
    boxes: [
      { id: "r1", x: 12, y: 44, w: 24, h: 20, label: "Pothole", confidence: 0.92 },
      { id: "r2", x: 54, y: 36, w: 16, h: 13, label: "Pothole", confidence: 0.87 },
      { id: "r3", x: 32, y: 70, w: 20, h: 16, label: "Pothole", confidence: 0.78 },
    ],
  },
  yolo: {
    key: "yolo",
    name: "YOLO",
    latencyMs: 62,
    boxes: [
      { id: "y1", x: 14, y: 42, w: 26, h: 22, label: "Pothole", confidence: 0.89 },
      { id: "y2", x: 53, y: 35, w: 18, h: 15, label: "Pothole", confidence: 0.83 },
      { id: "y3", x: 70, y: 55, w: 15, h: 12, label: "Pothole", confidence: 0.71 },
      { id: "y4", x: 31, y: 69, w: 21, h: 17, label: "Pothole", confidence: 0.65 },
    ],
  },
}
