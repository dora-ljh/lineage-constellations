import type { ScaleLinear } from 'd3-scale'
import { PADDING } from '@/constants/canvas'

interface Props {
  yScale: ScaleLinear<number, number>
  designHeight: number
  xLeft: number
  yearMin: number
  yearMax: number
}

/**
 * 左侧年份刻度（按朝代时间跨度自适应：< 200 年取 20 年间隔，< 500 年 50 年，否则 100 年）。
 */
export function YearAxis({ yScale, designHeight, xLeft, yearMin, yearMax }: Props) {
  const span = yearMax - yearMin
  const step = span <= 200 ? 20 : span <= 500 ? 50 : 100
  const start = Math.ceil(yearMin / step) * step
  const ticks: number[] = []
  for (let y = start; y <= yearMax; y += step) ticks.push(y)

  const ySpan = designHeight - 2 * PADDING
  const yOf = (year: number) =>
    yScale(PADDING + ((year - yearMin) / (yearMax - yearMin)) * ySpan)

  return (
    <g>
      {ticks.map((y) => (
        <g key={y} transform={`translate(${xLeft},${yOf(y)})`}>
          <line x1={0} x2={6} stroke="#5e6577" />
          <text x={-8} dy={4} textAnchor="end" className="fill-star-faint" style={{ fontSize: 13, opacity: 0.6 }}>
            {y < 0 ? `前${-y}` : y}
          </text>
        </g>
      ))}
    </g>
  )
}
