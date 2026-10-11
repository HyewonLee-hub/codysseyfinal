export default function PageContainer({ as: Element = 'div', children, className = '', ...props }) {
  return <Element className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[72px] ${className}`} {...props}>{children}</Element>
}
