import type { SimulationLinkDatum } from 'd3-force'
import type { SimNode } from './node'

export type LinkKind = 'parent' | 'spouse'

/**
 * 阶段 2：布局阶段 d3-force 用的链接。
 * d3-force 会就地把 source/target 从 string 替换为对象引用。
 */
export interface SimLink extends SimulationLinkDatum<SimNode> {
  kind: LinkKind
}

/**
 * 阶段 3：前端运行时，始终用 id 引用，绘制时再 Map.get 取节点。
 */
export interface Link {
  readonly source: string
  readonly target: string
  readonly kind: LinkKind
}
