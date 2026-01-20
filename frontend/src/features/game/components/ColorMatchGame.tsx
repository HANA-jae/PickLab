import { useState } from 'react';
import GameLayout from './GameLayout';

interface ColorMatchGameProps {
  onBack: () => void;
}

export default function ColorMatchGame({ onBack }: ColorMatchGameProps) {
  const colors = ['빨강', '파랑', '녹색', '노랑', '보라', '주황'];
  const colorMap: Record<string, string> = {
    빨강: 'bg-red-500',
    파랑: 'bg-blue-500',
    녹색: 'bg-green-500',
    노랑: 'bg-yellow-500',
    보라: 'bg-purple-500',
    주황: 'bg-orange-500',
  };

  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState({
    text: colors[0],
    color: colors[Math.floor(Math.random() * colors.length)],
  });
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (color: string) => {
    const correct = color === current.color;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setAnswered(true);
  };

  const nextQuestion = () => {
    setCurrent({
      text: colors[Math.floor(Math.random() * colors.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    setAnswered(false);
    setIsCorrect(null);
  };

  return (
    <GameLayout
      title="색깔 맞추기"
      emoji="🎨"
      description="텍스트와 일치하는 색을 클릭하세요"
      onBack={onBack}
    >
      <div className="mb-8">
        <p className="text-gray-300 text-sm mb-2">점수: {score}</p>
        <div
          className={`${colorMap[current.color]} w-full h-32 rounded-lg flex items-center justify-center mb-6`}
        >
          <p className="text-3xl font-bold text-white">{current.text}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleAnswer(color)}
              disabled={answered}
              className={`p-4 rounded-lg font-bold text-white transition-all ${colorMap[color]} ${
                answered ? 'opacity-50' : 'hover:opacity-80'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {answered && (
        <div
          className={`text-center p-4 rounded-lg mb-4 ${
            isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}
        >
          {isCorrect ? '정답입니다!' : '틀렸습니다!'}
        </div>
      )}

      {answered && (
        <button
          onClick={nextQuestion}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
        >
          다음
        </button>
      )}
    </GameLayout>
  );
}
