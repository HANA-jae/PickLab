import { useState } from 'react';
import {
  PersonalityTest,
  KnowledgeTest,
  ColorEmotionTest,
  IQTest,
  StressTest,
  CreativityTest,
  BrainTypeTest,
} from '../components';

type TestType = 'personality' | 'knowledge' | 'color-emotion' | 'iq' | 'stress' | 'creativity' | 'brain-type' | null;

interface TestInfo {
  id: TestType;
  name: string;
  description: string;
  emoji: string;
}

const tests: TestInfo[] = [
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

export default function TestHome() {
  const [selectedTest, setSelectedTest] = useState<TestType>(null);

  if (selectedTest === 'personality') {
    return <PersonalityTest onBack={() => setSelectedTest(null)} />;
  }

  if (selectedTest === 'knowledge') {
    return <KnowledgeTest onBack={() => setSelectedTest(null)} />;
  }

  if (selectedTest === 'color-emotion') {
    return <ColorEmotionTest onBack={() => setSelectedTest(null)} />;
  }

  if (selectedTest === 'iq') {
    return <IQTest onBack={() => setSelectedTest(null)} />;
  }

  if (selectedTest === 'stress') {
    return <StressTest onBack={() => setSelectedTest(null)} />;
  }

  if (selectedTest === 'creativity') {
    return <CreativityTest onBack={() => setSelectedTest(null)} />;
  }

  if (selectedTest === 'brain-type') {
    return <BrainTypeTest onBack={() => setSelectedTest(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-8">📝 테스트</h1>
        <p className="text-gray-300 mb-12">지식을 테스트하고 자신을 알아보세요</p>

        {/* 테스트 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => (
            <button
              key={test.id}
              onClick={() => setSelectedTest(test.id)}
              className="group bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md hover:bg-gray-700 border border-gray-600/50 hover:border-purple-400 rounded-xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 hover:ring-2 hover:ring-purple-400/50 text-left cursor-pointer"
            >
              <div className="text-4xl mb-4 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:scale-110 transition-all duration-500">{test.emoji}</div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-all duration-300">
                {test.name}
              </h2>
              <p className="text-gray-300 group-hover:text-gray-200 mt-2 transition-colors duration-300">{test.description}</p>
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
