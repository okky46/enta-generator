import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { products } from './src/products'

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export default defineConfig(({ command }) => {
  const productCards = products.map((product) => {
    const href = command === 'serve' ? `${product.href.replace(/\/$/, '')}/` : product.href

    return `
  <article class="product-card">
    <h3>${escapeHtml(product.name)}</h3>
    <p>${escapeHtml(product.description)}</p>
    <a href="${escapeHtml(href)}">${escapeHtml(product.name)}で遊ぶ <span aria-hidden="true">→</span></a>
  </article>`
  }).join('')

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
          return html.replace('<!--PRODUCT_CARDS-->', productCards)
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
