export default function Card({ as: Element = 'div', children, className = '', elevated = false, ...props }) {
  return <Element className={`rounded-[28px] border border-line bg-surface p-6 ${elevated ? 'shadow-card' : ''} ${className}`} {...props}>{children}</Element>
}
