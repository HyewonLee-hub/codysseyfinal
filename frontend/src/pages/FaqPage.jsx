import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { faqCategories, faqItems } from '../data/faq.js'

export default function FaqPage({ onHeaderNavigate }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('전체')
  const [openId, setOpenId] = useState(null)
  const [contactNotice, setContactNotice] = useState(false)
  const query = search.trim().toLocaleLowerCase()
  const filteredItems = faqItems.filter((item) =>
    (category === '전체' || item.category === category) &&
    (!query || `${item.question} ${item.answer}`.toLocaleLowerCase().includes(query)),
  )

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="고객센터" onNavigate={onHeaderNavigate} />
    <section aria-labelledby="faq-title" className="relative isolate h-[316px] overflow-hidden bg-[#e9f1ff]">
      <PageContainer className="relative z-10 pt-[64px]">
        <p className="text-[14px] font-bold text-primary">고객센터</p>
        <h1 id="faq-title" className="mt-[13px] text-[clamp(32px,5vw,49px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink">무엇을 도와드릴까요?</h1>
        <label htmlFor="faq-search" className="sr-only">자주 묻는 질문 검색</label>
        <input
          id="faq-search"
          type="search"
          value={search}
          onChange={(event) => { setSearch(event.target.value); setOpenId(null) }}
          placeholder="궁금한 내용을 검색해 주세요"
          className="mt-[31px] h-[63px] w-full max-w-[850px] rounded-full border border-[#d7e3f5] bg-white px-[27px] text-[16px] text-ink placeholder:text-[#657c93] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </PageContainer>
      <span aria-hidden="true" className="pointer-events-none absolute -top-[250px] -right-[260px] aspect-square w-[320px] shrink-0 rounded-full bg-[#e6e1ff] sm:-top-[380px] sm:w-[460px] xl:-top-[270px] xl:-right-[95px] xl:w-[520px]" />
    </section>

    <PageContainer as="main" className="pb-16 pt-[50px]">
      <div className="grid min-w-0 gap-x-14 gap-y-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav aria-label="FAQ 카테고리" className="flex min-w-0 flex-wrap gap-x-5 border-t-2 border-primary pt-3 lg:flex-col lg:gap-0 lg:pt-5">
          {faqCategories.map((item) => <button
            key={item}
            type="button"
            aria-current={category === item ? 'true' : undefined}
            onClick={() => { setCategory(item); setOpenId(null) }}
            className={`min-h-[48px] py-3 text-left !text-[17px] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary lg:min-h-[56px] ${category === item ? '!font-bold text-primary' : 'text-body hover:text-primary'}`}
          >{item === '단어·학습' ? '단어 · 학습' : item}</button>)}
        </nav>

        <div className="min-w-0 border-t-2 border-[#273443]">
          {filteredItems.length > 0 ? <ul>
            {filteredItems.map((item) => {
              const isOpen = openId === item.id
              const answerId = `faq-answer-${item.id}`
              return <li key={item.id} className="border-b border-[#d6e0ea]">
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex min-h-[77px] w-full items-center justify-between gap-4 text-left focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span className="!text-[18px] leading-[1.5] text-ink">{item.question}</span>
                    <span aria-hidden="true" className="shrink-0 !text-[23px] leading-none text-primary">{isOpen ? '−' : '+'}</span>
                  </button>
                </h2>
                <div id={answerId} hidden={!isOpen} className="pb-7 pr-8 text-[15px] leading-[1.7] text-body">{item.answer}</div>
              </li>
            })}
          </ul> : <div role="status" className="py-10 text-body">
            <p className="text-[20px] font-bold text-ink">검색 결과가 없습니다.</p>
            <p className="mt-3 text-[15px]">원하시는 답변을 찾지 못하셨나요? 1:1 문의를 이용해 주세요.</p>
          </div>}
        </div>
      </div>

      <div className="mt-[70px] flex flex-col items-stretch gap-4 sm:items-end">
        <div className="flex w-full flex-col items-stretch gap-4 rounded-[19px] bg-[#fff1d6] px-[27px] py-[15px] sm:w-auto sm:flex-row sm:items-center sm:gap-[31px] sm:pr-[17px]">
          <p className="text-[15px] text-ink">원하는 답변을 찾지 못하셨나요?</p>
          <Button size="sm" onClick={() => setContactNotice(true)} className="min-h-[40px] !min-w-[155px] !px-[19px] !text-[15px]">1:1 문의하기</Button>
        </div>
        {contactNotice && <p role="status" className="text-[14px] text-body">1:1 문의 화면은 현재 이용할 수 없습니다.</p>}
      </div>
    </PageContainer>
  </div>
}
