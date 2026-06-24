import { useEffect, useState } from 'react'
import type { Anchor } from '@/types/anchor'
import type { Link } from '@/types/link'
import type { Node } from '@/types/node'
import type { DynastyKey } from '@/types/dynasty'

export interface ConstellationData {
  readonly nodes: readonly Node[]
  readonly links: readonly Link[]
  readonly anchors: readonly Anchor[]
}

type LoadedState =
  | { dynasty: DynastyKey; status: 'ready'; data: ConstellationData }
  | { dynasty: DynastyKey; status: 'error'; error: string }

export type DataState =
  | { status: 'loading' }
  | { status: 'ready'; data: ConstellationData }
  | { status: 'error'; error: string }

/**
 * 按朝代 key 加载三份 JSON。
 * state 内部记 dynasty 字段，外部传入的 dynasty 与 state.dynasty 不一致时
 * 直接派生出 loading 状态（避免在 effect 内 setState 触发 React 19 警告）。
 */
export function useData(dynasty: DynastyKey): DataState {
  const [loaded, setLoaded] = useState<LoadedState | null>(null)

  useEffect(() => {
    const abort = new AbortController()
    const base = `${import.meta.env.BASE_URL}data/dynasty`
    void (async () => {
      try {
        const [nodes, links, anchors] = await Promise.all([
          fetch(`${base}/nodes-${dynasty}.json`, { signal: abort.signal }).then((r) => r.json() as Promise<Node[]>),
          fetch(`${base}/links-${dynasty}.json`, { signal: abort.signal }).then((r) => r.json() as Promise<Link[]>),
          fetch(`${base}/anchors-${dynasty}.json`, { signal: abort.signal }).then((r) => r.json() as Promise<Anchor[]>),
        ])
        if (abort.signal.aborted) return
        setLoaded({ dynasty, status: 'ready', data: { nodes, links, anchors } })
      } catch (e) {
        if (abort.signal.aborted) return
        setLoaded({ dynasty, status: 'error', error: e instanceof Error ? e.message : String(e) })
      }
    })()
    return () => abort.abort()
  }, [dynasty])

  if (!loaded || loaded.dynasty !== dynasty) return { status: 'loading' }
  if (loaded.status === 'ready') return { status: 'ready', data: loaded.data }
  return { status: 'error', error: loaded.error }
}
