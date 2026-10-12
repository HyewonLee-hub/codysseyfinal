import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

const initialValues = { type: '', subject: '', message: '' }
const requiredMessages = {
  type: '문의 유형을 선택해 주세요.',
  subject: '제목을 입력해 주세요.',
  message: '문의 내용을 입력해 주세요.',
}

export default function ContactPage({ onHeaderNavigate, onFaq }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const errorFor = (field) => touched[field] && !values[field].trim() ? requiredMessages[field] : undefined

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function markTouched(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setTouched({ type: true, subject: true, message: true })
  }

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="고객센터" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[58px]">
      <p className="text-[14px] font-bold text-primary">고객센터 / 1:1 문의</p>
      <h1 className="mt-[12px] text-[clamp(32px,5vw,49px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink max-[359px]:text-[29px]">궁금한 점을 남겨주세요.</h1>
      <p className="mt-[17px] text-[16px] leading-[1.55] text-body">문의 내용을 확인한 뒤 답변해 드립니다.</p>

      <div className="mt-[53px] grid min-w-0 gap-10 lg:grid-cols-[355px_minmax(0,1fr)] lg:gap-[70px]">
        <aside className="relative isolate h-[420px] overflow-hidden rounded-[24px] bg-[#e8e5ff] lg:h-[526px]" aria-labelledby="contact-help-title">
          <span aria-hidden="true" className="pointer-events-none absolute top-[160px] left-[18px] aspect-square w-[488px] rounded-full border-[64px] border-[#d6d0ff] lg:top-[193px]" />
          <div className="relative z-10 px-[33px] pt-[54px] max-[380px]:px-6">
            <h2 id="contact-help-title" className="text-[clamp(23px,4vw,28px)] leading-[1.34] font-bold tracking-[-0.04em] text-ink">답을 찾지 못했다면<br />문의해 주세요.</h2>
            <p className="mt-[22px] text-[16px] leading-[1.65] text-body">질문과 관련된 화면이나 학습 내용을 함께 적어주시면 확인에 도움이 됩니다.</p>
          </div>
          <a href="/support/faq" onClick={onFaq} className="absolute bottom-[31px] left-[33px] z-10 text-[15px] font-bold text-[#4e43ad] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#4e43ad] max-[380px]:left-6">자주 묻는 질문 보기 →</a>
        </aside>

        <section aria-labelledby="contact-form-title" className="min-w-0 pt-[2px]">
          <div className="flex min-h-[46px] flex-wrap items-start justify-between gap-x-4 gap-y-1 border-b-2 border-primary">
            <h2 id="contact-form-title" className="text-[24px] font-bold text-ink">문의 작성</h2>
            <p className="pt-[8px] text-[13px] text-[#536982]">모든 항목을 입력해 주세요</p>
          </div>

          <form noValidate onSubmit={handleSubmit}>
            <div className={`grid min-w-0 gap-x-[25px] border-b pb-4 pt-[26px] md:min-h-[88px] md:grid-cols-[125px_minmax(0,1fr)] ${errorFor('type') ? 'border-error' : 'border-[#d4deea]'}`}>
              <label htmlFor="contact-type" className="text-[16px] font-bold text-ink">문의 유형</label>
              <div className="relative min-w-0">
                <select id="contact-type" required value={values.type} onChange={(event) => updateField('type', event.target.value)} onBlur={() => markTouched('type')} aria-invalid={Boolean(errorFor('type'))} aria-describedby={errorFor('type') ? 'contact-type-error' : undefined} className={`h-[45px] w-full appearance-none bg-transparent pr-8 font-sans text-[16px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${values.type ? 'text-ink' : 'text-[#647a92]'}`}>
                  <option value="" disabled>유형을 선택해 주세요</option>
                  <option value="diagnosis">무료진단</option>
                  <option value="study">단어·학습</option>
                  <option value="report">보고서</option>
                  <option value="account">계정·기타</option>
                </select>
                <span aria-hidden="true" className="pointer-events-none absolute top-[8px] right-0 text-[20px] text-primary">⌄</span>
                {errorFor('type') && <p id="contact-type-error" role="alert" className="mt-1 text-[13px] text-error">{errorFor('type')}</p>}
              </div>
            </div>

            <div className={`grid min-w-0 gap-x-[25px] border-b pb-4 pt-[26px] md:min-h-[88px] md:grid-cols-[125px_minmax(0,1fr)] ${errorFor('subject') ? 'border-error' : 'border-[#d4deea]'}`}>
              <label htmlFor="contact-subject" className="text-[16px] font-bold text-ink">제목</label>
              <div className="min-w-0">
                <input id="contact-subject" type="text" required value={values.subject} onChange={(event) => updateField('subject', event.target.value)} onBlur={() => markTouched('subject')} placeholder="제목을 입력해 주세요" aria-invalid={Boolean(errorFor('subject'))} aria-describedby={errorFor('subject') ? 'contact-subject-error' : undefined} className="h-[45px] w-full bg-transparent text-[16px] text-ink placeholder:text-[#647a92] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                {errorFor('subject') && <p id="contact-subject-error" role="alert" className="mt-1 text-[13px] text-error">{errorFor('subject')}</p>}
              </div>
            </div>

            <div className={`grid min-w-0 gap-x-[25px] border-b pb-4 pt-[26px] md:min-h-[213px] md:grid-cols-[125px_minmax(0,1fr)] ${errorFor('message') ? 'border-error' : 'border-[#d4deea]'}`}>
              <label htmlFor="contact-message" className="text-[16px] font-bold text-ink">문의 내용</label>
              <div className="min-w-0">
                <textarea id="contact-message" required value={values.message} onChange={(event) => updateField('message', event.target.value)} onBlur={() => markTouched('message')} placeholder="궁금한 내용을 입력해 주세요" aria-invalid={Boolean(errorFor('message'))} aria-describedby={errorFor('message') ? 'contact-message-error' : undefined} className="min-h-[170px] w-full resize-y bg-transparent pt-[2px] font-sans text-[16px] text-ink placeholder:text-[#647a92] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                {errorFor('message') && <p id="contact-message-error" role="alert" className="mt-1 text-[13px] text-error">{errorFor('message')}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-[26px] sm:flex-row sm:items-center sm:justify-between">
              <p id="contact-unavailable" role="status" className="max-w-[520px] text-[14px] leading-[1.5] text-body">현재 문의 접수 기능을 준비 중입니다. 답변 이메일 안내도 아직 제공되지 않습니다.</p>
              <Button type="submit" size="lg" disabled aria-describedby="contact-unavailable" className="w-full shrink-0 !text-[15px] disabled:!bg-primary disabled:!text-white disabled:opacity-55 sm:w-[216px]">문의 보내기</Button>
            </div>
          </form>
        </section>
      </div>
    </PageContainer>
  </div>
}
