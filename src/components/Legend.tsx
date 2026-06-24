const DEGREES = [
  { d: 0, color: '#fd150b', label: '本人' },
  { d: 1, color: '#ff7847', label: '1 度' },
  { d: 2, color: '#ffcf48', label: '2 度' },
  { d: 3, color: '#ffffff', label: '3 度' },
  { d: 4, color: '#a0c6db', label: '4 度' },
  { d: 5, color: '#5d8ec0', label: '5 度' },
  { d: 6, color: '#2970ac', label: '6 度' },
]

/**
 * 右下角图例：6 度色阶 + 节点尺寸说明。
 */
export function Legend() {
  return (
    <aside className="pointer-events-none absolute bottom-4 right-4 z-10 text-sm text-star-faint">
      <div className="rounded border border-space-border bg-space-panel/80 px-4 py-3">
        <div className="mb-2 font-display opacity-80">悬停高亮·距离</div>
        <div className="flex items-center gap-1">
          {DEGREES.map((g) => (
            <div key={g.d} className="flex flex-col items-center" style={{ width: 32 }}>
              <span
                className="block h-2.5 w-full"
                style={{ background: g.color }}
              />
              <span className="mt-1 opacity-60 text-xs">
                {g.d}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 rounded border border-space-border bg-space-panel/80 px-4 py-3">
        <div className="mb-2 font-display opacity-80">节点</div>
        <div className="flex items-center gap-2">
          <Dot size={10} color="#c6e2e7" />
          <span className="opacity-70">皇帝</span>
          <Dot size={6} color="#fddc18" />
          <span className="opacity-70">关键人物</span>
          <Dot size={3} color="rgba(255,247,185,0.6)" />
          <span className="opacity-70">普通宗室</span>
        </div>
      </div>
    </aside>
  )
}

function Dot({ size, color }: { size: number; color: string }) {
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: size * 2, height: size * 2, background: color }}
    />
  )
}
