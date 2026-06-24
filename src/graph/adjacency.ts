import type { Link } from '@/types/link'

/**
 * 无向邻接表。两个 id 互为邻居，O(1) 查询。
 * mount 时算一次，整个 app 共享。
 */
export type Adjacency = ReadonlyMap<string, readonly string[]>

export function buildAdjacency(links: readonly Link[]): Adjacency {
  const map = new Map<string, string[]>()
  const push = (a: string, b: string) => {
    const arr = map.get(a)
    if (arr) arr.push(b)
    else map.set(a, [b])
  }
  for (const { source, target } of links) {
    push(source, target)
    push(target, source)
  }
  return map
}
