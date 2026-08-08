import type { TimelineStep } from '@/types'
import { SectionReveal } from '@/components/ui/SafeImage'

const defaults: TimelineStep[] = [
  {
    title: 'Brief & sampling',
    description: 'Align on materials, construction, branding, and commercial targets.',
  },
  {
    title: 'Material selection',
    description: 'Source genuine leather and hardware matched to your specification.',
  },
  {
    title: 'Pattern & prototype',
    description: 'Develop patterns and refine samples until fit and finish are approved.',
  },
  {
    title: 'Production & QC',
    description: 'Scale manufacturing with staged inspections and export packing standards.',
  },
]

export function ProcessTimeline({ steps }: { steps?: TimelineStep[] }) {
  const list = (steps?.length ? steps : defaults).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <ol className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-light-tan md:before:left-1/2">
      {list.map((step, index) => (
        <SectionReveal key={`${step.title}-${index}`} delayMs={index * 80}>
          <li className="relative grid gap-3 md:grid-cols-2 md:gap-10">
            <div
              className={`flex items-start gap-4 md:items-center ${
                index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
              }`}
            >
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center bg-gold font-display text-sm text-primary">
                {index + 1}
              </span>
              <div className={index % 2 === 0 ? 'md:pr-4' : 'md:pl-4'}>
                <h3 className="font-display text-2xl text-primary">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-leather">{step.description}</p>
              </div>
            </div>
            <div className="hidden md:block" />
          </li>
        </SectionReveal>
      ))}
    </ol>
  )
}
