import { useState } from 'react';
import TestLayout from './TestLayout';

interface KnowledgeTestProps {
  onBack: () => void;
}

export default function KnowledgeTest({ onBack }: KnowledgeTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      question: '지구의 가장 높은 산은?',
      options: ['에베레스트', '킬리만자로', '덴알리', '몽블랑'],
      correct: 0,
    },
    {
      question: '물의 화학식은?',
      options: ['O2', 'H2O', 'CO2', 'H2O2'],
      correct: 1,
    },
    {
      question: '빛의 속도는 약 몇 m/s인가?',
      options: ['3천', '3만', '30만', '300만'],
      correct: 2,
    },
    {
      question: '대한민국의 수도는?',
      options: ['부산', '서울', '대구', '인천'],
      correct: 1,
    },
    {
      question: '인간의 몸에 있는 뼈의 개수는?',
      options: ['186개', '206개', '226개', '246개'],
      correct: 1,
    },
  ];

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1);
    }
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
  };

  const isTestComplete = currentQuestion === questions.length - 1 && answered;

  return (
    <TestLayout
      onBack={onBack}
      title="지식 퀴즈"
      emoji="📚"
      description="다양한 분야의 지식을 테스트해보세요"
    >
      {!isTestComplete ? (
        <div className="space-y-6">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">문제 {currentQuestion + 1}/{questions.length}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6">
            <p className="text-white text-lg font-semibold mb-6">{questions[currentQuestion].question}</p>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  className={`w-full p-4 rounded-lg font-semibold transition-all text-left ${
                    answered
                      ? idx === questions[currentQuestion].correct
                        ? 'bg-green-500/30 border border-green-400/50 text-green-300'
                        : 'bg-gray-600 text-gray-400 opacity-50'
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              다음 문제
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-6 text-center">
            <p className="text-green-300 text-sm mb-2">테스트 완료!</p>
            <p className="text-white text-5xl font-bold mb-4">
              {score}/{questions.length}
            </p>
            <p className="text-green-300 text-lg">
              {((score / questions.length) * 100).toFixed(0)}% 정답
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            다시 풀기
          </button>
        </div>
      )}
    </TestLayout>
  );
}
