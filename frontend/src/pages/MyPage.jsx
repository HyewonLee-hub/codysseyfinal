import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { formatSessionDate } from '../data/sessionReports.js'

const reportColors = {
  diagnosis: 'text-primary',
  study: 'text-[#198c6d]',
  review: 'text-accent-coral',
}

export default function MyPage({ profile, reports, onHeaderNavigate, onOpenReport, onSavedWords, onEditProfile }) {
  const displayName = profile.name ? `${profile.name}님` : '게스트 학습자'
  const recentDate = reports.length ? formatSessionDate(reports[0].createdAt, true) : '—'

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="마이페이지" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[57px]">
      <p className="text-[14px] font-bold text-primary">마이페이지</p>
      <h1 className="mt-[13px] text-[clamp(36px,5vw,47px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink">나의 학습 기록</h1>

      <div className="mt-[55px] grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-[48px]">
        <Card as="section" aria-label="내 학습 현황" className="relative isolate min-h-[526px] overflow-hidden !rounded-[25px] !border-0 !bg-[#e5efff] !p-[31px]">
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-[142px] left-[194px] aspect-square w-[260px] rounded-full bg-[#e4deff]" />
          <div className="relative z-10 flex size-[70px] items-center justify-center rounded-full bg-[#c7d9ff] text-[24px] font-bold text-primary" aria-hidden="true">나</div>
          <h2 className="relative z-10 mt-[23px] break-words text-[26px] leading-[31px] font-bold text-ink">{displayName}</h2>
          <p className="relative z-10 mt-2 text-xs text-body">인증 전 임시 프로필</p>
          <p className="relative z-10 mt-2 text-[15px] leading-6 text-body">내 학습 기록과 보고서를 확인하세요.</p>
          <div className="relative z-10 mt-[39px] grid grid-cols-2 gap-4 border-t border-[#b8cbe6] pt-[22px]">
            <div><p className="text-[13px] text-body">저장한 보고서</p><p className="mt-[11px] text-[29px] leading-[35px] font-bold text-primary">{String(reports.length).padStart(2, '0')}</p></div>
            <div><p className="text-[13px] text-body">최근 학습</p><p className="mt-[11px] text-[29px] leading-[35px] font-bold text-primary">{recentDate}</p></div>
          </div>
          <div className="absolute bottom-[31px] left-[31px] right-[31px] z-10 grid gap-[10px]">
            <Button variant="secondary" onClick={onSavedWords} className="min-h-[48px] w-full !border-primary !bg-[#e7eeff] !px-3 text-primary">저장한 단어 보기 →</Button>
            <Button variant="ghost" onClick={onEditProfile} className="min-h-[52px] w-full !bg-[#e7eeff] !px-3 text-primary">내 정보 수정</Button>
          </div>
        </Card>

        <section aria-labelledby="my-reports-title" className="min-w-0 lg:pt-[6px]">
          <h2 id="my-reports-title" className="text-[26px] leading-[31px] font-bold text-ink">나의 보고서</h2>
          <div className="mt-[21px] border-t-2 border-primary">
            {reports.length ? <ul>
              {reports.map((report) => <li key={report.id} className="grid min-w-0 gap-3 border-b border-[#d7e0e9] py-6 sm:grid-cols-[minmax(0,1fr)_145px_135px] sm:items-center sm:gap-5 sm:py-0 lg:min-h-[134px]">
                <div className="min-w-0"><p className={`text-[13px] font-bold ${reportColors[report.type]}`}>{report.label}</p><h3 className="mt-[13px] break-words text-[22px] leading-[26px] font-bold text-ink">{report.title}</h3></div>
                <time dateTime={report.createdAt} className="text-[15px] text-body">{formatSessionDate(report.createdAt)}</time>
                <button type="button" onClick={() => onOpenReport(report)} aria-label={`${report.title} 보고서 보기`} className="justify-self-start rounded text-[15px] font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:justify-self-end">보고서 보기 →</button>
              </li>)}
            </ul> : <p role="status" className="py-12 text-[16px] text-body">아직 저장된 보고서가 없습니다.</p>}
          </div>
        </section>
      </div>
    </PageContainer>
  </div>
}
