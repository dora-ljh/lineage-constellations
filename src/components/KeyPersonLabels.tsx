import type { ScaleLinear } from 'd3-scale'
import type { Node } from '@/types/node'

interface Props {
  nodes: readonly Node[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
}

/**
 * 永久显示锚点（皇帝）与 isKeyPerson 标注人物的姓名。
 * 锚点本身的庙号由 EmperorAxis 顶部显示，这里只标"非锚点但 isKeyPerson"。
 */
export function KeyPersonLabels({ nodes, xScale, yScale }: Props) {
  return (
    <g>
      {nodes
        .filter((n) => n.isKeyPerson && !n.isAnchor)
        .map((n) => (
          <text
            key={n.id}
            x={xScale(n.x) + 10}
            y={yScale(n.y) + 4}
            className="fill-star-faint font-display"
            style={{ fontSize: 13, opacity: 0.8 }}
          >
            {n.nameZh}
          </text>
        ))}
    </g>
  )
}
