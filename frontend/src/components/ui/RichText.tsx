import { Fragment } from 'react'

/** Renders admin-authored text with optional **bold** markers. */
export function RichText({ text }: { text?: string | null }) {
  if (!text) return null

  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-primary">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}
