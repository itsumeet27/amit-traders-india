import { useEffect, useState, type FormEvent } from 'react'
import { Seo } from '@/components/Seo'
import { PageHeader } from '@/components/admin/DataTable'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { LoadingSpinner } from '@/components/ui/Feedback'
import { companyService } from '@/services/companyService'
import type { CompanyProfile } from '@/types'
import { getErrorMessage } from '@/utils'
import { useToast } from '@/context/ToastContext'

export function AdminCompanyProfilePage() {
  const [form, setForm] = useState<Partial<CompanyProfile> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { push } = useToast()

  useEffect(() => {
    companyService
      .getAdmin()
      .then(setForm)
      .catch((error) => push(getErrorMessage(error), 'error'))
      .finally(() => setLoading(false))
  }, [push])

  function update<K extends keyof CompanyProfile>(key: K, value: CompanyProfile[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        whyChooseUsJson:
          typeof form.whyChooseUsJson === 'string'
            ? form.whyChooseUsJson
            : JSON.stringify(form.whyChooseUsJson ?? []),
        manufacturingStepsJson:
          typeof form.manufacturingStepsJson === 'string'
            ? form.manufacturingStepsJson
            : JSON.stringify(form.manufacturingStepsJson ?? []),
        missionCommitmentsJson:
          typeof form.missionCommitmentsJson === 'string'
            ? form.missionCommitmentsJson
            : JSON.stringify(form.missionCommitmentsJson ?? []),
        aboutValuesJson:
          typeof form.aboutValuesJson === 'string'
            ? form.aboutValuesJson
            : JSON.stringify(form.aboutValuesJson ?? []),
        customManufacturingFeaturesJson:
          typeof form.customManufacturingFeaturesJson === 'string'
            ? form.customManufacturingFeaturesJson
            : JSON.stringify(form.customManufacturingFeaturesJson ?? []),
      }
      const updated = await companyService.update(payload)
      setForm(updated)
      push('Company profile saved', 'success')
    } catch (error) {
      push(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <LoadingSpinner />

  return (
    <>
      <Seo title="Company Profile" path="/admin/company" noIndex />
      <PageHeader
        title="Company profile"
        description="Hero, about content, contact details, and process copy for the public site."
      />

      <form
        onSubmit={onSubmit}
        className="max-w-4xl space-y-5 border border-light-tan/70 bg-off-white p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Company name"
            required
            value={form.companyName || ''}
            onChange={(e) => update('companyName', e.target.value)}
          />
          <Input
            label="Tagline"
            value={form.tagline || ''}
            onChange={(e) => update('tagline', e.target.value)}
          />
        </div>
        <Textarea
          label="Description"
          value={form.description || ''}
          onChange={(e) => update('description', e.target.value)}
        />

        <div className="border-t border-light-tan/60 pt-6">
          <h2 className="font-display text-2xl text-primary">About page</h2>
          <p className="mt-1 text-sm text-leather">
            Hero, story, mission, vision, values, and promise content for the public About Us page.
            Use blank lines between paragraphs. Wrap emphasis in **double asterisks**.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="About hero title"
            value={form.aboutHeroTitle || ''}
            onChange={(e) => update('aboutHeroTitle', e.target.value)}
          />
          <Input
            label="About hero subtitle"
            value={form.aboutHeroSubtitle || ''}
            onChange={(e) => update('aboutHeroSubtitle', e.target.value)}
          />
          <Input
            label="Story headline"
            value={form.storyHeadline || ''}
            onChange={(e) => update('storyHeadline', e.target.value)}
          />
          <Input
            label="Mission headline"
            value={form.missionHeadline || ''}
            onChange={(e) => update('missionHeadline', e.target.value)}
          />
          <Input
            label="Vision headline"
            value={form.visionHeadline || ''}
            onChange={(e) => update('visionHeadline', e.target.value)}
          />
        </div>
        <Textarea
          label="Our story"
          value={form.history || ''}
          onChange={(e) => update('history', e.target.value)}
          hint="Separate paragraphs with a blank line."
        />
        <Textarea
          label="Mission body"
          value={form.mission || ''}
          onChange={(e) => update('mission', e.target.value)}
          hint="Introductory mission copy before the commitment list."
        />
        <Textarea
          label="Mission commitments (JSON array)"
          value={
            typeof form.missionCommitmentsJson === 'string'
              ? form.missionCommitmentsJson
              : JSON.stringify(form.missionCommitmentsJson ?? [], null, 2)
          }
          onChange={(e) => update('missionCommitmentsJson', e.target.value)}
          hint='["Delivering consistent and dependable product quality", "..."]'
        />
        <Textarea
          label="Mission closing"
          value={form.missionClosing || ''}
          onChange={(e) => update('missionClosing', e.target.value)}
        />
        <Textarea
          label="Vision body"
          value={form.vision || ''}
          onChange={(e) => update('vision', e.target.value)}
          hint="Separate paragraphs with a blank line."
        />
        <Textarea
          label="What we stand for (JSON array)"
          value={
            typeof form.aboutValuesJson === 'string'
              ? form.aboutValuesJson
              : JSON.stringify(form.aboutValuesJson ?? [], null, 2)
          }
          onChange={(e) => update('aboutValuesJson', e.target.value)}
          hint='[{ "title": "Craftsmanship", "description": "..." }]'
        />
        <Input
          label="Promise headline"
          value={form.aboutPromiseHeadline || ''}
          onChange={(e) => update('aboutPromiseHeadline', e.target.value)}
        />
        <Textarea
          label="Promise body"
          value={form.aboutPromiseBody || ''}
          onChange={(e) => update('aboutPromiseBody', e.target.value)}
        />
        <Textarea
          label="Promise closing"
          value={form.aboutPromiseClosing || ''}
          onChange={(e) => update('aboutPromiseClosing', e.target.value)}
        />

        <div className="border-t border-light-tan/60 pt-6">
          <h2 className="font-display text-2xl text-primary">Homepage hero</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Hero title"
            value={form.heroTitle || ''}
            onChange={(e) => update('heroTitle', e.target.value)}
          />
          <Input
            label="Hero subtitle"
            value={form.heroSubtitle || ''}
            onChange={(e) => update('heroSubtitle', e.target.value)}
          />
          <Input
            label="Primary CTA label"
            value={form.heroCtaPrimary || ''}
            onChange={(e) => update('heroCtaPrimary', e.target.value)}
          />
          <Input
            label="Secondary CTA label"
            value={form.heroCtaSecondary || ''}
            onChange={(e) => update('heroCtaSecondary', e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ImageUpload
            label="Hero image"
            value={form.heroImageUrl || ''}
            onChange={(url) => update('heroImageUrl', url)}
            folder="company"
          />
          <ImageUpload
            label="About image"
            value={form.aboutImageUrl || ''}
            onChange={(url) => update('aboutImageUrl', url)}
            folder="company"
          />
        </div>
        <Textarea
          label="Why choose us (JSON array)"
          value={
            typeof form.whyChooseUsJson === 'string'
              ? form.whyChooseUsJson
              : JSON.stringify(form.whyChooseUsJson ?? [], null, 2)
          }
          onChange={(e) => update('whyChooseUsJson', e.target.value)}
          hint='[{ "title": "...", "description": "...", "icon": "shield" }]'
        />
        <Textarea
          label="Manufacturing steps (JSON array)"
          value={
            typeof form.manufacturingStepsJson === 'string'
              ? form.manufacturingStepsJson
              : JSON.stringify(form.manufacturingStepsJson ?? [], null, 2)
          }
          onChange={(e) => update('manufacturingStepsJson', e.target.value)}
          hint='[{ "title": "...", "description": "...", "order": 1 }]'
        />
        <Input
          label="Custom manufacturing title"
          value={form.customManufacturingTitle || ''}
          onChange={(e) => update('customManufacturingTitle', e.target.value)}
        />
        <Textarea
          label="Custom manufacturing description"
          value={form.customManufacturingDescription || ''}
          onChange={(e) => update('customManufacturingDescription', e.target.value)}
        />
        <Textarea
          label="Custom manufacturing features (JSON)"
          value={
            typeof form.customManufacturingFeaturesJson === 'string'
              ? form.customManufacturingFeaturesJson
              : JSON.stringify(form.customManufacturingFeaturesJson ?? [], null, 2)
          }
          onChange={(e) => update('customManufacturingFeaturesJson', e.target.value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="CTA title"
            value={form.ctaTitle || ''}
            onChange={(e) => update('ctaTitle', e.target.value)}
          />
          <Input
            label="CTA subtitle"
            value={form.ctaSubtitle || ''}
            onChange={(e) => update('ctaSubtitle', e.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Address"
            value={form.address || ''}
            onChange={(e) => update('address', e.target.value)}
          />
          <Input
            label="City"
            value={form.city || ''}
            onChange={(e) => update('city', e.target.value)}
          />
          <Input
            label="State"
            value={form.state || ''}
            onChange={(e) => update('state', e.target.value)}
          />
          <Input
            label="Country"
            value={form.country || ''}
            onChange={(e) => update('country', e.target.value)}
          />
          <Input
            label="Phone"
            value={form.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
          />
          <Input
            label="Email"
            value={form.email || ''}
            onChange={(e) => update('email', e.target.value)}
          />
          <Input
            label="Website"
            value={form.website || ''}
            onChange={(e) => update('website', e.target.value)}
          />
          <Input
            label="LinkedIn"
            value={form.linkedin || ''}
            onChange={(e) => update('linkedin', e.target.value)}
          />
          <Input
            label="Instagram"
            value={form.instagram || ''}
            onChange={(e) => update('instagram', e.target.value)}
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </>
  )
}
