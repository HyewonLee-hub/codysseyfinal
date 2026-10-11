import { useId } from 'react'

export default function Checkbox({ label, id, className = '', variant = 'default', ...props }) {
  const generatedId = useId()
  return <label htmlFor={id ?? generatedId} className={`inline-flex items-start gap-3 text-sm text-body ${variant === 'circle' ? 'leading-5' : ''} ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
    <input id={id ?? generatedId} type="checkbox" className={`${variant === 'circle' ? 'appearance-none rounded-full border-[1.5px] border-[#8ba5c7] checked:border-primary checked:bg-primary' : 'mt-0.5 accent-primary'} size-5 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`} {...props} />
    <span>{label}</span>
  </label>
}
