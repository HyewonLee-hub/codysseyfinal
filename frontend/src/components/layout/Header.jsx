import PageContainer from './PageContainer.jsx'

const defaultItems = ['무료진단', '오늘의 단어', '학습', '마이페이지', '고객센터']

export default function Header({ items = defaultItems, active, onNavigate, action, className = '' }) {
  return <header className={`border-b border-line bg-white ${className}`}>
    <PageContainer className="flex min-h-[84px] flex-wrap items-center justify-between gap-4 py-4">
      <div className="min-w-0 flex-1" aria-label="로고 영역" />
      <nav aria-label="주 메뉴" className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-8 lg:gap-x-12">
        {items.map((item) => <button key={item} type="button" aria-current={active === item ? 'page' : undefined} onClick={() => onNavigate?.(item)} className={`text-[15px] hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary ${active === item ? 'font-bold text-primary' : 'text-nav'}`}>{item}</button>)}
      </nav>
      {action && <div>{action}</div>}
    </PageContainer>
  </header>
}
