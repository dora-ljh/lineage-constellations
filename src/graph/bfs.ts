import type { Adjacency } from './adjacency'

/**
 * 从 source 出发，返回每个可达节点的最短距离（步数）。
 * 用于 hover 高亮 6 度内亲属，maxDepth 上限默认 6。
 */
export function bfsDistances(
  adj: Adjacency,
  source: string,
  maxDepth = 6,
): Map<string, number> {
  const dist = new Map<string, number>()
  dist.set(source, 0)
  let frontier: string[] = [source]
  for (let depth = 1; depth <= maxDepth; depth++) {
    const next: string[] = []
    for (const id of frontier) {
      const neighbors = adj.get(id)
      if (!neighbors) continue
      for (const nb of neighbors) {
        if (dist.has(nb)) continue
        dist.set(nb, depth)
        next.push(nb)
      }
    }
    if (next.length === 0) break
    frontier = next
  }
  return dist
}

/**
 * BFS 最短路径。返回节点 id 序列（含端点）；不连通返回 null。
 * 用于 click 两点画弧。
 */
export function bfsShortestPath(
  adj: Adjacency,
  source: string,
  target: string,
): string[] | null {
  if (source === target) return [source]
  const prev = new Map<string, string>()
  prev.set(source, source)
  const queue: string[] = [source]
  let head = 0
  while (head < queue.length) {
    const id = queue[head++]
    if (id === target) {
      const path: string[] = [target]
      let cur = target
      while (cur !== source) {
        cur = prev.get(cur)!
        path.push(cur)
      }
      return path.reverse()
    }
    const neighbors = adj.get(id)
    if (!neighbors) continue
    for (const nb of neighbors) {
      if (prev.has(nb)) continue
      prev.set(nb, id)
      queue.push(nb)
    }
  }
  return null
}
