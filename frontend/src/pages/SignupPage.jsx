import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Checkbox from '../components/common/Checkbox.jsx'
import Input from '../components/common/Input.jsx'
import InlineAlert from '../components/common/InlineAlert.jsx'
import Header from '../components/layout/Header.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const initialValues = { name: '', age: '', email: '', password: '' }
const requiredMessages = {
  name: '이름을 입력해 주세요.',
  age: '나이를 입력해 주세요.',
  email: '이메일을 입력해 주세요.',
  password: '비밀번호를 입력해 주세요.',
}

function validateField(field, value) {
  const trimmed = value.trim()
  if (!trimmed) return requiredMessages[field]
  if (field === 'age' && (!/^\d+$/.test(trimmed) || Number(trimmed) < 1 || Number(trimmed) > 120)) return '나이는 1세부터 120세까지의 정수로 입력해 주세요.'
  if (field === 'email' && !emailPattern.test(trimmed)) return '올바른 이메일 형식으로 입력해 주세요.'
  return undefined
}

export default function SignupPage({ onLogin, onHeaderNavigate }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [agreed, setAgreed] = useState(false)
  const [agreementError, setAgreementError] = useState(false)
  const [notice, setNotice] = useState('')
  const fieldErrors = Object.entries(errors).filter(([, error]) => Boolean(error))
  const hasRequiredError = fieldErrors.some(([field, error]) => error === requiredMessages[field])
  const alertTitle = hasRequiredError ? '필수 정보를 입력해 주세요.' : '입력 형식을 확인해 주세요.'
  const alertDescription = hasRequiredError
    ? '이름·나이·이메일·비밀번호를 확인한 뒤 다시 진행해 주세요.'
    : errors.email && errors.age
      ? '이메일 형식과 나이 입력값을 확인한 뒤 다시 진행해 주세요.'
      : errors.email
        ? '올바른 이메일 형식으로 입력한 뒤 다시 진행해 주세요.'
        : errors.age === '나이는 숫자만 입력해 주세요.'
          ? '나이는 숫자만 입력한 뒤 다시 진행해 주세요.'
          : '나이를 1세부터 120세까지의 정수로 입력해 주세요.'

  function updateField(field, rawValue) {
    const invalidAgeCharacters = field === 'age' && /\D/.test(rawValue)
    const value = field === 'age' ? rawValue.replace(/\D/g, '') : rawValue
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (invalidAgeCharacters) return { ...current, age: '나이는 숫자만 입력해 주세요.' }
      if (current[field] === undefined) return current
      return { ...current, [field]: validateField(field, value) }
    })
    setNotice('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const normalizedName = values.name.trim()
    setValues((current) => ({ ...current, name: normalizedName }))
    const nextErrors = Object.fromEntries(Object.entries({ ...values, name: normalizedName })
      .map(([field, value]) => [field, validateField(field, value)])
      .filter(([, error]) => error))
    setErrors(nextErrors)
    setAgreementError(!agreed)
    setNotice(Object.keys(nextErrors).length === 0 && agreed ? '현재 계정 생성 기능은 준비 중입니다. 인증 연결 후 이용해 주세요.' : '')
  }

  return <div className="min-h-screen bg-canvas">
    <Header onNavigate={onHeaderNavigate} className="[&>div]:min-h-[83px] [&_nav]:gap-x-3 sm:[&_nav]:gap-x-8 lg:[&_nav]:gap-x-[49px]" />
    <main className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-[1440px] lg:grid-cols-[minmax(0,575fr)_minmax(0,865fr)]">
      <section aria-labelledby="signup-intro-title" className="relative min-h-[480px] overflow-hidden bg-primary-soft sm:min-h-[560px] lg:min-h-[816px]">
        <div className="absolute -left-[45.22%] top-[64.46%] h-[80.88%] w-[114.78%] rounded-full bg-[#dceaff]" aria-hidden="true" />
        <div className="absolute left-[76.52%] -top-[22.06%] aspect-square w-[57.39%] rounded-full bg-[#e9e4ff]" aria-hidden="true" />
        <div className="absolute left-[64.17%] top-[43.5%] aspect-square w-[20.17%] rounded-full border-[clamp(16px,1.8vw,26px)] border-[#ffe176]" aria-hidden="true" />
        <div className="absolute -left-[20.44%] top-[46.27%] flex h-[53.16%] w-[120.19%] items-center justify-center" aria-hidden="true"><div className="h-[54.17%] w-[94.05%] -rotate-19 rounded-[50%] border border-white" /></div>
        <div className="absolute left-[6.96%] top-[61.4%] h-[33.7%] w-[83.48%] drop-shadow-[0px_20px_24px_rgba(166,192,219,0.42)]" aria-hidden="true">
          <div className="absolute left-[12.5%] top-[11.27%] h-[69.09%] w-[45.83%] rounded-full bg-white" />
          <div className="absolute left-[47.92%] top-[23.27%] h-[60%] w-[36.46%] rounded-full bg-white" />
          <div className="absolute left-0 top-[38.18%] h-[52.73%] w-[35.42%] rounded-full bg-white" />
          <div className="absolute left-[1.88%] top-[60.36%] h-[30.55%] w-[85%] rounded-full bg-white" />
        </div>
        <div className="relative z-10 px-6 pt-12 sm:px-12 sm:pt-16 lg:pl-[72px] lg:pt-[114px]">
          <p className="text-sm leading-[17px] font-bold text-[#3157c8]">회원가입</p>
          <h1 id="signup-intro-title" className="mt-[17px] text-[clamp(36px,3.4vw,49px)] leading-[1.22] font-bold tracking-[-0.06em] text-ink">학습 기록을<br /><span className="text-[#3157c8]">시작해 보세요.</span></h1>
          <p className="mt-[22px] text-base leading-[25.6px] text-body lg:whitespace-nowrap">진단과 학습 결과를 한곳에서 확인할 수 있어요.</p>
        </div>
      </section>
      <section aria-labelledby="signup-title" className="min-w-0 px-5 py-14 sm:px-10 lg:pl-[8.9%] lg:pr-[10.75%] lg:pt-[73px]">
        <div className="mx-auto w-full max-w-[695px] lg:mx-0">
          <h2 id="signup-title" className="text-[42px] leading-[50px] font-bold tracking-[-0.05em] text-ink">회원가입</h2>
          <p className="mt-4 text-base leading-[25px] text-body">학습 기록을 저장할 계정을 만드세요.</p>
          <form noValidate onSubmit={handleSubmit} className="mt-[45px]">
            <div className="grid gap-x-[30px] gap-y-[31px] sm:grid-cols-2">
              <Input id="signup-name" label="이름" placeholder="이름을 입력해 주세요" autoComplete="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} onBlur={() => updateField('name', values.name.trim())} error={errors.name} variant="signup" required />
              <Input id="signup-age" label="나이" placeholder="나이를 입력해 주세요" inputMode="numeric" autoComplete="off" value={values.age} onChange={(event) => updateField('age', event.target.value)} error={errors.age} variant="signup" required />
              <Input id="signup-email" label="이메일" type="email" placeholder="이메일을 입력해 주세요" autoComplete="email" value={values.email} onChange={(event) => updateField('email', event.target.value)} error={errors.email} variant="signup" required />
              <Input id="signup-password" label="비밀번호" type="password" placeholder="비밀번호를 설정해 주세요" autoComplete="new-password" value={values.password} onChange={(event) => updateField('password', event.target.value)} error={errors.password} variant="signup" required />
            </div>
            <div className="mt-[42px]">
              <Checkbox id="signup-agreement" label="서비스 이용약관 및 개인정보 처리방침에 동의합니다." variant="circle" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setAgreementError(false); setNotice('') }} aria-invalid={agreementError} aria-describedby={agreementError ? 'signup-agreement-error' : undefined} className="max-lg:min-h-11" />
              {agreementError && <p id="signup-agreement-error" className="mt-1 text-[13px] text-error">서비스 이용약관 및 개인정보 처리방침에 동의해 주세요.</p>}
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full bg-[#3157c8] text-[15px]">계정 만들기</Button>
            {notice && <p role="status" className="mt-4 text-center text-sm text-body">{notice}</p>}
          </form>
          <p className="mt-[26px] text-center text-sm text-body">이미 계정이 있으신가요? <a href="/login" onClick={onLogin} className="ml-3 font-bold text-primary hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary">로그인</a></p>
          {fieldErrors.length > 0 && <InlineAlert title={alertTitle} className="mt-10 min-h-[76px] !border-error !text-[#b83232] [&>p:first-child]:text-[18px] [&>p:first-child]:leading-[22px] [&>p:last-child]:mt-[6px] [&>p:last-child]:text-[15px] [&>p:last-child]:leading-[19px]">{alertDescription}</InlineAlert>}
        </div>
      </section>
    </main>
  </div>
}
