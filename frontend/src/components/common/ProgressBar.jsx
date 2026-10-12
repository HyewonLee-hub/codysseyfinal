export default function ProgressBar({ value, max = 100, label, ariaLabel, valueText, showValue = false, trackClassName = '', fillClassName = '', className = '' }) {
  const percent = max > 0 ? Math.min(100, Math.max(0, value / max * 100)) : 0
  return <div className={className}>
    {(label || showValue) && <div className="mb-2 flex justify-between text-sm text-body"><span>{label}</span>{showValue && <span>{value} / {max}</span>}</div>}
    <div role="progressbar" aria-label={ariaLabel || label || '진행률'} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-valuetext={valueText} className={`h-2.5 overflow-hidden rounded-full bg-primary-soft ${trackClassName}`}><div className={`h-full rounded-full bg-primary transition-[width] ${fillClassName}`} style={{ width: `${percent}%` }} /></div>
  </div>
}
