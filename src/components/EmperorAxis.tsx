import type { ScaleLinear } from 'd3-scale'
import type { Anchor } from '@/types/anchor'
import { PADDING } from '@/constants/canvas'

interface Props {
  anchors: readonly Anchor[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  designWidth: number
  designHeight: number
}

/**
 * 皇帝立柱：底部显示在位起始年，柱身虚线，顶部显示庙号。
 * 首/末两根柱子的文字改为左/右对齐，避免溢出画布边界。
 */
export function EmperorAxis({ anchors, xScale, yScale, designWidth, designHeight }: Props) {
  const colSpan = designWidth - 2 * PADDING
  const xOfCol = (c: number) =>
    PADDING + (c / Math.max(1, anchors.length - 1)) * colSpan
  // 顶部多留空间避让切换按钮（按钮在 top-2~10px CSS，约 50px 高）
  const top = yScale(PADDING * 1.3)
  const bottom = yScale(designHeight - PADDING * 0.45)

  return (
    <g>
      {anchors.map((a) => {
        const cx = xScale(xOfCol(a.column))
        const isFirst = a.column === 0
        const isLast = a.column === anchors.length - 1
        const anchorAlign: 'start' | 'middle' | 'end' =
          isFirst ? 'start' : isLast ? 'end' : 'middle'
        return (
          <g key={a.id} transform={`translate(${cx},0)`}>
            <line
              y1={top}
              y2={bottom}
              stroke="#3a4358"
              strokeOpacity={0.5}
              strokeDasharray="2 4"
            />
            <text
              y={top - 12}
              textAnchor={anchorAlign}
              className="fill-star-faint font-display"
              style={{ fontSize: 14 }}
            >
              {a.templeName}
            </text>
          </g>
        )
      })}
    </g>
  )
}
