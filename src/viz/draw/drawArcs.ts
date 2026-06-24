import type { ScaleLinear } from 'd3-scale'
import type { Link } from '@/types/link'
import type { Node } from '@/types/node'

export interface DrawArcsOptions {
  readonly xScale: ScaleLinear<number, number>
  readonly yScale: ScaleLinear<number, number>
}

/**
 * 用二次贝塞尔画弧。控制点放在两端中点向上偏移 1/4 距离，营造星座连线感。
 * 节点底色和顶色不同，弧线用低饱和度灰蓝 + 透明度，避免抢戏。
 */
export function drawArcs(
  ctx: CanvasRenderingContext2D,
  links: readonly Link[],
  nodes: readonly Node[],
  opts: DrawArcsOptions,
): void {
  const { xScale, yScale } = opts
  const nodeMap = new Map<string, Node>()
  for (const n of nodes) nodeMap.set(n.id, n)

  ctx.strokeStyle = 'rgba(190, 200, 220, 0.09)'
  ctx.lineWidth = 0.6
  ctx.beginPath()
  for (const l of links) {
    const a = nodeMap.get(l.source)
    const b = nodeMap.get(l.target)
    if (!a || !b) continue
    const x1 = xScale(a.x)
    const y1 = yScale(a.y)
    const x2 = xScale(b.x)
    const y2 = yScale(b.y)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const dx = x2 - x1
    const dy = y2 - y1
    const dist = Math.sqrt(dx * dx + dy * dy)
    // 控制点垂直于线段方向偏移
    const nx = -dy / dist
    const ny = dx / dist
    const offset = dist * 0.18
    const cx = mx + nx * offset
    const cy = my + ny * offset
    ctx.moveTo(x1, y1)
    ctx.quadraticCurveTo(cx, cy, x2, y2)
  }
  ctx.stroke()
}
