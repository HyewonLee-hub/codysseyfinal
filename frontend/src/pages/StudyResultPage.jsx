import { useEffect, useState } from "react";
import Button from "../components/common/Button.jsx";
import ResultSummary from "../components/domain/ResultSummary.jsx";
import Header from "../components/layout/Header.jsx";
import PageContainer from "../components/layout/PageContainer.jsx";
import {
  getLearningTestReport,
  toLearningTestResultViewModel,
} from "../api/learning.js";
import { useAuth } from "../auth/useAuth.js";
import ReportPdfButton from "../report/ReportPdfButton.jsx";
import { loadReportContext } from "../report/reportContext.js";
import { buildLearningTestDoc } from "../report/reportDocs.js";

const modeLabel = { general: "전체 유형", vocabulary: "어휘", grammar: "문법" };

function getReportErrorMessage(error) {
  if (error.response?.status === 401)
    return "로그인 후 학습 결과를 확인할 수 있습니다.";
  if (error.response?.status === 404) return "학습 결과를 찾을 수 없습니다.";
  if (error.response?.status === 400)
    return "완료된 학습 세션의 결과만 확인할 수 있습니다.";
  return "학습 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
}

export default function StudyResultPage({
  session,
  onHeaderNavigate,
  onStart,
  onRetake,
  onReview,
}) {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(session));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) return undefined;
    let isActive = true;
    getLearningTestReport(session.learningSessionId)
      .then((response) => {
        if (!isActive) return;
        setReport(response);
        setResult(toLearningTestResultViewModel(response));
      })
      .catch((requestError) => {
        if (isActive) setError(getReportErrorMessage(requestError));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [session]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-canvas">
        <Header active="학습" onNavigate={onHeaderNavigate} />
        <PageContainer as="main" className="py-16 sm:py-20">
          <p role="status" className="text-base text-body">
            학습 결과를 불러오는 중입니다.
          </p>
        </PageContainer>
      </div>
    );
  if (!result)
    return (
      <div className="min-h-screen bg-canvas">
        <Header active="학습" onNavigate={onHeaderNavigate} />
        <PageContainer as="main" className="py-16 sm:py-20">
          <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">
            학습 결과가 없습니다.
          </h1>
          <p role="status" className="mt-5 text-base leading-7 text-body">
            {error || "오늘의 문제 20개를 모두 풀면 결과를 확인할 수 있어요."}
          </p>
          <Button onClick={onStart} className="mt-8">
            오늘의 문제 풀기
          </Button>
        </PageContainer>
      </div>
    );

  const sections = [
    {
      id: "study-strength-title",
      label: "잘한 유형",
      color: "text-[#138a69]",
      ...result.strength,
    },
    {
      id: "study-review-title",
      label: "다시 볼 유형",
      color: "text-accent-coral",
      ...result.review,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas">
      <Header active="학습" onNavigate={onHeaderNavigate} />
      <PageContainer as="main" className="pb-16 pt-[58px]">
        <p className="text-[14px] font-bold text-primary">학습 결과</p>
        <h1 className="mt-[13px] text-[clamp(36px,5vw,47px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink">
          오늘의 학습 결과
        </h1>
        <p className="mt-[15px] text-[16px] leading-[25px] text-body">
          정답과 유형별 결과를 확인하세요.
        </p>
        <div className="mt-[43px] grid gap-[58px] lg:grid-cols-[minmax(0,0.412fr)_minmax(0,0.588fr)] xl:grid-cols-[510px_minmax(0,1fr)]">
          <ResultSummary variant="study" result={result} />
          <section
            aria-labelledby="study-types-title"
            className="min-w-0 lg:pt-[10px]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2
                id="study-types-title"
                className="text-[26px] font-bold text-ink"
              >
                유형별 결과
              </h2>
              <p className="text-sm text-body">
                응시한 시험: {modeLabel[result.mode] ?? result.mode}
              </p>
            </div>
            <div className="mt-[18px]">
              {sections.map((item) => (
                <section
                  key={item.id}
                  aria-labelledby={item.id}
                  className="grid gap-3 border-t border-divider py-[23px] sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-0"
                >
                  <p className={`text-[14px] font-bold ${item.color}`}>
                    {item.label}
                  </p>
                  <div className="min-w-0">
                    <h3
                      id={item.id}
                      className="break-words text-[22px] leading-[1.3] font-bold text-ink"
                    >
                      {item.title}
                    </h3>
                    <p className="mt-[11px] break-words text-[16px] leading-[1.5] text-body">
                      {item.description}
                    </p>
                  </div>
                </section>
              ))}
            </div>
            <section className="border-t border-divider py-[23px]">
              <h3 className="text-[18px] font-bold text-ink">오답 함정</h3>
              {result.trapCounts.length ? (
                <ul className="mt-3 space-y-1 text-[15px] text-body">
                  {result.trapCounts.map((trap) => (
                    <li key={trap.trap_id}>
                      {trap.trap_id} · {trap.count}회
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[15px] text-body">
                  기록된 오답 함정이 없습니다.
                </p>
              )}
              <p className="mt-3 text-xs text-muted">
                시작 {result.startedAt}
                {result.completedAt ? ` · 완료 ${result.completedAt}` : ""}
              </p>
            </section>
            <div className="mt-[35px] flex flex-col gap-3 sm:flex-row sm:items-start">
              <Button onClick={onRetake} className="w-full sm:w-[192px]">
                오늘 다시 풀기
              </Button>
              <div>
                <ReportPdfButton
                  className="w-full sm:w-[192px]"
                  buildDoc={async () => {
                    const { recommendations } = await loadReportContext();
                    return buildLearningTestDoc({ report, userName: user?.name, recommendations });
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={onReview}
              className="mt-4 block rounded text-sm font-bold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              취약 유형 반복하기
            </button>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
