const tones = { error: 'border-error/20 bg-error-soft text-error', success: 'border-success/20 bg-success-soft text-success', info: 'border-primary/20 bg-primary-soft text-primary' }
export default function InlineAlert({ title, children, tone = 'error', className = '' }) {
  return <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-5 py-3 ${tones[tone] ?? tones.error} ${className}`}>
    {title && <p className="font-bold">{title}</p>}{children && <p className="mt-1 text-sm">{children}</p>}
  </div>
}
