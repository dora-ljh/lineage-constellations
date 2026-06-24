import { useMemo } from 'react'
import { scaleLinear } from 'd3-scale'
import type { ScaleLinear } from 'd3-scale'
import { DESIGN_H, DESIGN_W } from '@/constants/canvas'

/**
 * 把已离线固化的布局坐标映射到当前视口。
 * 等比缩放 + 居中。
 */
export interface Scales {
  readonly designWidth: number
  readonly designHeight: number
  readonly fitWidth: number
  readonly fitHeight: number
  readonly offsetX: number
  readonly offsetY: number
  readonly xScale: ScaleLinear<number, number>
  readonly yScale: ScaleLinear<number, number>
}

export function useScales(viewportW: number, viewportH: number): Scales {
  return useMemo(() => {
    const ratio = Math.min(viewportW / DESIGN_W, viewportH / DESIGN_H)
    const fitWidth = DESIGN_W * ratio
    const fitHeight = DESIGN_H * ratio
    const offsetX = (viewportW - fitWidth) / 2
    const offsetY = (viewportH - fitHeight) / 2

    const xScale = scaleLinear()
      .domain([0, DESIGN_W])
      .range([offsetX, offsetX + fitWidth])
    const yScale = scaleLinear()
      .domain([0, DESIGN_H])
      .range([offsetY, offsetY + fitHeight])

    return {
      designWidth: DESIGN_W,
      designHeight: DESIGN_H,
      fitWidth,
      fitHeight,
      offsetX,
      offsetY,
      xScale,
      yScale,
    }
  }, [viewportW, viewportH])
}
