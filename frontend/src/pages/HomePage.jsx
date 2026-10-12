import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import largeCloud from '../assets/home/cloud-large.svg'
import smallCloud from '../assets/home/cloud-small.svg'

const learningSteps = [
  { number: '01 진단', title: '현재 실력 확인', description: '20문제로 강점과 취약 유형을 알아봅니다.', path: '/diagnosis', border: 'border-[#bcd4e9]', label: 'text-primary' },
  { number: '02 단어', title: '오늘의 단어', description: '30개 단어를 확인하고 저장합니다.', path: '/words', border: 'border-[#9ed8c2]', label: 'text-success' },
  { number: '03 학습', title: '문제 풀기', description: '선택한 유형의 문제를 풉니다.', path: '/study', border: 'border-[#f2a58f]', label: 'text-[#ce6550]' },
]

export default function HomePage({ onHeaderNavigate, onNavigate, onLogin }) {
  return <div className="min-h-screen overflow-x-hidden bg-[#e9f6ff]">
    <div className="relative isolate mx-auto min-h-screen max-w-[1440px] overflow-hidden xl:min-h-[900px]">
      <div className="relative z-20 px-5 pt-4 sm:px-8 xl:px-[50px] xl:pt-[22px]">
        <Header home onNavigate={onHeaderNavigate} action={<Button size="sm" onClick={onLogin} className="!min-h-[40px] !px-[28px] !text-[14px] !font-normal">시작하기</Button>} />
      </div>

      <main>
        <section aria-labelledby="home-title" className="relative z-10 px-5 pt-16 sm:px-8 xl:px-[78px] xl:pt-[82px]">
          <div className="max-w-[700px]">
            <p className="text-[14px] leading-[17px] font-bold text-primary">오늘의 학습</p>
            <h1 id="home-title" className="text-[clamp(36px,4.583vw,66px)] leading-[1.16] font-bold tracking-[-0.06em] break-keep text-ink">오늘은 문제는 줄이고,<br />아는 단어는 늘리고.</h1>
            <p className="mt-[28px] text-[18px] leading-[22px] text-body">진단 결과에 맞춰 필요한 부분을 공부하세요.</p>
            <Button onClick={() => onHeaderNavigate?.('무료진단')} className="mt-[32px] min-h-[52px] !px-8 !text-[15px]">무료진단 시작하기</Button>
          </div>
        </section>

        <div aria-hidden="true" className="pointer-events-none relative h-[285px] overflow-hidden sm:h-[340px] xl:absolute xl:inset-0 xl:h-auto">
          <span className="absolute -top-[140px] -right-[210px] h-[440px] w-[500px] rounded-full bg-[#ddf2fb] xl:top-[-202px] xl:right-auto xl:left-[865px] xl:h-[710px] xl:w-[800px]" />
          <span className="absolute top-[135px] -right-[220px] h-[370px] w-[500px] rounded-full bg-[#e8e7ff] xl:top-[458px] xl:right-auto xl:left-[945px] xl:h-[650px] xl:w-[760px]" />
          <span className="absolute top-[12px] right-[12%] aspect-square w-[100px] rounded-full border-[19px] border-[#ffd56b] xl:top-[178px] xl:right-auto xl:left-[1207px] xl:w-[155px] xl:border-[30px]" />
          <img src={largeCloud} alt="" width="470" height="230" className="absolute top-[66px] -right-[55px] w-[min(78vw,470px)] drop-shadow-[7px_24px_18px_rgba(139,164,195,0.2)] xl:top-[298px] xl:right-auto xl:left-[1000px] xl:w-[470px]" />
          <img src={smallCloud} alt="" width="300" height="145" className="absolute top-[148px] left-[6%] w-[min(48vw,300px)] opacity-85 drop-shadow-[7px_24px_18px_rgba(139,164,195,0.2)] xl:top-[463px] xl:left-[787px] xl:w-[300px]" />
        </div>

        <nav aria-label="학습 시작 안내" className="relative z-10 mx-5 grid gap-8 pb-12 sm:mx-8 sm:gap-9 xl:absolute xl:right-[78px] xl:bottom-[58px] xl:left-[78px] xl:mx-0 xl:h-[109px] xl:grid-cols-3 xl:gap-[36px] xl:pb-0">
          {learningSteps.map((step) => <a key={step.path} href={step.path} onClick={(event) => onNavigate?.(event, step.path)} className={`block min-w-0 border-t-[3px] pt-[21px] hover:brightness-90 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${step.border}`}>
            <span className={`text-[13px] font-bold ${step.label}`}>{step.number}</span>
            <h2 className="mt-[16px] text-[22px] leading-[1.2] font-bold text-ink">{step.title}</h2>
            <p className="mt-[8px] text-[15px] leading-[1.45] text-body">{step.description}</p>
          </a>)}
        </nav>
      </main>
    </div>
  </div>
}
