export default function ChoiceOption({ label, value, name, checked, disabled, onChange, variant = 'default', className = '' }) {
  if (variant === 'study') return <label className={`flex min-h-[55px] items-start gap-[15px] border-b pb-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${checked ? 'border-b-2 border-primary' : 'border-[#cbd8e9]'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
    <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} aria-label={`${value}. ${label}`} className="sr-only" />
    <span aria-hidden="true" className={`flex size-[34px] shrink-0 items-center justify-center rounded-full border text-[14px] ${checked ? 'border-primary bg-primary font-bold text-white' : 'border-[#c8d7e9] bg-white text-[#303846]'}`}>{value}</span>
    <span className={`min-w-0 break-words pt-[5px] text-[18px] ${checked ? 'font-bold text-primary' : 'text-[#303846]'}`}>{label}</span>
  </label>

  if (variant === 'diagnosis') return <label className={`flex min-h-[55px] items-start gap-[15px] border-b pb-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${checked ? 'border-b-2 border-primary' : 'border-[#cbd8e9]'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
    <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} aria-label={`${value}. ${label}`} className="sr-only" />
    <span aria-hidden="true" className={`flex size-[33px] shrink-0 items-center justify-center rounded-full border text-sm ${checked ? 'border-primary bg-primary text-white' : 'border-[#afc3dd] text-ink'}`}>{value}</span>
    <span className={`pt-[5px] text-[18px] ${checked ? 'font-bold text-primary' : 'text-ink'}`}>{label}</span>
  </label>

  return <label className={`flex min-h-14 items-center gap-4 rounded-2xl border px-5 py-3 text-[15px] transition-colors ${checked ? 'border-primary bg-primary-soft text-primary' : 'border-divider bg-white text-ink hover:border-primary'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
    <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className="size-4 shrink-0 accent-primary" />
    <span>{label}</span>
  </label>
}
