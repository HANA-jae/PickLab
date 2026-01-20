import { useState } from 'react';
import TestLayout from './TestLayout';

interface StressTestProps {
  onBack: () => void;
}

export default function StressTest({ onBack }: StressTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const questions = [
    '최근 일주일 동안 피로감을 느낀다',
    '수면에 어려움을 겪고 있다',
    '일에 집중하기 어렵다',
    '불안감이나 초조함을 느낀다',
    '신체 통증이 있다',
  ];

  const handleScore = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getStressLevel = () => {
    const total = scores.reduce((a, b) => a + b, 0);
    const avg = total / scores.length;
    if (avg < 2) return { level: '낮음', color: 'green' };
    if (avg < 3) return { level: '보통', color: 'yellow' };
    if (avg < 4) return { level: '높음', color: 'orange' };
    return { level: '매우 높음', color: 'red' };
  };

  const stressLevel = scores.length === questions.length ? getStressLevel() : null;

  return (
    <TestLayout
      onBack={onBack}
      title="스트레스 지수 테스트"
      emoji="😰"
      description="1(전혀 그렇지 않다) ~ 5(매우 그렇다)로 평가하세요"
    >
      {!stressLevel ? (
        <div className="space-y-6">
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-1">질문 {currentQuestion + 1}/{questions.length}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-6">
            <p className="text-white text-lg font-semibold mb-6">{questions[currentQuestion]}</p>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleScore(score)}
                  className="flex-1 bg-gray-700 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div
            className={`border rounded-lg p-6 text-center ${
              stressLevel.color === 'green'
                ? 'bg-green-500/20 border-green-400/50'
                : stressLevel.color === 'yellow'
                  ? 'bg-yellow-500/20 border-yellow-400/50'
                  : stressLevel.color === 'orange'
                    ? 'bg-orange-500/20 border-orange-400/50'
                    : 'bg-red-500/20 border-red-400/50'
            }`}
          >
            <p className="text-gray-300 text-sm mb-2">스트레스 수준</p>
            <p className="text-white text-4xl font-bold">{stressLevel.level}</p>
            <p className="text-gray-300 text-sm mt-2">휴식과 이완이 필요합니다</p>
          </div>

          <button onClick={onBack} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all">
            돌아가기
          </button>
        </div>
      )}
    </TestLayout>
  );
}
