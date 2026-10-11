export default function ChoiceOption({ label, value, name, checked, disabled, onChange, className = '' }) {
  return <label className={`flex min-h-14 items-center gap-4 rounded-2xl border px-5 py-3 text-[15px] transition-colors ${checked ? 'border-primary bg-primary-soft text-primary' : 'border-divider bg-white text-ink hover:border-primary'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
    <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className="size-4 shrink-0 accent-primary" />
    <span>{label}</span>
  </label>
}
