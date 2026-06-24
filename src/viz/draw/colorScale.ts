/**
 * 6 度高亮色阶：距离 0..6 → 红→橙→黄→白→浅蓝→蓝→深蓝。
 * 与 src/index.css 中 --color-degree-* 保持一致。
 */
const DEGREE_COLORS = [
  '#fd150b', // 0: 起点
  '#ff7847', // 1
  '#ffcf48', // 2
  '#ffffff', // 3
  '#a0c6db', // 4
  '#5d8ec0', // 5
  '#2970ac', // 6
] as const

export function degreeColor(distance: number): string {
  if (distance < 0) return DEGREE_COLORS[0]
  if (distance >= DEGREE_COLORS.length) return DEGREE_COLORS[DEGREE_COLORS.length - 1]
  return DEGREE_COLORS[distance]
}

/** 普通宗室星核色：暖金 */
export const STAR_GOLD = '#f4d97a'
/** 皇帝立柱节点色：浅蓝白 */
export const STAR_KEY = '#c6e2e7'
