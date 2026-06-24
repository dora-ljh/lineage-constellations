/**
 * HiDPI 处理：设置 canvas 的物理像素 = CSS 像素 × DPR，并 scale ctx 让后续绘制用 CSS 像素。
 * 返回 ctx，方便链式使用。
 */
export function setupHiDPI(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  dpr: number,
): CanvasRenderingContext2D {
  canvas.width = Math.floor(cssWidth * dpr)
  canvas.height = Math.floor(cssHeight * dpr)
  canvas.style.width = `${cssWidth}px`
  canvas.style.height = `${cssHeight}px`
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Cannot get 2d context')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

export function clearCanvas(ctx: CanvasRenderingContext2D, cssWidth: number, cssHeight: number): void {
  ctx.clearRect(0, 0, cssWidth, cssHeight)
}
