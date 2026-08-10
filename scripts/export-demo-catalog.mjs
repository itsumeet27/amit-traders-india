#!/usr/bin/env node
/**
 * Export live API catalog into frontend/public/demo-data with /catalog/* image paths.
 */

import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const API_BASE = (process.env.API_BASE_URL || 'https://amit-traders-india-new.onrender.com').replace(/\/$/, '')

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) throw new Error(`GET ${path} failed: ${response.status}`)
  return response.json()
}

function categoryImagePath(slug) {
  return `/catalog/categories/${slug}.jpg`
}

function productImagePath(slug) {
  return `/catalog/products/${slug}.png`
}

async function main() {
  const categories = await fetchJson('/api/categories')
  const productsPage = await fetchJson('/api/products?page=0&size=100')

  const demoCategories = categories.map((category) => ({
    ...category,
    imageUrl: categoryImagePath(category.slug),
  }))

  const demoProducts = {
    ...productsPage,
    content: productsPage.content.map((product) => ({
      ...product,
      images: [
        {
          id: product.images?.[0]?.id ?? product.id,
          imageUrl: productImagePath(product.slug),
          altText: product.name,
          displayOrder: 0,
        },
      ],
    })),
  }

  writeFileSync(
    resolve(ROOT, 'frontend/public/demo-data/categories.json'),
    `${JSON.stringify(demoCategories, null, 2)}\n`,
  )
  writeFileSync(
    resolve(ROOT, 'frontend/public/demo-data/products.json'),
    `${JSON.stringify(demoProducts, null, 2)}\n`,
  )

  const productDetails = Object.fromEntries(
    demoProducts.content.map((product) => [product.slug, product]),
  )
  writeFileSync(
    resolve(ROOT, 'frontend/public/demo-data/product-details.json'),
    `${JSON.stringify(productDetails, null, 2)}\n`,
  )

  console.log(`Wrote ${demoCategories.length} categories and ${demoProducts.content.length} products`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
