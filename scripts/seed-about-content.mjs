#!/usr/bin/env node
/**
 * Seed About Us content on the live company profile via admin API.
 */

const API_BASE = (process.env.API_BASE_URL || 'https://amit-traders-india-new.onrender.com').replace(
  /\/$/,
  '',
)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@amittraders.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345'

const ABOUT_CONTENT = {
  aboutHeroTitle: 'Crafted with Purpose. Built to Last.',
  aboutHeroSubtitle:
    'A trusted manufacturing partner for businesses seeking thoughtfully designed leather goods and corporate gifting solutions.',
  storyHeadline: 'Crafted with Purpose. Built to Last.',
  history: `What began with a passion for quality craftsmanship has grown into a trusted manufacturing partner for businesses seeking thoughtfully designed leather goods and corporate gifting solutions.

At **Amit Traders**, we believe that a well-crafted product is more than just an object—it represents the care, precision, and values behind the hands that create it. With experience in manufacturing leather goods and corporate gift articles, we combine traditional craftsmanship with contemporary designs to create products that are practical, refined, and made to leave a lasting impression.

From selecting the right materials to the final finishing touches, every stage of our manufacturing process is guided by attention to detail. Our products are thoughtfully developed to meet the requirements of businesses, brands, institutions, and corporate clients looking for quality products that reflect their identity.

Over the years, our focus has remained simple: **create beautifully handcrafted products, maintain consistent quality, and build relationships that last.**

Whether it is a customized corporate gift, a branded leather accessory, or a specially developed product for your business, we approach every requirement with the same commitment to craftsmanship and reliability.`,
  missionHeadline: 'Creating Quality That Represents Your Brand',
  mission: `Our mission is to manufacture high-quality leather goods and corporate gift articles that combine **craftsmanship, functionality, and timeless design**.

We strive to understand the unique requirements of every client and transform their ideas into thoughtfully crafted products. By maintaining high standards throughout our manufacturing process, we aim to deliver products that not only meet expectations but also represent the quality and professionalism of the brands they carry.`,
  missionCommitmentsJson: JSON.stringify([
    'Delivering consistent and dependable product quality',
    'Combining skilled craftsmanship with modern manufacturing practices',
    'Creating customized solutions based on individual requirements',
    'Maintaining attention to detail across every stage of production',
    'Building long-term relationships through trust, transparency, and reliability',
    'Continuously improving our products, processes, and capabilities',
  ]),
  missionClosing: '**Our goal is simple: to make every product worthy of the brand it represents.**',
  visionHeadline: 'To Make Every Product Worth Remembering',
  vision: `Our vision is to become a trusted name in the manufacturing of **premium leather goods and corporate gifting products**, recognized for craftsmanship, reliability, innovation, and the ability to turn ideas into beautifully finished products.

We envision building long-lasting partnerships with businesses and brands by becoming more than just a manufacturer—we aim to be a dependable partner in creating products that communicate quality and make a lasting impression.

As we grow, we remain committed to preserving the essence of handcrafted workmanship while embracing evolving designs, materials, technologies, and customer expectations.

**We believe the future of craftsmanship lies in bringing together the character of handmade work with the precision of modern manufacturing.**`,
  aboutValuesJson: JSON.stringify([
    {
      title: 'Craftsmanship',
      description:
        'Every product receives careful attention to detail, from material selection to stitching, finishing, and final inspection.',
    },
    {
      title: 'Quality',
      description:
        'We believe quality is not a feature added at the end of manufacturing—it is a standard maintained throughout the entire process.',
    },
    {
      title: 'Integrity',
      description:
        'We value honest communication, transparent business practices, and relationships built on trust.',
    },
    {
      title: 'Customization',
      description:
        'Every brand has a story to tell. We work closely with our clients to create products that reflect their requirements, identity, and purpose.',
    },
    {
      title: 'Reliability',
      description:
        'From the first conversation to final delivery, we strive to be a manufacturing partner our clients can depend on.',
    },
    {
      title: 'Lasting Value',
      description:
        'We create products designed not merely to be given, but to be used, appreciated, and remembered.',
    },
  ]),
  aboutPromiseHeadline: 'Beautifully handcrafted. Thoughtfully made. Reliably delivered.',
  aboutPromiseBody:
    'At Amit Traders, every product carries more than a brand name. It carries the craftsmanship, attention, and commitment that went into making it.',
  aboutPromiseClosing:
    'And that is what we strive to deliver—**leather goods and corporate gifts that people are proud to receive, use, and remember.**',
  aboutImageUrl: '/catalog/categories/laptop-bags.jpg',
}

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
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${JSON.stringify(data)}`)
  }
  return data
}

async function main() {
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })

  const current = await request('/api/admin/company-profile', { token: login.token })
  const updated = await request('/api/admin/company-profile', {
    method: 'PUT',
    token: login.token,
    body: { ...current, ...ABOUT_CONTENT },
  })

  console.log('Updated About Us content on company profile:', updated.companyName)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
