export const LOGICAL_WIDTH = 480;
export const LOGICAL_HEIGHT = 270;

export function fitPixelCanvas(canvas, frame, logicalWidth = LOGICAL_WIDTH, logicalHeight = LOGICAL_HEIGHT) {
  const rect = frame.getBoundingClientRect();
  const availableWidth = Math.max(1, rect.width - 2);
  const viewportHeight = Math.max(logicalHeight, window.innerHeight * 0.62);
  const availableHeight = Math.max(1, Math.min(rect.height || viewportHeight, viewportHeight));
  const rawScale = Math.min(availableWidth / logicalWidth, availableHeight / logicalHeight);
  const scale = rawScale >= 1 ? Math.max(1, Math.floor(rawScale)) : rawScale;
  canvas.style.width = `${Math.max(1, Math.floor(logicalWidth * scale))}px`;
  canvas.style.height = `${Math.max(1, Math.floor(logicalHeight * scale))}px`;
  return scale;
}
