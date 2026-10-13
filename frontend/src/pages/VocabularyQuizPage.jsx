import { useEffect, useState } from "react";
import Button from "../components/common/Button.jsx";
import ProgressBar from "../components/common/ProgressBar.jsx";
import QuestionCard from "../components/domain/QuestionCard.jsx";
import Header from "../components/layout/Header.jsx";
import PageContainer from "../components/layout/PageContainer.jsx";
import {
  getVocabularyQuizItems,
  saveVocabularyQuizResults,
  submitVocabularyQuiz,
  toVocabularyQuizQuestion,
} from "../api/vocabulary.js";

function getErrorMessage(error, action) {
  if (error.response?.status === 401)
    return "로그인 후 단어 테스트를 계속할 수 있습니다.";
  if (error.response?.status === 404)
    return "단어 테스트 세션을 찾을 수 없습니다. 새로 시작해주세요.";
  if (error.response?.status === 400)
    return action === "submit"
      ? "답안을 제출할 수 없습니다. 테스트를 다시 시작해주세요."
      : "현재 단어 테스트를 계속할 수 없습니다. 새로 시작해주세요.";
  return "단어 테스트를 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";
}

export default function VocabularyQuizPage({
  sessionId,
  onHeaderNavigate,
  onComplete,
  onBack,
  onReset,
}) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(Boolean(sessionId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const question = questions[currentIndex];

  useEffect(() => {
    if (!sessionId) return undefined;
    let isActive = true;
    getVocabularyQuizItems(sessionId)
      .then((response) => {
        if (isActive)
          setQuestions(response.items.map(toVocabularyQuizQuestion));
      })
      .catch((requestError) => {
        if (isActive) setError(getErrorMessage(requestError, "items"));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [sessionId]);

  async function handleNext() {
    if (isSubmitting) return;
    if (!selectedAnswer) {
      setError("뜻을 선택한 뒤 다음 문제로 진행해 주세요.");
      return;
    }
    const nextAnswers = { ...answers, [question.id]: selectedAnswer };
    setAnswers(nextAnswers);
    setError("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      setSelectedAnswer(null);
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitVocabularyQuiz({
        session_id: sessionId,
        answers: Object.entries(nextAnswers).map(
          ([wordId, selectedMeaning]) => ({
            word_id: wordId,
            selected_meaning: selectedMeaning,
          }),
        ),
      });
      saveVocabularyQuizResults(result);
      onComplete?.();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "submit"));
      setIsSubmitting(false);
    }
  }

  if (!sessionId)
    return (
      <div className="min-h-screen bg-canvas">
        <Header active="오늘의 단어" onNavigate={onHeaderNavigate} />
        <PageContainer as="main" className="py-16 sm:py-20">
          <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">
            단어 테스트를 시작해보세요.
          </h1>
          <p className="mt-5 text-base leading-7 text-body">
            저장한 단어가 있으면 테스트를 만들 수 있어요.
          </p>
          <Button onClick={onBack} className="mt-8">
            저장한 단어 보기
          </Button>
        </PageContainer>
      </div>
    );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbfcff]">
      <Header active="오늘의 단어" onNavigate={onHeaderNavigate} />
      <main>
        <PageContainer className="pb-10 pt-[24px] lg:!px-[64px]">
          <p className="text-[14px] font-bold text-primary">저장 단어 테스트</p>
          <h1 className="mt-3 text-[clamp(34px,5vw,42px)] leading-[1.2] font-bold tracking-[-0.05em] text-[#20232a]">
            단어 뜻을 골라보세요.
          </h1>
          <p className="mt-[19px] text-[17px] text-[#687284]">
            저장한 단어에서 준비한 문제입니다.
          </p>
        </PageContainer>
        {isLoading && (
          <PageContainer className="pb-12">
            <p role="status" className="text-base text-body">
              단어 문제를 불러오는 중입니다.
            </p>
          </PageContainer>
        )}
        {!isLoading && !question && (
          <PageContainer className="pb-12">
            <p role="alert" className="text-base text-error">
              {error || "단어 문제를 찾을 수 없습니다."}
            </p>
            <Button onClick={onReset} className="mt-5">
              저장한 단어로 돌아가기
            </Button>
          </PageContainer>
        )}
        {!isLoading && question && (
          <section
            aria-label="단어 테스트 문제 풀이"
            className="min-h-[453px] bg-[linear-gradient(115deg,#f9fbff_0%,#eef4ff_55%,#f8faff_100%)]"
          >
            <ProgressBar
              value={currentIndex + 1}
              max={questions.length}
              ariaLabel="단어 테스트 진행률"
              valueText={`${currentIndex + 1} / ${questions.length}문제`}
              trackClassName="!h-[2px] !rounded-none bg-[#e3e9f4]"
              fillClassName="!rounded-none"
            />
            <PageContainer className="pb-8 pt-[34px] lg:!px-[64px]">
              <QuestionCard
                key={question.id}
                variant="study"
                number={currentIndex + 1}
                total={questions.length}
                category={question.category}
                question={question.question}
                options={question.options}
                selected={selectedAnswer}
                onSelect={(value) => {
                  setSelectedAnswer(value);
                  setError("");
                }}
                name={question.id}
                error={error}
              />
              <div className="mt-[31px] flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="w-full sm:w-[218px]"
                >
                  {isSubmitting
                    ? "제출 중..."
                    : currentIndex === questions.length - 1
                      ? "테스트 완료"
                      : "다음 문제"}
                </Button>
              </div>
            </PageContainer>
          </section>
        )}
      </main>
    </div>
  );
}
