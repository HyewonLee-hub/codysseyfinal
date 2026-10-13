import { useEffect, useState } from 'react'
import profileCircle from '../assets/mypage/profile-circle.svg'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { useAuth } from '../auth/useAuth.js'
import { getMyProfile, updateMyProfile } from '../api/mypage.js'

function validateProfile(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = '이름을 입력해 주세요.'
  const age = values.age.trim()
  if (!age) errors.age = '나이를 입력해 주세요.'
  else if (!/^\d+$/.test(age) || Number(age) < 1) errors.age = '나이는 양의 정수로 입력해 주세요.'
  return errors
}

function getErrorMessage(error) {
  if (error.response?.status === 422) return '입력값을 확인해 주세요.'
  if (error.response?.status === 401) return '로그인 후 프로필을 확인할 수 있습니다.'
  return '프로필을 불러오거나 수정하지 못했습니다.'
}

export default function ProfilePage({ onCancel, onHeaderNavigate, onBack }) {
  const { updateCurrentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [values, setValues] = useState({ name: '', age: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let isActive = true
    getMyProfile()
      .then((nextProfile) => { if (isActive) { setProfile(nextProfile); setValues({ name: nextProfile.name, age: String(nextProfile.age) }) } })
      .catch((requestError) => { if (isActive) setLoadError(getErrorMessage(requestError)) })
      .finally(() => { if (isActive) setIsLoading(false) })
    return () => { isActive = false }
  }, [])

  function updateField(field, value) {
    const next = { ...values, [field]: value }
    setValues(next)
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateProfile(next)[field] }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateProfile(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || isSaving) return
    setIsSaving(true)
    setLoadError('')
    try {
      const updatedProfile = await updateMyProfile({ name: values.name.trim(), age: Number(values.age) })
      setProfile(updatedProfile)
      setValues({ name: updatedProfile.name, age: String(updatedProfile.age) })
      updateCurrentUser(updatedProfile)
    } catch (requestError) {
      setLoadError(getErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="min-h-screen bg-canvas"><Header active="마이페이지" onNavigate={onHeaderNavigate} /><PageContainer as="main" className="py-16 sm:py-20"><p role="status" className="text-base text-body">프로필을 불러오는 중입니다.</p></PageContainer></div>
  if (!profile) return <div className="min-h-screen bg-canvas"><Header active="마이페이지" onNavigate={onHeaderNavigate} /><PageContainer as="main" className="py-16 sm:py-20"><h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">프로필을 불러오지 못했습니다.</h1><p role="alert" className="mt-5 text-base leading-7 text-error">{loadError}</p><Button onClick={onBack} className="mt-8">마이페이지로 돌아가기</Button></PageContainer></div>

  return <div className="min-h-screen overflow-x-hidden bg-canvas"><Header active="마이페이지" onNavigate={onHeaderNavigate} /><PageContainer as="main" className="pb-16 pt-[44px]"><button type="button" onClick={onBack} className="rounded text-[16px] font-medium text-[#4169e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">마이페이지</button><span className="text-[16px] text-[#4169e1]"> / 내 정보</span><h1 className="mt-[21px] text-[clamp(38px,5vw,54px)] leading-[1.2] font-bold tracking-[-0.05em] text-ink">내 정보</h1><p className="mt-1 text-[20px] leading-7 text-[#667184]">이름과 나이를 확인하고 수정할 수 있습니다.</p><div className="mt-[40px] grid min-h-[500px] overflow-hidden rounded-[24px] bg-white lg:grid-cols-[360px_minmax(0,1fr)]"><aside className="relative min-h-[300px] bg-[#eef3ff] px-8 py-10 sm:px-[54px] sm:pt-[60px] lg:min-h-[500px]"><div className="relative size-[86px]"><img src={profileCircle} width="86" height="86" alt="" className="block" /><span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[30px] font-bold text-white">나</span></div><h2 className="mt-[20px] break-words text-[27px] leading-[1.3] font-bold text-ink">{profile.name}님의 프로필</h2><p className="mt-3 text-[17px] leading-6 text-muted">서버에 저장된 프로필 정보입니다.</p><p className="mt-12 text-[17px] font-medium text-[#4169e1] lg:absolute lg:bottom-[48px] lg:mt-0">내 정보 수정</p></aside><form noValidate onSubmit={handleSubmit} className="flex min-w-0 flex-col px-6 py-10 sm:px-10 lg:px-[60px] lg:pb-[47px] lg:pt-[57px]"><div className="grid gap-5 sm:grid-cols-2"><Input id="profile-name" label="이름" required showRequiredIndicator={false} placeholder="이름을 입력해 주세요" autoComplete="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} error={errors.name} className="[&_label]:!text-[17px] [&_label]:!text-[#313847]" inputClassName="!h-[62px] !rounded-[12px] !text-[17px]" /><Input id="profile-age" label="나이" required showRequiredIndicator={false} placeholder="나이를 입력해 주세요" inputMode="numeric" autoComplete="off" value={values.age} onChange={(event) => updateField('age', event.target.value)} error={errors.age} className="[&_label]:!text-[17px] [&_label]:!text-[#313847]" inputClassName="!h-[62px] !rounded-[12px] !text-[17px]" /></div><div className="mt-[32px]"><Input id="profile-email" label="가입 이메일" value={profile.email} disabled className="[&_label]:!text-[17px] [&_label]:!text-[#313847]" inputClassName="!h-[62px] !rounded-[12px] !text-[17px]" /></div>{loadError && <p role="alert" className="mt-4 text-[15px] text-error">{loadError}</p>}<p className="mt-[17px] text-[15px] text-[#d05e60]">* 이름과 나이는 필수 입력 항목입니다.</p><div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:justify-end lg:pt-0"><Button variant="secondary" onClick={onCancel} disabled={isSaving} className="w-full !border-[#b4c0cf] text-[18px] sm:w-[160px]">취소</Button><Button type="submit" disabled={isSaving} className="w-full !bg-[#4169e1] text-[18px] hover:!bg-primary-hover sm:w-[226px]">{isSaving ? '저장 중...' : '변경사항 저장'}</Button></div></form></div></PageContainer></div>
}
