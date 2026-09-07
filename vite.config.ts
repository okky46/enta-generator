import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { products, upcomingProducts } from './src/products'

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export default defineConfig(({ command }) => {
  // 開発サーバーは /enta/ でしか配信できないため、末尾スラッシュの有無をここで吸収します。
  const toHref = (href: string) => (command === 'serve' ? `${href.replace(/\/$/, '')}/` : href)

  const productLinks = products
    .map((product) => `<a href="${escapeHtml(toHref(product.href))}">${escapeHtml(product.name)}</a>`)
    .join('')

  const productRows = products.map((product) => {
    const href = escapeHtml(toHref(product.href))
    const name = escapeHtml(product.name)

    return `
        <li class="tool-row">
          <span class="tool-thumb" aria-hidden="true">
            <span class="tool-thumb-text">${escapeHtml(product.thumb.left)}</span>
            <span class="tool-thumb-text">${escapeHtml(product.thumb.right)}</span>
          </span>
          <div class="tool-body">
            <h3><a href="${href}">${name}</a></h3>
            <p>${escapeHtml(product.description)}</p>
            <p class="tool-meta">${escapeHtml(product.meta)}</p>
          </div>
          <a class="tool-open" href="${href}" aria-label="${name}を開く">開く</a>
        </li>`
  }).join('')

  const upcomingRows = upcomingProducts.map((product) => `
        <li class="tool-row is-upcoming">
          <span class="tool-thumb tool-thumb-empty" aria-hidden="true"></span>
          <div class="tool-body">
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <p class="tool-meta">${escapeHtml(product.meta)}</p>
          </div>
          <span class="tool-status">準備中</span>
        </li>`).join('')

  return {
    build: {
      rollupOptions: {
        input: {
          home: 'index.html',
          enta: 'enta/index.html',
        },
      },
    },
    plugins: [
      react(),
      {
        name: 'product-catalog',
        transformIndexHtml(html) {
          return html
            .replace('<!--PRODUCT_LINKS-->', productLinks)
            .replace('<!--PRODUCT_ROWS-->', `${productRows}${upcomingRows}`)
            .replace('__ENTA_BRAND_HREF__', toHref('/enta'))
        },
        generateBundle(_options, bundle) {
          const urls = ['/', ...products.map(({ href }) => href)]
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>https://jpmeme.com${path}</loc></url>`).join('\n')}\n</urlset>\n`,
          })
        },
      },
    ],
  }
})
