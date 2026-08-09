import { Award, Factory, Handshake, ShieldCheck } from 'lucide-react'
import type { WhyChooseItem } from '@/types'
import { SectionReveal } from '@/components/ui/SafeImage'

const defaults: WhyChooseItem[] = [
  {
    title: 'Genuine materials',
    description: 'Sourced leather selected for durability, hand-feel, and consistent finishing.',
    icon: 'shield',
  },
  {
    title: 'Custom manufacturing',
    description: 'Private label and made-to-order programs built around your brand brief.',
    icon: 'factory',
  },
  {
    title: 'Export-ready quality',
    description: 'Disciplined QC across cutting, stitching, hardware, and packing.',
    icon: 'award',
  },
  {
    title: 'Partnership focus',
    description: 'Transparent communication, realistic MOQs, and reliable production calendars.',
    icon: 'handshake',
  },
]

const icons = {
  shield: ShieldCheck,
  factory: Factory,
  award: Award,
  handshake: Handshake,
}

export function WhyChooseUs({ items }: { items?: WhyChooseItem[] }) {
  const list = items?.length ? items : defaults

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {list.map((item, index) => {
        const Icon =
          icons[(item.icon as keyof typeof icons) || 'shield'] || ShieldCheck
        return (
          <SectionReveal key={`${item.title}-${index}`} delayMs={index * 70}>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-gold">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-leather md:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          </SectionReveal>
        )
      })}
    </div>
  )
}
