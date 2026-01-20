import { useState } from 'react';
import TestLayout from './TestLayout';

interface BrainTypeTestProps {
  onBack: () => void;
}

export default function BrainTypeTest({ onBack }: BrainTypeTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const questions = [
    {
      question: '문제를 해결할 때 논리와 분석을 더 선호한다',
      left: true,
    },
    {
      question: '창의적인 표현과 감정 표현을 더 선호한다',
      left: false,
    },
    {
      question: '언어와 숫자를 잘 이해한다',
      left: true,
    },
    {
      question: '그림과 공간감각을 잘 이해한다',
      left: false,
    },
    {
      question: '계획을 세우고 체계적으로 행동한다',
      left: true,
    },
  ];

  const handleAnswer = (isLeft: boolean) => {
    if (isLeft) {
      setLeftScore((s) => s + 1);
    } else {
      setRightScore((s) => s + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const isComplete = currentQuestion === questions.length - 1;
  const brainType = leftScore > rightScore ? '좌뇌' : rightScore > leftScore ? '우뇌' : '균형';

  return (
    <TestLayout
      onBack={onBack}
      title="뇌 유형 테스트"
      emoji="🧬"
      description="당신의 뇌 성향을 알아보세요"
    >
      {!isComplete ? (
        <div className="space-y-6">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">질문 {currentQuestion + 1}/{questions.length}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6">
            <p className="text-white text-lg font-semibold mb-6">{questions[currentQuestion].question}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                맞다
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                아니다
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-6">
            <p className="text-white text-center text-sm mb-2">당신의 뇌 유형은</p>
            <p className="text-white text-4xl font-bold text-center mb-4">{brainType}</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <p className="text-blue-300 text-sm">좌뇌</p>
                <p className="text-white text-2xl font-bold">{leftScore}</p>
              </div>
              <div className="text-center">
                <p className="text-pink-300 text-sm">우뇌</p>
                <p className="text-white text-2xl font-bold">{rightScore}</p>
              </div>
            </div>
          </div>

          <button onClick={onBack} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all">
            돌아가기
          </button>
        </div>
      )}
    </TestLayout>
  );
}
