import Button from "../common/Button.jsx";
import Card from "../common/Card.jsx";
import reverseWordmark from "../../assets/brand/01_chevron_reverse.svg";

const workflow = [
  {
    step: "STEP 1",
    title: "무료 진단",
    description: "20문항으로 현재 취약 유형을 확인합니다.",
  },
  {
    step: "STEP 2",
    title: "취약 유형 분석",
    description: "정답률, 최근 오답, 반복 함정을 세부유형 기준으로 살펴봅니다.",
  },
  {
    step: "STEP 3",
    title: "맞춤 학습",
    description:
      "취약 subtype 중심으로 같은 유형의 문제를 반복해서 학습합니다.",
  },
  {
    step: "STEP 4",
    title: "해소 확인",
    description: "같은 유형을 2회 연속 정답하면 다음 취약 유형으로 이동합니다.",
  },
];

const highlights = [
  ["108", "문법 유형", "문장을 푸는 규칙을 유형별로 나눴습니다."],
  ["312", "세부유형", "막연한 약점 대신 학습할 지점을 좁힙니다."],
  ["17", "오답 함정", "반복되는 선택 실수의 패턴을 확인합니다."],
  ["2회", "해소 기준", "연속 정답으로 취약 유형의 변화를 확인합니다."],
];

const features = [
  ["취약 유형 추천", "누적 학습 기록을 바탕으로 다음에 풀 유형을 추천합니다."],
  ["Weak learning", "한 문제씩 집중해서 풀며 연속 정답을 쌓습니다."],
  ["오답 복습", "이전에 틀린 문항을 다시 확인합니다."],
  ["AI 해설", "틀린 선택의 이유와 다음에 적용할 규칙을 확인합니다."],
  ["오늘의 단어", "매일 단어를 확인하고 저장해 다시 볼 수 있습니다."],
  ["학습 리포트", "진단과 학습 결과를 한곳에서 확인합니다."],
];

const faqs = [
  [
    "기출 문제를 그대로 사용하나요?",
    "현재 서비스는 자체 문제은행을 기반으로 학습을 제공합니다. TOEIC 기출 문제를 그대로 제공하지 않습니다.",
  ],
  [
    "취약 유형은 어떻게 분석하나요?",
    "문항의 세부유형, 정답률, 최근 오답과 반복된 오답 함정을 함께 보고 추천합니다.",
  ],
  [
    "AI가 문제를 직접 만드나요?",
    "현재는 기존 문제은행 기반으로 학습합니다. AI 신규 문제 생성 기능은 향후 확장 예정입니다.",
  ],
  [
    "진단은 무료인가요?",
    "현재 Beta에서는 무료 진단과 기본 학습, 리포트를 무료로 제공합니다.",
  ],
  [
    "TOEIC 공식 서비스인가요?",
    "아닙니다. TYPEUP은 ETS의 공식 서비스가 아니며, TOEIC은 ETS의 등록 상표입니다.",
  ],
];

function SectionIntro({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="text-[14px] font-bold text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-[clamp(32px,4vw,52px)] leading-[1.18] font-bold tracking-[-0.055em] text-ink">
        {title}
      </h2>
      <p className="mt-5 text-[17px] leading-7 text-body">{description}</p>
    </div>
  );
}

export default function LandingSections({
  onStartDiagnosis,
  onScrollTo,
  onOpenSupport,
}) {
  return (
    <main className="bg-canvas">
      <section
        id="problem"
        className="scroll-mt-6 border-t border-line bg-white py-20 sm:py-28"
      >
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end xl:px-[78px]">
          <SectionIntro
            eyebrow="PROBLEM"
            title={
              <>
                문제를 많이 풀어도,
                <br />왜 <br />
                같은 유형에서 틀릴까요?
              </>
            }
            description="단순 정답률만으로는 다음 학습을 고르기 어렵습니다. 어떤 문법 유형과 함정에서 반복해서 틀리는지 알아야 더 효율적으로 공부할 수 있습니다."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="!rounded-[24px] !border-line !bg-[#f7f9fc] !p-7">
              <p className="text-sm font-bold text-muted">기존 학습</p>
              <ul className="mt-6 space-y-4 text-[16px] leading-6 text-body">
                <li>틀린 문제 다시 풀기</li>
                <li>전체 문법 복습</li>
                <li>어디가 약한지 모름</li>
              </ul>
            </Card>
            <Card className="!rounded-[24px] !border-0 !bg-[#e8f0ff] !p-7">
              <p className="text-sm font-bold text-primary">TYPEUP</p>
              <ul className="mt-6 space-y-4 text-[16px] leading-6 text-ink">
                <li>틀린 유형 분석</li>
                <li>세부유형 단위 취약점 확인</li>
                <li>같은 유형 문제로 집중 연습</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-6 py-20 sm:py-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 xl:px-[78px]">
          <SectionIntro
            eyebrow="HOW TYPEUP WORKS"
            title={
              <>
                진단부터 다음 학습까지, <br /> 한 흐름으로
              </>
            }
            description="현재 기록을 기준으로 학습할 유형을 좁히고, 필요한 문제부터 반복할 수 있도록 구성했습니다."
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item) => (
              <li key={item.step}>
                <Card className="h-full min-h-[218px] !rounded-[24px] !border-line !bg-white !p-7">
                  <p className="text-[13px] font-bold text-primary">
                    {item.step}
                  </p>
                  <h3 className="mt-8 text-[24px] font-bold tracking-[-0.04em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-6 text-body">
                    {item.description}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="report" className="scroll-mt-6 bg-[#eaf2ff] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center xl:px-[78px]">
          <SectionIntro
            eyebrow="REPORT"
            title={
              <>
                정답 수 보다, <br /> 다음에 풀 내용을
              </>
            }
            description="진단과 학습 결과에서 취약 세부유형과 반복 함정을 확인하고 다음 학습으로 바로 이어갈 수 있습니다."
          />
          <Card
            className="!rounded-[28px] !border-0 !bg-white !p-6 shadow-card sm:!p-8"
            aria-label="학습 리포트 미리보기"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-sm font-bold text-primary">학습 리포트</p>
                <p className="mt-1 text-sm text-body">진단 결과 미리보기</p>
              </div>
              <p className="text-[28px] font-bold text-ink">65%</p>
            </div>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[18px] bg-[#f3f7ff] p-5">
                <dt className="text-sm text-body">취약 세부유형</dt>
                <dd className="mt-2 text-[20px] font-bold text-ink">
                  전치사 · 의미 선택
                </dd>
              </div>
              <div className="rounded-[18px] bg-[#fff5e7] p-5">
                <dt className="text-sm text-body">반복 함정</dt>
                <dd className="mt-2 text-[20px] font-bold text-ink">
                  결합 전치사 불일치
                </dd>
              </div>
            </dl>
            <div className="mt-5 rounded-[18px] border border-[#cedcf4] p-5">
              <p className="text-sm text-body">추천 학습</p>
              <p className="mt-2 text-[18px] font-bold text-ink">
                같은 세부유형 문제부터 집중 학습
              </p>
              <Button
                onClick={onStartDiagnosis}
                className="mt-5 w-full sm:w-auto"
              >
                무료 진단 시작
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section id="why-typeup" className="scroll-mt-6 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 xl:px-[78px]">
          <SectionIntro
            centered
            eyebrow="WHY TYPEUP"
            title={
              <>
                약점은 세부적으로, <br />
                학습은 개인 맞춤형으로{" "}
              </>
            }
            description="TYPEUP은 문제 수를 늘리기보다, 반복되는 실수를 학습할 수 있는 단위로 나누는 데 집중합니다."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(([number, label, description]) => (
              <Card
                key={label}
                className="min-h-[208px] !rounded-[24px] !border-line !p-7"
              >
                <p className="text-[42px] leading-none font-bold tracking-[-0.06em] text-primary">
                  {number}
                </p>
                <h3 className="mt-7 text-[19px] font-bold text-ink">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-body">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="learning" className="scroll-mt-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1450px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] xl:px-[78px]">
          <SectionIntro
            eyebrow="LEARNING EXPERIENCE"
            title={
              <>
                지금 바로 <br />
                사용할 수 있는 학습 경험
              </>
            }
            description="진단 이후의 추천, 집중 학습, 오답 복습과 리포트까지 현재 구현된 흐름을 한곳에서 제공합니다."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map(([title, description], index) => (
              <Card
                key={title}
                className={`min-h-[170px] !rounded-[24px] !border-0 !p-6 ${index % 3 === 0 ? "!bg-[#e8f0ff]" : index % 3 === 1 ? "!bg-[#edf7f0]" : "!bg-[#fff3e3]"}`}
              >
                <span className="text-sm font-bold text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-5 text-[19px] font-bold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-body">
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-6 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 xl:px-[78px]">
          <SectionIntro
            centered
            eyebrow="PLANS"
            title="지금은 필요한 학습부터, 무료로"
            description="결제 기능은 아직 제공하지 않습니다. 가격은 정식 출시 시 공개할 예정입니다."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            <Card className="!rounded-[28px] !border-0 !bg-[#e8f0ff] !p-8">
              <p className="text-sm font-bold text-primary">BETA</p>
              <h3 className="mt-5 text-[32px] font-bold text-ink">
                현재 무료 제공
              </h3>
              <ul className="mt-7 space-y-3 text-[16px] text-body">
                <li>무료 진단</li>
                <li>기본 학습</li>
                <li>학습 리포트</li>
              </ul>
            </Card>
            <Card className="!rounded-[28px] !border-line !p-8">
              <p className="text-sm font-bold text-muted">PREMIUM</p>
              <h3 className="mt-5 text-[32px] font-bold text-ink">
                Coming Soon
              </h3>
              <ul className="mt-7 space-y-3 text-[16px] text-body">
                <li>개인 맞춤 신규 문제 생성</li>
                <li>확장 학습 기능</li>
                <li>상세 리포트</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-6 py-20 sm:py-28">
        <div className="mx-auto max-w-[900px] px-5 sm:px-8">
          <SectionIntro
            centered
            eyebrow="FAQ"
            title="TYPEUP을 시작하기 전에"
            description="현재 제공하는 기능과 앞으로 확장될 기능을 정확하게 안내합니다."
          />
          <div className="mt-12 divide-y divide-line border-y border-line">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-bold text-ink marker:content-none">
                  {question}
                  <span
                    aria-hidden="true"
                    className="text-primary transition-transform group-open:rotate-45"
                  >
                    ＋
                  </span>
                </summary>
                <p className="max-w-3xl pt-4 text-[16px] leading-7 text-body">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e8f0ff] py-20 sm:py-28">
        <div className="mx-auto max-w-[900px] px-5 text-center sm:px-8">
          <p className="text-sm font-bold text-primary">
            START WITH YOUR WEAKNESS
          </p>
          <h2 className="mt-5 text-[clamp(34px,5vw,56px)] leading-[1.18] font-bold tracking-[-0.06em] text-ink">
            지금 내 취약 유형부터
            <br />
            확인해 보세요!
          </h2>
          <p className="mt-5 text-[17px] leading-7 text-body">
            20문항의 무료 진단으로 다음 학습의 출발점을 찾아보세요.
          </p>
          <Button
            onClick={onStartDiagnosis}
            size="lg"
            className="mt-8 w-full sm:w-auto"
          >
            무료 진단 시작
          </Button>
        </div>
      </section>

      <footer className="bg-[#20232a] py-12 text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-9 px-5 sm:px-8 xl:px-[78px]">
          <img
            src={reverseWordmark}
            width="766"
            height="288"
            alt="TYPEUP"
            className="h-auto w-[126px]"
          />
          <nav
            aria-label="푸터 메뉴"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#d6dbe6]"
          >
            <button
              type="button"
              onClick={() => onScrollTo("problem")}
              className="hover:text-white"
            >
              서비스 소개
            </button>
            <button
              type="button"
              onClick={onStartDiagnosis}
              className="hover:text-white"
            >
              무료 진단
            </button>
            <button
              type="button"
              onClick={() => onScrollTo("faq")}
              className="hover:text-white"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={onOpenSupport}
              className="hover:text-white"
            >
              고객센터
            </button>
          </nav>
          <div className="border-t border-white/15 pt-6 text-xs leading-6 text-[#aeb8c9]">
            <p>TOEIC is a registered trademark of ETS.</p>
            <p>TYPEUP은 ETS의 공식 서비스가 아닙니다.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
