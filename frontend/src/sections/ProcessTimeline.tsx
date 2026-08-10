import type { TimelineStep } from '@/types'
import { SectionReveal } from '@/components/ui/SafeImage'

const defaults: TimelineStep[] = [
  {
    step: 1,
    title: 'Share requirement',
    description: 'Tell us about products, quantities, branding, and timelines.',
  },
  {
    step: 2,
    title: 'Discuss customization',
    description: 'Select products and branding methods suited to your brief.',
  },
  {
    step: 3,
    title: 'Sample approval',
    description: 'Review physical samples before production begins.',
  },
  {
    step: 4,
    title: 'Bulk manufacturing',
    description: 'Production with staged quality checkpoints.',
  },
  {
    step: 5,
    title: 'Quality checks',
    description: 'Inspection across construction, branding, and packaging.',
  },
  {
    step: 6,
    title: 'Delivery',
    description: 'Nationwide dispatch of finished corporate orders.',
  },
]

export function ProcessTimeline({ steps }: { steps?: TimelineStep[] }) {
  const list = (steps?.length ? steps : defaults)
    .slice()
    .sort((a, b) => (a.step ?? a.order ?? 0) - (b.step ?? b.order ?? 0))

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((step, index) => {
        const stepNumber = step.step ?? index + 1
        return (
          <SectionReveal key={`${step.title}-${stepNumber}`} delayMs={index * 60}>
            <article className="flex h-full flex-col border border-light-tan/60 bg-off-white p-6 shadow-[0_12px_40px_-28px_rgba(59,36,24,0.35)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary font-display text-lg text-cream">
                  {String(stepNumber).padStart(2, '0')}
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-gold">
                  Step {stepNumber}
                </span>
              </div>
              <h3 className="font-display text-2xl text-primary">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-leather">{step.description}</p>
            </article>
          </SectionReveal>
        )
      })}
    </div>
  )
}
