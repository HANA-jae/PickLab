import { useState } from 'react';
import QuizLayout from './QuizLayout';

interface ColorEmotionQuizProps {
  onBack: () => void;
}

export default function ColorEmotionQuiz({ onBack }: ColorEmotionQuizProps) {
  const colorEmotions = [
    { color: 'bg-red-500', name: '빨강', emotion: '열정적이고 에너지 있는' },
    { color: 'bg-blue-500', name: '파랑', emotion: '차분하고 신뢰할 수 있는' },
    { color: 'bg-green-500', name: '녹색', emotion: '차분하고 자연스러운' },
    { color: 'bg-yellow-500', name: '노랑', emotion: '밝고 긍정적인' },
    { color: 'bg-purple-500', name: '보라', emotion: '신비롭고 창의적인' },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <QuizLayout
      onBack={onBack}
      title="색상 감정 테스트"
      emoji="🎨"
      description="가장 끌리는 색상을 선택하세요"
    >
      <div className="space-y-3">
        {colorEmotions.map((item) => (
          <button
            key={item.name}
            onClick={() => setSelected(item.name)}
            className={`w-full p-6 rounded-lg transition-all border-2 ${
              selected === item.name ? 'border-white bg-gray-700' : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg ${item.color}`} />
              <div className="text-left">
                <p className="text-white font-bold text-lg">{item.name}</p>
                <p className="text-gray-300">{item.emotion}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 text-center">
          <p className="text-blue-300">당신은 {selected}를 선호하는 사람입니다!</p>
          <p className="text-gray-300 text-sm mt-2">
            {colorEmotions.find((c) => c.name === selected)?.emotion}인 성향을 가지고 있습니다.
          </p>
        </div>
      )}
    </QuizLayout>
  );
}
