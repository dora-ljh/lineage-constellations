import { ArcCanvas } from './ArcCanvas'
import { HighlightCanvas } from './HighlightCanvas'
import { HitLayer } from './HitLayer'
import { NodeCanvas } from './NodeCanvas'
import { SelectionRings } from './SelectionRings'
import { EmperorAxis } from '@/components/EmperorAxis'
import { KeyPersonLabels } from '@/components/KeyPersonLabels'
import { Tooltip } from '@/components/Tooltip'
import { YearAxis } from '@/components/YearAxis'
import { useAdjacency } from '@/hooks/useAdjacency'
import { useScales } from '@/hooks/useScales'
import { useViewport } from '@/hooks/useViewport'
import type { ConstellationData } from '@/hooks/useData'
import { DYNASTIES, type DynastyKey } from '@/types/dynasty'

interface Props {
  data: ConstellationData
  dynasty: DynastyKey
}

export function Constellation({ data, dynasty }: Props) {
  const { width, height, dpr } = useViewport()
  const scales = useScales(width, height)
  const adjacency = useAdjacency(data.links)
  const meta = DYNASTIES[dynasty]

  return (
    <div className="relative h-full w-full">
      <ArcCanvas
        links={data.links}
        nodes={data.nodes}
        xScale={scales.xScale}
        yScale={scales.yScale}
        width={width}
        height={height}
        dpr={dpr}
      />
      <NodeCanvas
        nodes={data.nodes}
        adjacency={adjacency}
        xScale={scales.xScale}
        yScale={scales.yScale}
        width={width}
        height={height}
        dpr={dpr}
      />
      <HighlightCanvas
        nodes={data.nodes}
        links={data.links}
        xScale={scales.xScale}
        yScale={scales.yScale}
        adjacency={adjacency}
        width={width}
        height={height}
        dpr={dpr}
      />
      <svg className="pointer-events-none absolute inset-0" width={width} height={height}>
        <EmperorAxis
          anchors={data.anchors}
          xScale={scales.xScale}
          yScale={scales.yScale}
          designWidth={scales.designWidth}
          designHeight={scales.designHeight}
        />
        <YearAxis
          yScale={scales.yScale}
          designHeight={scales.designHeight}
          xLeft={scales.xScale(40)}
          yearMin={meta.yearMin}
          yearMax={meta.yearMax}
        />
        <KeyPersonLabels nodes={data.nodes} xScale={scales.xScale} yScale={scales.yScale} />
      </svg>
      <SelectionRings nodes={data.nodes} xScale={scales.xScale} yScale={scales.yScale} />
      <Tooltip nodes={data.nodes} xScale={scales.xScale} yScale={scales.yScale} />
      <HitLayer
        nodes={data.nodes}
        xScale={scales.xScale}
        yScale={scales.yScale}
        adjacency={adjacency}
      />
    </div>
  )
}
