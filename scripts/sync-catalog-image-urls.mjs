#!/usr/bin/env node
/**
 * Point live category/product image URLs at repo-hosted /catalog/* assets.
 *
 * Usage:
 *   API_BASE_URL=https://amit-traders-india-new.onrender.com \
 *   ADMIN_EMAIL=admin@amittraders.com \
 *   ADMIN_PASSWORD='Admin@12345' \
 *   node scripts/sync-catalog-image-urls.mjs
 */

const API_BASE = (process.env.API_BASE_URL || 'https://amit-traders-india-new.onrender.com').replace(/\/$/, '')
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@amittraders.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345'

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${typeof data === 'string' ? data : JSON.stringify(data)}`)
  }
  return data
}

async function login() {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  return data.token
}

function categoryImagePath(slug) {
  return `/catalog/categories/${slug}.jpg`
}

function productImagePath(slug) {
  return `/catalog/products/${slug}.png`
}

async function syncCategories(token) {
  const categories = await request('/api/categories', { token })
  for (const category of categories) {
    const imageUrl = categoryImagePath(category.slug)
    await request(`/api/admin/categories/${category.id}`, {
      method: 'PUT',
      token,
      body: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl,
        displayOrder: category.displayOrder,
        active: category.active,
      },
    })
    console.log(`category ${category.slug} -> ${imageUrl}`)
  }
}

async function syncProducts(token) {
  const page = await request('/api/products?page=0&size=100', { token })
  const products = page.content || page
  for (const product of products) {
    const imageUrl = productImagePath(product.slug)
    await request(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      token,
      body: {
        categoryId: product.categoryId,
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        material: product.material,
        leatherType: product.leatherType,
        colors: product.colors,
        dimensions: product.dimensions,
        customization: product.customization,
        branding: product.branding,
        manufacturingInfo: product.manufacturingInfo,
        minimumOrderQuantity: product.minimumOrderQuantity,
        featured: product.featured,
        active: product.active,
        images: [
          {
            imageUrl,
            altText: product.name,
            displayOrder: 0,
          },
        ],
      },
    })
    console.log(`product ${product.slug} -> ${imageUrl}`)
  }
}

async function main() {
  console.log(`Syncing catalog image URLs via ${API_BASE}`)
  const token = await login()
  await syncCategories(token)
  await syncProducts(token)
  console.log('Catalog image URL sync complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
