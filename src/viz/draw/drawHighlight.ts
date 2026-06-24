import type { ScaleLinear } from 'd3-scale'
import type { Link } from '@/types/link'
import type { Node } from '@/types/node'
import type { Adjacency } from '@/graph/adjacency'
import { bfsDistances } from '@/graph/bfs'
import { degreeColor, STAR_GOLD, STAR_KEY } from './colorScale'

export interface HighlightOptions {
  readonly xScale: ScaleLinear<number, number>
  readonly yScale: ScaleLinear<number, number>
  readonly nodeMap: ReadonlyMap<string, Node>
  readonly adjacency: Adjacency
  readonly links: readonly Link[]
  readonly width: number
  readonly height: number
  readonly hoveredId: string | null
  readonly lockedSourceId: string | null
  readonly lockedTargetId: string | null
  readonly shortestPath: readonly string[] | null
  /** 渐进展开当前到达的最大度数（0..6，可为小数用于淡入） */
  readonly revealedDepth: number
}

/** 路径线颜色：白色 0.7 */
const PATH_LINE = 'rgba(255, 255, 255, 0.7)'

function coreRadius(n: Node): number {
  return n.isAnchor ? 8 : 4
}

function quadArc(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
): void {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  const dx = x2 - x1, dy = y2 - y1
  const d = Math.sqrt(dx * dx + dy * dy) || 1
  const off = d * 0.18
  ctx.moveTo(x1, y1)
  ctx.quadraticCurveTo(mx + (-dy / d) * off, my + (dx / d) * off, x2, y2)
}

/**
 * 覆盖层绘制。背景的暗化由 NodeCanvas/ArcCanvas 通过整层 0.3 不透明度实现，
 * 这里只负责在底色之上画亮起来的边、节点和路径线。
 *   - hover/锁定 → 按 revealedDepth 一层一层亮起 6 度亲属
 *   - 路径 → 白色 0.7 弧线连接最短路径
 */
export function drawHighlight(
  ctx: CanvasRenderingContext2D,
  opts: HighlightOptions,
): void {
  const {
    xScale, yScale, nodeMap, adjacency, links,
    hoveredId, lockedSourceId, lockedTargetId, shortestPath, revealedDepth,
  } = opts

  // 两端已选但 BFS 找不到路径（不同连通分量）：只保留两端虚线圈与介绍面板，不再回落到源点 6 度高亮
  if (lockedSourceId && lockedTargetId && !shortestPath) {
    return
  }

  // 路径模式：起点已锁定且选了第二颗
  if (shortestPath && shortestPath.length > 1) {
    // 白色 0.7 路径线
    ctx.strokeStyle = PATH_LINE
    ctx.lineWidth = 1.6
    ctx.beginPath()
    for (let i = 0; i < shortestPath.length - 1; i++) {
      const a = nodeMap.get(shortestPath[i])
      const b = nodeMap.get(shortestPath[i + 1])
      if (!a || !b) continue
      quadArc(ctx, xScale(a.x), yScale(a.y), xScale(b.x), yScale(b.y))
    }
    ctx.stroke()

    // 路径上所有节点亮起：皇帝立柱浅蓝、普通节点暖金
    for (const id of shortestPath) {
      const n = nodeMap.get(id)
      if (!n) continue
      ctx.fillStyle = n.isAnchor ? STAR_KEY : STAR_GOLD
      ctx.beginPath()
      ctx.arc(xScale(n.x), yScale(n.y), coreRadius(n), 0, Math.PI * 2)
      ctx.fill()
    }
    return
  }

  // 染色源：锁定优先，否则 hover
  const sourceId = lockedSourceId ?? hoveredId
  if (!sourceId) return

  const dist = bfsDistances(adjacency, sourceId, 6)

  // 当前展开的最大整度（向下取整）和淡入比例（小数部分）
  const fullDepth = Math.floor(revealedDepth)
  const partial = Math.max(0, Math.min(1, revealedDepth - fullDepth))

  // 边：按两端较远距离取色；只画 max(ds, dt) ≤ revealedDepth 的边
  ctx.lineWidth = 1
  for (const l of links) {
    const ds = dist.get(l.source)
    const dt = dist.get(l.target)
    if (ds === undefined || dt === undefined) continue
    const depth = Math.max(ds, dt)
    if (depth > fullDepth + 1) continue
    const a = nodeMap.get(l.source)
    const b = nodeMap.get(l.target)
    if (!a || !b) continue
    ctx.strokeStyle = degreeColor(depth)
    ctx.globalAlpha = depth <= fullDepth ? 0.55 : 0.55 * partial
    if (ctx.globalAlpha <= 0) continue
    ctx.beginPath()
    quadArc(ctx, xScale(a.x), yScale(a.y), xScale(b.x), yScale(b.y))
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // 节点：同样一层一层亮起
  for (const [id, d] of dist) {
    if (d > fullDepth + 1) continue
    const n = nodeMap.get(id)
    if (!n) continue
    ctx.fillStyle = degreeColor(d)
    ctx.globalAlpha = d <= fullDepth ? 1 : partial
    if (ctx.globalAlpha <= 0) continue
    ctx.beginPath()
    ctx.arc(xScale(n.x), yScale(n.y), coreRadius(n), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}
