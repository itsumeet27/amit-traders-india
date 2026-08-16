#!/usr/bin/env node
/**
 * Sync frontend/public/demo-data product JSON from the live API.
 * Uses per-product GET (works even when the list endpoint is unavailable).
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = process.env.API_BASE_URL || 'https://amit-traders-india-new.onrender.com'
const MAX_ID = Number(process.env.MAX_PRODUCT_ID || 120)

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'frontend', 'public', 'demo-data')

async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`)
  if (!res.ok) return null
  return res.json()
}

async function main() {
  const products = []
  for (let id = 1; id <= MAX_ID; id += 1) {
    const product = await fetchProduct(id)
    if (product?.active) products.push(product)
  }

  products.sort((a, b) => a.name.localeCompare(b.name))

  const page = {
    content: products,
    page: 0,
    size: products.length,
    totalElements: products.length,
    totalPages: 1,
    first: true,
    last: true,
  }

  writeFileSync(join(outDir, 'products.json'), `${JSON.stringify(page, null, 2)}\n`)
  writeFileSync(join(outDir, 'product-details.json'), `${JSON.stringify(products, null, 2)}\n`)

  console.log(`Synced ${products.length} active products to demo-data`)
  products.forEach((p) => console.log(` - ${p.id}: ${p.name}`))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
