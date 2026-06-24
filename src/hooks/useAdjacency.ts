import { useMemo } from 'react'
import type { Link } from '@/types/link'
import { buildAdjacency } from '@/graph/adjacency'
import type { Adjacency } from '@/graph/adjacency'

/**
 * mount 时算一次邻接表，整个 app 共享。
 */
export function useAdjacency(links: readonly Link[]): Adjacency {
  return useMemo(() => buildAdjacency(links), [links])
}
