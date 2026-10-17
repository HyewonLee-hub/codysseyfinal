import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Header from '../components/layout/Header.jsx'
import { getMe, login } from '../api/auth.js'
import { useAuth } from '../auth/useAuth.js'
import background from '../assets/login/background.svg'
import cloudLarge from '../assets/login/cloud-large.svg'
import cloudSmall from '../assets/login/cloud-small.svg'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage({ onSignUp, onHeaderNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setSession, clearSession } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = {}
    if (!email.trim()) nextErrors.email = '이메일을 입력해 주세요.'
    else if (!emailPattern.test(email.trim())) nextErrors.email = '올바른 이메일 형식으로 입력해 주세요.'
    if (!password) nextErrors.password = '비밀번호를 입력해 주세요.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setNotice('')
      return
    }

    setIsSubmitting(true)
    setNotice('')

    try {
      const session = await login({ email: email.trim(), password })
      setSession(session)
      const user = await getMe()
      setSession({ ...user, access_token: session.access_token })
      onLoginSuccess?.()
    } catch (error) {
      clearSession()
      setNotice(error.response?.status === 401
        ? '이메일 또는 비밀번호를 확인해주세요.'
        : '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function updateField(field, value) {
    if (field === 'email') setEmail(value)
    else setPassword(value)
    setErrors((current) => ({ ...current, [field]: undefined }))
    setNotice('')
  }

  return <div className="min-h-screen bg-canvas">
    <Header onNavigate={onHeaderNavigate} className="[&>div]:min-h-[87px] [&_nav]:gap-x-3 sm:[&_nav]:gap-x-8 lg:[&_nav]:gap-x-[52px]" />
    <main className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-[1440px] lg:grid-cols-[minmax(0,740fr)_minmax(0,700fr)]">
      <section aria-labelledby="login-intro-title" className="relative min-h-[440px] overflow-hidden lg:min-h-[812px]">
        <img src={background} alt="" className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="absolute left-[62%] top-[9%] aspect-square w-[21.35%] rounded-full border-[clamp(16px,1.875vw,27px)] border-[#ffda79]" aria-hidden="true" />
        <div className="absolute -left-[50.03%] top-[30.71%] flex h-[84.39%] w-[141.95%] items-center justify-center" aria-hidden="true"><div className="h-[61.29%] w-[92.34%] -rotate-17 rounded-[50%] border-[1.5px] border-white" /></div>
        <div className="absolute -left-[50.03%] top-[27.62%] flex h-[84.39%] w-[141.95%] items-center justify-center" aria-hidden="true"><div className="h-[61.29%] w-[92.34%] -rotate-17 rounded-[50%] border-[1.5px] border-white" /></div>
        <div className="relative z-10 px-6 pt-14 sm:px-12 sm:pt-20 lg:pl-[11.76%] lg:pt-[145px] xl:pr-0">
          <h1 id="login-intro-title" className="text-[clamp(36px,4vw,56px)] leading-[1.15] font-bold tracking-[-0.06em] text-[#202630]">
            오늘의 공부,<br /><span className="text-[#3158c5]">여기서 이어가요.</span>
          </h1>
          <p className="mt-7 text-[16px] leading-[1.65] text-[#4f627b] sm:text-[18px]">저장한 단어와 학습 기록을 확인하세요.</p>
        </div>
        <img src={cloudLarge} alt="" aria-hidden="true" className="absolute left-[2.97%] top-[59.73%] w-[74.86%]" />
        <img src={cloudSmall} alt="" aria-hidden="true" className="absolute left-[57.03%] top-[52.38%] w-[41.62%]" />
      </section>
      <section aria-labelledby="login-title" className="min-w-0 px-5 py-16 sm:px-10 lg:pl-[14.29%] lg:pr-[8%] lg:pt-[104px]">
        <div className="mx-auto w-full max-w-[478px] lg:mx-0">
          <h2 id="login-title" className="text-[40px] leading-[46px] font-bold text-[#202630]">로그인</h2>
          <p className="mt-[14px] text-base leading-[18px] text-[#6e7d91]">이메일로 로그인해 학습을 이어가세요.</p>
          <form noValidate onSubmit={handleSubmit} className="mt-[52px]">
            <Input id="login-email" label="이메일" type="email" autoComplete="email" placeholder="이메일을 입력해 주세요" value={email} onChange={(event) => updateField('email', event.target.value)} error={errors.email} variant="underline" required showRequiredIndicator={false} disabled={isSubmitting} />
            <Input id="login-password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요" value={password} onChange={(event) => updateField('password', event.target.value)} error={errors.password} variant="underline" required showRequiredIndicator={false} className="mt-[37px]" disabled={isSubmitting} />
            <Button type="submit" size="lg" className="mt-[49px] w-full bg-[#3157c9]" disabled={isSubmitting}>{isSubmitting ? '로그인 중...' : '로그인'}</Button>
            {notice && <p role="status" className="mt-4 text-center text-sm text-body">{notice}</p>}
          </form>
          <p className="mt-[31px] text-center text-sm text-[#728198]">아직 계정이 없으신가요? <a href="/signup" onClick={onSignUp} className="ml-3 font-bold text-primary hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary">회원가입</a></p>
        </div>
      </section>
    </main>
  </div>
}
