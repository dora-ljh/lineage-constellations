import { Intro } from '@/components/Intro'
import { Legend } from '@/components/Legend'
import { useData } from '@/hooks/useData'
import { Constellation } from '@/viz/Constellation'
import type { DynastyKey } from '@/types/dynasty'

const DYNASTY: DynastyKey = 'tang'

export default function App() {
  const state = useData(DYNASTY)

  return (
    <main className="relative h-full w-full">
      <Intro dynasty={DYNASTY} />
      {state.status === 'loading' && (
        <div className="flex h-full items-center justify-center text-star-faint">
          <p className="opacity-60">载入星图中…</p>
        </div>
      )}
      {state.status === 'error' && (
        <div className="flex h-full items-center justify-center text-star-faint">
          <p className="opacity-80">数据加载失败：{state.error}</p>
        </div>
      )}
      {state.status === 'ready' && (
        <>
          <Constellation data={state.data} dynasty={DYNASTY} />
          <Legend />
        </>
      )}
    </main>
  )
}
