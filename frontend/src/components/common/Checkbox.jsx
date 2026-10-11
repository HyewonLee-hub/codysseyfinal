import { useId } from 'react'

export default function Checkbox({ label, id, className = '', ...props }) {
  const generatedId = useId()
  return <label htmlFor={id ?? generatedId} className={`inline-flex items-start gap-3 text-sm text-body ${props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
    <input id={id ?? generatedId} type="checkbox" className="mt-0.5 size-5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" {...props} />
    <span>{label}</span>
  </label>
}
