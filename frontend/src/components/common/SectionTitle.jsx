export default function SectionTitle({ eyebrow, title, description, as: Heading = 'h2', className = '' }) {
  return <div className={className}>
    {eyebrow && <p className="mb-3 text-sm font-bold text-primary">{eyebrow}</p>}
    <Heading className="text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.2] tracking-[-0.05em] text-ink">{title}</Heading>
    {description && <p className="mt-4 text-base leading-[1.55] text-body">{description}</p>}
  </div>
}
