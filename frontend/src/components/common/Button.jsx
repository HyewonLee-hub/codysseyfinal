const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover disabled:bg-divider disabled:text-muted',
  secondary: 'border border-divider bg-white text-ink hover:bg-primary-soft disabled:bg-canvas disabled:text-muted',
  ghost: 'text-primary hover:bg-primary-soft disabled:text-muted',
}
const sizes = { sm: 'min-h-10 px-5 text-sm', md: 'min-h-[52px] px-8 text-[15px]', lg: 'min-h-[58px] px-9 text-base' }

export default function Button({ variant = 'primary', size = 'md', className = '', type = 'button', children, ...props }) {
  return <button type={type} className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`} {...props}>{children}</button>
}
