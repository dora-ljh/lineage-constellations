import { useEffect, useState } from 'react'
import type { ScaleLinear } from 'd3-scale'
import type { Node } from '@/types/node'
import { useAppStore } from '@/state/useAppStore'

interface Props {
  nodes: readonly Node[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
}

/**
 * 介绍面板。规则：
 *   - hover 任何节点都立刻显示该节点面板（无论是否已锁定）
 *   - 已锁定起点 → 起点面板始终显示
 *   - 路径态 → 起点 + 终点面板同时显示
 * 三种来源去重；面板锚定到节点屏幕坐标。
 */
export function Tooltip({ nodes, xScale, yScale }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(
    () => useAppStore.getState().hoveredId,
  )
  const [sourceId, setSourceId] = useState<string | null>(
    () => useAppStore.getState().lockedSourceId,
  )
  const [targetId, setTargetId] = useState<string | null>(
    () => useAppStore.getState().lockedTargetId,
  )
  const [path, setPath] = useState<readonly string[] | null>(
    () => useAppStore.getState().shortestPath,
  )

  useEffect(() => useAppStore.subscribe((s) => s.hoveredId, setHoveredId), [])
  useEffect(() => useAppStore.subscribe((s) => s.lockedSourceId, setSourceId), [])
  useEffect(() => useAppStore.subscribe((s) => s.lockedTargetId, setTargetId), [])
  useEffect(() => useAppStore.subscribe((s) => s.shortestPath, setPath), [])

  const ids: string[] = []
  for (const id of [hoveredId, sourceId, targetId]) {
    if (id && !ids.includes(id)) ids.push(id)
  }
  if (ids.length === 0) return null

  // 两端已选但路径为 null（不连通）：在终点面板上挂"无血缘路径"提示
  const noPath = sourceId !== null && targetId !== null && path === null

  return (
    <>
      {ids.map((id) => {
        const node = nodes.find((n) => n.id === id)
        if (!node) return null
        const left = xScale(node.x) + 14
        const top = yScale(node.y) - 28
        const showNoPath = noPath && id === targetId
        return (
          <div
            key={id}
            className="pointer-events-none absolute z-20 rounded border border-space-border bg-space-panel/90 px-3 py-1.5 text-sm text-star-faint shadow-lg"
            style={{ left, top }}
          >
            <div className="font-display tracking-wide text-base">{node.nameZh}</div>
            <div className="opacity-60 text-xs mt-0.5">
              {node.birthYear}
              {node.deathYear ? `–${node.deathYear}` : ''}
              {node.birthYearImputed ? ' (估)' : ''}
            </div>
            {showNoPath && (
              <div className="mt-1.5 border-t border-space-border/60 pt-1 text-xs text-amber-200/90">
                与起点不在同一血缘网络
                <div className="opacity-60 text-[10px] mt-0.5">
                  （源数据/Wikidata 缺失父母或配偶边）
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
