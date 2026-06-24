import { useEffect, useRef } from 'react'
import type { ScaleLinear } from 'd3-scale'
import type { Link } from '@/types/link'
import type { Node } from '@/types/node'
import { clearCanvas, setupHiDPI } from '@/utils/canvas'
import { drawArcs } from './draw/drawArcs'

interface Props {
  links: readonly Link[]
  nodes: readonly Node[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  width: number
  height: number
  dpr: number
}

export function ArcCanvas({ links, nodes, xScale, yScale, width, height, dpr }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = setupHiDPI(canvas, width, height, dpr)
    clearCanvas(ctx, width, height)
    drawArcs(ctx, links, nodes, { xScale, yScale })
  }, [links, nodes, xScale, yScale, width, height, dpr])

  return <canvas ref={ref} className="pointer-events-none absolute inset-0" />
}
