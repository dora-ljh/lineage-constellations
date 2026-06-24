# 唐朝皇室宗亲星图

一张可交互的「星图」，把唐朝皇室宗亲（高祖以下 18 帝及其血亲、姻亲共 7935 人）按生年分层、按所属皇帝立柱归柱排列。悬停、点击之间，一个王朝三百年的血缘网络在眼前层层亮起。

## 看什么

- **纵轴**：人物生年（560–920）
- **横轴**：18 位唐朝皇帝立柱（高祖 → 哀帝）
- **悬停一颗星**：6 度内亲属按距离从红 → 蓝逐层亮起；其余节点统一暗化到 0.3，焦点一目了然
- **点击锁定一颗星**：周围出现旋转虚线圈，名字面板持续显示
- **再点一颗**：自动计算两人之间的最短血缘路径，画白色弧线，两端各一个旋转虚线圈
- **不连通**：两端不在同一血缘网络时，面板会注明「与起点不在同一血缘网络」

## 亮点

- **万人级单帧渲染**：6700+ 节点在三层 Canvas 上单帧绘制 < 16ms，悬停高频交互依旧顺滑。
- **血缘最短路径**：任选两人即时求解最短亲属链路，弧线高亮，跨网络自动判定不连通。
- **分层归柱布局**：纵向按生年、横向按所属皇帝立柱，离线 d3-force 预排版，打开即定格。
- **繁→简一致呈现**：人物姓名统一为简体，阅读无障碍。

## 渲染架构

三层 Canvas（弧线 / 节点 / 高亮覆盖）+ 一层 SVG（轴 / 标签 / 旋转虚线圈）+ 一层透明命中层（d3-delaunay + rAF 节流）。Zustand 切片订阅让 hover / 锁定 / 路径各自只局部重绘，避免整图刷新。

## 技术栈

- **React 19 + TypeScript 6 + Vite 8** — 纯静态 SPA
- **D3 v7** — `d3-force` 离线布局、`d3-delaunay` 命中检测、`d3-scale` 坐标映射
- **Zustand v5** + `subscribeWithSelector` 切片订阅
- **Tailwind CSS v4**（`@theme` CSS-first 主题）
- **pnpm** 包管理

## 本地运行

```bash
pnpm install
pnpm dev          # http://localhost:5173/
pnpm build        # 产出 dist/，可直接静态托管
pnpm preview      # 本地预览构建产物
pnpm typecheck    # tsc -b --noEmit
pnpm lint         # ESLint
```

## 数据

前端运行时只 `fetch('/data/dynasty/{nodes,links,anchors}-tang.json')` 这几份**已预先算好的静态 JSON**，**不接触任何数据库**，开箱即用。数据特点：

- **多轮插值生年**：部分女性宗亲（公主、嫔妃、生母）原始年份缺失，若直接丢弃会让外戚家族与皇室主干断开。数据在自带年份之外做了迭代补全（spouse 同代 → parent + 25 → child − 25），唐朝最终连通率约 100%（7932/7935）。
- **连通分量编号**：每个节点带 `componentId`，前端选两节点时若分属不同分量即判定不连通。
- **姓名简体**：人物姓名均以简体呈现。

## 项目结构

```
.
├── public/data/dynasty/        运行时静态数据 JSON（前端只读这一份）
└── src/
    ├── types/                  RawPersonRecord / SimNode / Node 三阶段类型
    ├── graph/                  邻接表 + BFS（最短血缘路径）
    ├── hooks/                  useData / useViewport / useScales / useAdjacency
    ├── state/useAppStore.ts    Zustand 切片（hover / 锁定 / 路径）
    ├── viz/                    Canvas 三层 + HitLayer + SelectionRings + 纯绘制函数
    └── components/             SVG / DOM UI（轴、标签、Tooltip、Legend、Intro）
```

## 部署

`vite.config.ts` 已设 `base: './'`，`pnpm build` 产出的 `dist/` 可直接放到 GitHub Pages / Cloudflare Pages / Vercel 任意子路径下，无需改配置。

## 许可证

[MIT](./LICENSE)
