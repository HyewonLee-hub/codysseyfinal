import { useId } from 'react'

export default function Input({ label, error, hint, id, className = '', required, showRequiredIndicator = true, variant = 'default', ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helpId = `${inputId}-help`
  const underline = variant === 'underline'
  return <div className={`${underline ? 'grid gap-0' : 'grid gap-3'} ${className}`}>
    {label && <label htmlFor={inputId} className={`${underline ? 'text-[15px] leading-[17px]' : 'text-sm'} font-bold text-ink`}>{label}{required && showRequiredIndicator && <span className="ml-1 text-error" aria-hidden="true">*</span>}</label>}
    <input id={inputId} required={required} aria-invalid={Boolean(error)} aria-describedby={error || hint ? helpId : undefined} className={`${underline ? 'mt-[18px] h-[38px] rounded-none border-0 border-b-[1.5px] bg-transparent px-0 pb-[18px] text-base leading-[18px] placeholder:text-[#9eacbd] focus:ring-0' : 'h-12 rounded-[10px] border bg-white px-4 text-[15px] placeholder:text-muted focus:ring-2 focus:ring-primary/15'} w-full text-ink outline-none focus:border-primary disabled:bg-canvas disabled:text-muted ${error ? underline ? 'border-error focus:border-error' : 'border-error bg-error-soft focus:border-error focus:ring-error/15' : 'border-field'}`} {...props} />
    {(error || hint) && <p id={helpId} className={`text-[13px] ${error ? 'text-error' : 'text-muted'}`}>{error || hint}</p>}
  </div>
}
