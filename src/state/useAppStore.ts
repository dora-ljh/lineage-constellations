import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Adjacency } from '@/graph/adjacency'
import { bfsShortestPath } from '@/graph/bfs'

interface AppState {
  hoveredId: string | null
  lockedSourceId: string | null
  lockedTargetId: string | null
  shortestPath: readonly string[] | null

  setHover: (id: string | null) => void
  clickNode: (id: string, adjacency: Adjacency) => void
  clearLock: () => void
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    hoveredId: null,
    lockedSourceId: null,
    lockedTargetId: null,
    shortestPath: null,

    setHover: (id) => {
      if (get().hoveredId !== id) set({ hoveredId: id })
    },

    clickNode: (id, adjacency) => {
      const { lockedSourceId } = get()
      if (!lockedSourceId) {
        set({ lockedSourceId: id, lockedTargetId: null, shortestPath: null })
        return
      }
      if (lockedSourceId === id) {
        // 点同一个起点 → 取消
        set({ lockedSourceId: null, lockedTargetId: null, shortestPath: null })
        return
      }
      const path = bfsShortestPath(adjacency, lockedSourceId, id)
      set({ lockedTargetId: id, shortestPath: path })
    },

    clearLock: () =>
      set({ lockedSourceId: null, lockedTargetId: null, shortestPath: null }),
  })),
)

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as unknown as { __store?: typeof useAppStore }).__store = useAppStore
}
