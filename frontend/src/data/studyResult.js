import { studyExams, studyQuestionsByType } from './studyQuestions.js'

function chooseCategory(stats, kind) {
  const eligible = stats.filter((item) => item.total >= 2 && (kind === 'strength' ? item.accuracy >= 75 : item.accuracy <= 50 && item.incorrect > 0))
  if (!eligible.length) return null
  const target = kind === 'strength' ? Math.max(...eligible.map((item) => item.accuracy)) : Math.min(...eligible.map((item) => item.accuracy))
  const matches = eligible.filter((item) => item.accuracy === target)
  return matches.length === 1 ? matches[0] : null
}

export function calculateStudyResult(examId, answers) {
  const exam = studyExams.find((item) => item.id === examId)
  const questions = studyQuestionsByType[examId]
  if (!exam || !questions || !answers || Object.keys(answers).length !== questions.length || questions.some((question) => !question.options.some((option) => option.value === answers[question.id]))) return null

  const categoryMap = new Map()
  let correct = 0
  for (const question of questions) {
    const isCorrect = answers[question.id] === question.answer
    if (isCorrect) correct += 1
    const stat = categoryMap.get(question.category) ?? { category: question.category, total: 0, correct: 0, incorrect: 0 }
    stat.total += 1
    if (isCorrect) stat.correct += 1
    else stat.incorrect += 1
    categoryMap.set(question.category, stat)
  }

  const categoryStats = [...categoryMap.values()].map((stat) => ({ ...stat, accuracy: Math.round(stat.correct / stat.total * 100) }))
  const incorrect = questions.length - correct
  const strengthCategory = chooseCategory(categoryStats, 'strength')
  const reviewCategory = chooseCategory(categoryStats, 'review')

  return {
    source: 'frontend-mock-questions',
    examId,
    examTitle: exam.title,
    answers: { ...answers },
    total: questions.length,
    correct,
    incorrect,
    accuracy: Math.round(correct / questions.length * 100),
    categoryStats,
    strength: strengthCategory ? {
      title: strengthCategory.category,
      description: `${strengthCategory.total}문제 중 ${strengthCategory.correct}문제를 맞혔습니다. 참고용 유형 결과입니다.`,
    } : {
      title: '판단할 정보가 부족합니다',
      description: '세부 유형별 문항 수가 적거나 정답률이 같아 한 유형을 선정하지 않았습니다.',
    },
    review: reviewCategory ? {
      title: reviewCategory.category,
      description: `${reviewCategory.total}문제 중 ${reviewCategory.incorrect}문제를 틀렸습니다. 해당 문항을 다시 확인하세요.`,
    } : {
      title: incorrect === 0 ? '다시 볼 오답이 없습니다' : '유형별 판단을 보류합니다',
      description: incorrect === 0 ? '이번 시험에서 모든 문제를 맞혔습니다.' : '세부 유형별 문항 수가 적거나 정답률이 같아 한 유형을 선정하지 않았습니다.',
    },
    nextLearning: {
      title: incorrect > 0 ? '오늘의 문제 다시 풀기' : '오늘의 문제 복습',
      description: incorrect > 0 ? `오답 ${incorrect}개를 확인하며 같은 시험을 다시 풀어 보세요.` : '같은 시험을 다시 풀며 학습 내용을 확인해 보세요.',
    },
  }
}
