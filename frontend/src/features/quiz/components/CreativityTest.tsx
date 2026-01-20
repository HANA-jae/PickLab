import { useState } from 'react';
import QuizLayout from './QuizLayout';

interface CreativityQuizProps {
  onBack: () => void;
}

export default function CreativityQuiz({ onBack }: CreativityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      question: '새로운 아이디어를 생각해내기를 좋아한다',
      options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
    },
    {
      question: '문제를 다양한 각도에서 본다',
      options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
    },
    {
      question: '예술이나 음악에 관심이 있다',
      options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
    },
    {
      question: '기존 방식을 개선하는 것을 즐긴다',
      options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
    },
    {
      question: '상상력이 풍부하다고 생각한다',
      options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
    },
  ];

  const handleAnswer = (index: number) => {
    setScore((s) => s + (4 - index));
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
    }
  };

  const maxScore = questions.length * 4;
  const isComplete = currentQuestion === questions.length - 1 && answered;

  return (
    <QuizLayout
      onBack={onBack}
      title="창의성 테스트"
      emoji="💡"
      description="당신의 창의적 사고력을 측정합니다"
    >
      {!isComplete ? (
        <div className="space-y-6">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">질문 {currentQuestion + 1}/{questions.length}</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6">
            <p className="text-white text-lg font-semibold mb-6">{questions[currentQuestion].question}</p>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  className={`w-full p-4 rounded-lg font-semibold transition-all text-left ${
                    answered
                      ? 'bg-gray-600 text-gray-400 opacity-50'
                      : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {answered && (
            <button
              onClick={handleNext}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              다음
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-6 text-center">
            <p className="text-yellow-300 text-sm mb-2">창의성 점수</p>
            <p className="text-white text-4xl font-bold">{score}/{maxScore}</p>
            <p className="text-gray-300 text-sm mt-2">
              {score >= maxScore * 0.8
                ? '매우 높은 창의성을 가지고 있습니다!'
                : score >= maxScore * 0.6
                  ? '좋은 창의적 사고력을 가지고 있습니다!'
                  : '창의성을 더 개발할 수 있습니다.'}
            </p>
          </div>

          <button onClick={onBack} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-all">
            돌아가기
          </button>
        </div>
      )}
    </QuizLayout>
  );
}
