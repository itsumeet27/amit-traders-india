#!/usr/bin/env node
/**
 * List products whose image URLs point to /uploads/ (may be missing after Render redeploy).
 * After deploying DB-backed uploads, re-upload images for these products in admin.
 */
const API_BASE = (process.env.API_BASE_URL || 'https://amit-traders-india-new.onrender.com').replace(/\/$/, '')

async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`)
  if (!res.ok) return null
  return res.json()
}

async function checkImage(url) {
  const full = url.startsWith('http') ? url : `${API_BASE}${url}`
  const res = await fetch(full, { method: 'HEAD' })
  return res.ok
}

async function main() {
  const needsAttention = []
  for (let id = 1; id <= 120; id += 1) {
    const product = await fetchProduct(id)
    if (!product?.active) continue
    const uploadImages = (product.images || []).filter((img) => img.imageUrl?.startsWith('/uploads/'))
    if (!uploadImages.length) continue

    const broken = []
    for (const img of uploadImages) {
      const ok = await checkImage(img.imageUrl)
      if (!ok) broken.push(img.imageUrl)
    }
    if (broken.length) {
      needsAttention.push({ id: product.id, name: product.name, broken })
    }
  }

  if (!needsAttention.length) {
    console.log('All /uploads/ product images are reachable.')
    return
  }

  console.log('Products with missing upload images (re-upload in admin):')
  for (const item of needsAttention) {
    console.log(`- #${item.id} ${item.name}`)
    item.broken.forEach((url) => console.log(`    ${url}`))
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
