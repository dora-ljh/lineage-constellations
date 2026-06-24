import { DYNASTIES, DYNASTY_ORDER, type DynastyKey } from '@/types/dynasty'

interface Props {
  current: DynastyKey
  onChange: (key: DynastyKey) => void
}

/**
 * 顶部居中的朝代切换按钮组。
 */
export function DynastyTabs({ current, onChange }: Props) {
  return (
    <nav className="pointer-events-auto absolute left-1/2 top-2 z-30 -translate-x-1/2">
      <div className="flex gap-1 rounded-full border border-space-border bg-space-panel/80 p-1 shadow-lg backdrop-blur">
        {DYNASTY_ORDER.map((k) => {
          const active = k === current
          return (
            <button
              key={k}
              type="button"
              onClick={() => onChange(k)}
              className={[
                'px-4 py-1.5 rounded-full font-display text-base transition-colors',
                active
                  ? 'bg-star-key/20 text-star-key'
                  : 'text-star-faint/60 hover:text-star-faint hover:bg-white/5',
              ].join(' ')}
            >
              {DYNASTIES[k].name}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
