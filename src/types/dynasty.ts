export type DynastyKey = 'han' | 'tang' | 'song' | 'ming' | 'qing'

export interface DynastyMeta {
  readonly key: DynastyKey
  readonly name: string
  readonly title: string
  readonly subtitle: string
  readonly yearMin: number
  readonly yearMax: number
  readonly sourceDyCodes: readonly number[]
  /** 用 c_name_chn LIKE '%xxx%' 兜底搜（清朝爱新觉罗整名匹配） */
  readonly fallbackSurnameRegex?: string
  /** "皇室白名单"：02 在 BFS 闭包之外，把符合此条件的人也纳入。
   *  surnameChn 精确匹配 c_surname_chn；namePattern 用 LIKE 模糊匹配 c_name_chn。
   *  常用于明清这种 BFS 拉不到、但姓氏特征明显的朝代。 */
  readonly royalWhitelist?: {
    readonly surnameChn?: string
    readonly namePattern?: string
    readonly birthYearRange?: readonly [number, number]
  }
}

export const DYNASTIES: Record<DynastyKey, DynastyMeta> = {
  han: {
    key: 'han',
    name: '汉',
    title: '汉朝皇室宗亲星图',
    subtitle: '前 202 – 公元 220',
    yearMin: -260,
    yearMax: 240,
    sourceDyCodes: [29, 25],
  },
  tang: {
    key: 'tang',
    name: '唐',
    title: '唐朝皇室宗亲星图',
    subtitle: '618 – 907',
    yearMin: 560,
    yearMax: 920,
    sourceDyCodes: [6],
  },
  song: {
    key: 'song',
    name: '宋',
    title: '宋朝皇室宗亲星图',
    subtitle: '960 – 1279',
    yearMin: 920,
    yearMax: 1300,
    sourceDyCodes: [15],
  },
  ming: {
    key: 'ming',
    name: '明',
    title: '明朝皇室宗亲星图',
    subtitle: '1368 – 1644',
    yearMin: 1320,
    yearMax: 1660,
    sourceDyCodes: [19],
    royalWhitelist: { surnameChn: '朱', birthYearRange: [1320, 1660] },
  },
  qing: {
    key: 'qing',
    name: '清',
    title: '清朝皇室宗亲星图',
    subtitle: '1644 – 1911',
    yearMin: 1550,
    yearMax: 1970,
    sourceDyCodes: [20],
    fallbackSurnameRegex: '愛新覺羅',
    royalWhitelist: { namePattern: '愛新覺羅' },
  },
}

export const DYNASTY_ORDER: readonly DynastyKey[] = ['han', 'tang', 'song', 'ming', 'qing']
