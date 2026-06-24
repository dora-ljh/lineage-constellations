import type { ScaleLinear } from 'd3-scale'
import type { Node } from '@/types/node'
import { STAR_KEY } from './colorScale'

export interface DrawNodesOptions {
  readonly xScale: ScaleLinear<number, number>
  readonly yScale: ScaleLinear<number, number>
  /** 节点连接度（adjacency 邻居数）：映射大小，且决定是否"重要"全亮 */
  readonly degreeOf: (id: string) => number
  /** 是否处于高亮态：true 时所有节点统一 0.3 不透明度，作为暗化背景 */
  readonly dimmed?: boolean
}

/** STAR_GOLD #f4d97a 的 RGB，用于拼带 alpha 的 rgba */
const GOLD_RGB = '244, 217, 122'

/** 普通节点的随机暗度档（opacity 0.3–0.7），分桶批量 fill */
const ALPHA_TIERS = [0.1, 0.2, 0.3] as const

/** 连接度 ≥ 此值视为"重要历史人物"（亲属网络枢纽），全亮 */
const IMPORTANT_DEGREE = 6

/** 连接度 → 半径。叶子 ~1.5px，枢纽 ~5.5px */
function radiusOf(deg: number): number {
  return 1.5 + Math.min(Math.sqrt(deg) * 0.75, 4)
}

/** 确定性 hash（FNV-1a）→ [0,1)，保证同一节点每帧 alpha 固定不闪烁 */
function hash01(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 0xffffffff
}

/**
 * 默认底色绘制（纯色实心圆，无辉光）。默认态分三类：
 *   - 皇帝立柱：浅蓝大圆，全亮
 *   - 重要历史人物（连接度 ≥ IMPORTANT_DEGREE，亲属网络枢纽）：暖金，全亮
 *   - 其余普通节点：暖金，opacity 0.3–0.7 确定性随机，半径随连接度
 * 普通节点按 alpha 分 5 桶批量 fill；6746 节点单帧 < 16ms。
 */
export function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: readonly Node[],
  opts: DrawNodesOptions,
): void {
  const { xScale, yScale, degreeOf, dimmed } = opts

  if (dimmed) {
    // 高亮态：所有节点统一 0.3 暖金，作为暗化底图（皇帝立柱也一并暗下来）
    ctx.fillStyle = `rgba(${GOLD_RGB}, 0.3)`
    ctx.beginPath()
    for (const n of nodes) {
      const cx = xScale(n.x)
      const cy = yScale(n.y)
      const r = n.isAnchor ? 7 : radiusOf(degreeOf(n.id))
      ctx.moveTo(cx + r, cy)
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
    }
    ctx.fill()
    return
  }

  // 普通且非重要节点：按 alpha 随机分 3 桶
  for (let t = 0; t < ALPHA_TIERS.length; t++) {
    ctx.fillStyle = `rgba(${GOLD_RGB}, ${ALPHA_TIERS[t]})`
    ctx.beginPath()
    for (const n of nodes) {
      if (n.isAnchor) continue
      const deg = degreeOf(n.id)
      if (deg >= IMPORTANT_DEGREE) continue
      if (Math.floor(hash01(n.id) * ALPHA_TIERS.length) !== t) continue
      const cx = xScale(n.x)
      const cy = yScale(n.y)
      const r = radiusOf(deg)
      ctx.moveTo(cx + r, cy)
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
    }
    ctx.fill()
  }

  // 重要历史人物：高连接度枢纽，暖金全亮
  ctx.fillStyle = `rgba(${GOLD_RGB}, 1)`
  ctx.beginPath()
  for (const n of nodes) {
    if (n.isAnchor) continue
    const deg = degreeOf(n.id)
    if (deg < IMPORTANT_DEGREE) continue
    const cx = xScale(n.x)
    const cy = yScale(n.y)
    const r = radiusOf(deg)
    ctx.moveTo(cx + r, cy)
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
  }
  ctx.fill()

  // 皇帝立柱：浅蓝大圆，全亮
  ctx.fillStyle = STAR_KEY
  ctx.beginPath()
  for (const n of nodes) {
    if (!n.isAnchor) continue
    const cx = xScale(n.x)
    const cy = yScale(n.y)
    ctx.moveTo(cx + 7, cy)
    ctx.arc(cx, cy, 7, 0, Math.PI * 2)
  }
  ctx.fill()
}
