const tones = { primary: 'bg-primary-soft text-primary', success: 'bg-success-soft text-success', warning: 'bg-warning-soft text-warning', error: 'bg-error-soft text-error', neutral: 'bg-canvas text-body' }
export default function Badge({ tone = 'primary', children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold ${tones[tone] ?? tones.primary} ${className}`}>{children}</span>
}
