import { DYNASTIES, type DynastyKey } from '@/types/dynasty'

interface Props {
  dynasty: DynastyKey
}

/**
 * 左上角引言：项目定位 + 简短阅读说明（随朝代切换）。
 */
export function Intro({ dynasty }: Props) {
  const meta = DYNASTIES[dynasty]
  return (
    <header className="pointer-events-none absolute left-6 top-4 z-10 max-w-sm text-star-faint">
      <h1 className="font-display text-3xl tracking-wide">{meta.title}</h1>
      <p className="mt-1 text-sm opacity-50">Lineage Constellations · {meta.subtitle}</p>
      <ul className="mt-4 space-y-1 text-sm opacity-75">
        <li>· 纵轴：人物生年</li>
        <li>· 横轴：{meta.name}朝皇帝立柱</li>
        <li>· 悬停一颗星：高亮 6 度内亲属</li>
        <li>· 点击一颗星：锁定（高亮保持）</li>
        <li>· 再点另一颗星：绘制最短传承路径</li>
        <li>· 点击空白：清除选中</li>
      </ul>
    </header>
  )
}
