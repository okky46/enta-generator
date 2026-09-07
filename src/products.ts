export interface ProductThumb {
  /** サムネイルの左側に縦書きで描く文字 */
  left: string
  /** サムネイルの右側に縦書きで描く文字 */
  right: string
}

export interface Product {
  slug: string
  name: string
  description: string
  href: string
  /** 一覧の行に添える補足（種類・料金など） */
  meta: string
  /** 一覧のサムネイルに描く内容。ツールの出力そのものを図として示します。 */
  thumb: ProductThumb
}

/** 公開前のもの。sitemap には載せず、トップの一覧にだけ「準備中」として並びます。 */
export interface UpcomingProduct {
  name: string
  description: string
  meta: string
}

/** 公開中のサービス。追加するとトップページと sitemap に反映されます。 */
export const products: Product[] = [
  {
    slug: 'enta',
    name: 'エンタジェネレーター',
    description:
      '画像と左右の縦書き文字を選んで、「笑いのニューウェーブ 陣内智則」風の一枚をつくります。文字の大きさと位置を調整して、4:3 の PNG で保存できます。',
    href: '/enta',
    meta: '画像生成・無料・ブラウザ内で完結',
    thumb: { left: 'ボケの', right: '渋滞' },
  },
]

/** 準備中のもの。空配列にすればトップの一覧から消えます。 */
export const upcomingProducts: UpcomingProduct[] = [
  {
    name: '診断コンテンツ',
    description:
      'いくつかの質問に答えると結果が出るタイプのものを用意しています。公開したらこの一覧に並びます。',
    meta: '診断・準備中',
  },
]
