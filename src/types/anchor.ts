/**
 * 18 位宋朝皇帝，作为横轴立柱锚点。
 * column 0..17 严格按继位时间递增。
 */
export interface Anchor {
  readonly id: string
  readonly sourceId: number | null
  readonly name: string
  readonly templeName: string
  readonly reignStart: number
  readonly reignEnd: number
  readonly column: number
  readonly dynasty: 'North' | 'South'
  /** Wikidata Q ID（明清两朝接入维基数据时使用，其他朝代可选）*/
  readonly wikiQid?: string
}
