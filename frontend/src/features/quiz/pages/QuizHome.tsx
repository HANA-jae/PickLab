import { useState } from 'react';
import {
  PersonalityQuiz,
  KnowledgeQuiz,
  ColorEmotionQuiz,
  IQQuiz,
  StressQuiz,
  CreativityQuiz,
  BrainTypeQuiz,
} from '../components';

type QuizType = 'personality' | 'knowledge' | 'color-emotion' | 'iq' | 'stress' | 'creativity' | 'brain-type' | null;

interface QuizInfo {
  id: QuizType;
  name: string;
  description: string;
  emoji: string;
}

const quizzes: QuizInfo[] = [
  {
    id: 'personality',
    name: '성격 유형 테스트',
    description: '당신의 성격 유형을 알아보세요',
    emoji: '🧠',
  },
  {
    id: 'knowledge',
    name: '지식 퀴즈',
    description: '다양한 분야의 지식을 테스트해보세요',
    emoji: '📚',
  },
  {
    id: 'color-emotion',
    name: '색상 감정 테스트',
    description: '색상 선택으로 당신의 감정을 알아보세요',
    emoji: '🎨',
  },
  {
    id: 'iq',
    name: 'IQ 테스트',
    description: '논리력과 문제 해결 능력을 테스트해보세요',
    emoji: '🧪',
  },
  {
    id: 'stress',
    name: '스트레스 지수 테스트',
    description: '당신의 현재 스트레스 수준을 파악하세요',
    emoji: '😰',
  },
  {
    id: 'creativity',
    name: '창의성 테스트',
    description: '당신의 창의적 사고력을 측정하세요',
    emoji: '💡',
  },
  {
    id: 'brain-type',
    name: '뇌 유형 테스트',
    description: '왼쪽/오른쪽 뇌 성향을 알아보세요',
    emoji: '🧬',
  },
];

export default function QuizHome() {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType>(null);

  if (selectedQuiz === 'personality') {
    return <PersonalityQuiz onBack={() => setSelectedQuiz(null)} />;
  }

  if (selectedQuiz === 'knowledge') {
    return <KnowledgeQuiz onBack={() => setSelectedQuiz(null)} />;
  }

  if (selectedQuiz === 'color-emotion') {
    return <ColorEmotionQuiz onBack={() => setSelectedQuiz(null)} />;
  }

  if (selectedQuiz === 'iq') {
    return <IQQuiz onBack={() => setSelectedQuiz(null)} />;
  }

  if (selectedQuiz === 'stress') {
    return <StressQuiz onBack={() => setSelectedQuiz(null)} />;
  }

  if (selectedQuiz === 'creativity') {
    return <CreativityQuiz onBack={() => setSelectedQuiz(null)} />;
  }

  if (selectedQuiz === 'brain-type') {
    return <BrainTypeQuiz onBack={() => setSelectedQuiz(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-8">📝 퀴즈</h1>
        <p className="text-gray-300 mb-12">지식을 테스트하고 자신을 알아보세요</p>

        {/* 퀴즈 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz.id)}
              className="group bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md hover:bg-gray-700 border border-gray-600/50 hover:border-purple-400 rounded-xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 hover:ring-2 hover:ring-purple-400/50 text-left cursor-pointer"
            >
              <div className="text-4xl mb-4 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:scale-110 transition-all duration-500">{quiz.emoji}</div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-all duration-300">
                {quiz.name}
              </h2>
              <p className="text-gray-300 group-hover:text-gray-200 mt-2 transition-colors duration-300">{quiz.description}</p>
              <div className="mt-4 text-purple-400 group-hover:translate-x-2 transition-all duration-300 font-semibold">
                시작하기 →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
