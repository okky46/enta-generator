export interface Product {
  slug: string
  name: string
  description: string
  href: string
}

/** 公開中のサービス。追加するとトップページと sitemap に反映されます。 */
export const products: Product[] = [
  {
    slug: 'enta',
    name: 'エンタジェネレーター',
    description: '画像と文字を選んで、「笑いのニューウェーブ 陣内智則」風の一枚を作れる無料ジェネレーターです。',
    href: '/enta',
  },
]
