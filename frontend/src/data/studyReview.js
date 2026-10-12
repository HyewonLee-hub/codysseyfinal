import { studyQuestionsByType } from './studyQuestions.js'

// 반복 학습은 기존 Mock 문제 중 유형이 명시된 문항만 사용합니다.
export const reviewTypes = [
  {
    id: 'vocabulary',
    examId: 'vocabulary',
    categoryPrefix: '어휘 ·',
    label: '01 · 어휘',
    title: '어휘 문맥',
    description: '문장에서 알맞은 단어를 고르는 연습',
    tone: 'blue',
  },
  {
    id: 'grammar',
    examId: 'grammar',
    categoryPrefix: 'Part 5 ·',
    label: '02 · 문법',
    title: 'Part 5 문법',
    description: '빈칸에 들어갈 문법 형태를 고르는 연습',
    tone: 'coral',
  },
]

export function getReviewType(typeId) {
  return reviewTypes.find((type) => type.id === typeId) ?? null
}

export function getReviewQuestions(typeId) {
  const type = getReviewType(typeId)
  return type ? studyQuestionsByType[type.examId].filter((question) => question.category.startsWith(type.categoryPrefix)) : []
}

export function createReviewRecord(typeId, answers, completedAt = new Date().toISOString()) {
  const type = getReviewType(typeId)
  const questions = getReviewQuestions(typeId)
  if (!type || !questions.length || !answers || Object.keys(answers).length !== questions.length || questions.some((question) => !question.options.some((option) => option.value === answers[question.id]))) return null

  const correct = questions.filter((question) => answers[question.id] === question.answer).length
  return {
    typeId,
    typeTitle: type.title,
    completedAt,
    total: questions.length,
    correct,
    accuracy: Math.round(correct / questions.length * 100),
  }
}
