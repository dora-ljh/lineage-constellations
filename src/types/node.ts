import type { SimulationNodeDatum } from 'd3-force'

/**
 * 阶段 1：原始人物记录形状（离线预处理阶段使用）。
 */
export interface RawPersonRecord {
  readonly sourceId: number
  readonly nameZh: string
  readonly nameAlt?: string
  readonly birthYear?: number
  readonly deathYear?: number
  readonly gender?: 'M' | 'F'
}

/**
 * 阶段 2：布局阶段 d3-force 使用的可变节点。
 * 注意：mutation 仅发生在离线预处理阶段，前端永远拿不到这个类型。
 */
export interface SimNode extends SimulationNodeDatum {
  id: string
  sourceId: number
  nameZh: string
  birthYear: number
  deathYear?: number
  isAnchor: boolean
  isKeyPerson: boolean
  anchorId?: string
  distToAnchor?: number
  birthYearImputed?: boolean
}

/**
 * 阶段 3：前端运行时使用的不可变节点。
 * x/y 为已离线固化的布局坐标，前端只读不算。
 * componentId 是无向图连通分量序号（0 = 最大分量），用于判定两点是否可达。
 */
export interface Node {
  readonly id: string
  readonly sourceId: number
  readonly nameZh: string
  readonly birthYear: number
  readonly deathYear?: number
  readonly isAnchor: boolean
  readonly isKeyPerson: boolean
  readonly anchorId: string
  readonly distToAnchor: number
  readonly birthYearImputed?: boolean
  readonly x: number
  readonly y: number
  readonly componentId: number
}
