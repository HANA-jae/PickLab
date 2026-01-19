import { useState } from 'react';

type TestType = 'personality' | 'knowledge' | null;

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
];

export default function TestHome() {
  const [selectedTest, setSelectedTest] = useState<TestType>(null);

  if (selectedTest === 'personality') {
    return <PersonalityTest onBack={() => setSelectedTest(null)} />;
  }

  if (selectedTest === 'knowledge') {
    return <KnowledgeTest onBack={() => setSelectedTest(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📝 테스트</h1>
        <p className="text-gray-300 mb-12">지식을 테스트하고 자신을 알아보세요</p>

        {/* 테스트 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => (
            <button
              key={test.id}
              onClick={() => setSelectedTest(test.id)}
              className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-400 rounded-lg p-6 transition-all duration-300 text-left cursor-pointer"
            >
              <div className="text-4xl mb-4">{test.emoji}</div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                {test.name}
              </h2>
              <p className="text-gray-400 mt-2">{test.description}</p>
              <div className="mt-4 text-purple-400 group-hover:translate-x-1 transition-transform">
                시작하기 →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 성격 유형 테스트
function PersonalityTest({ onBack }: { onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  const [completed, setCompleted] = useState(false);

  const questions = [
    { text: '당신은 사람들과 함께 있을 때 에너지를 얻는다', E: 1, I: 0 },
    { text: '당신은 혼자 있을 때 에너지를 얻는다', E: 0, I: 1 },
    { text: '당신은 세부사항에 집중한다', S: 1, N: 0 },
    { text: '당신은 큰 그림을 본다', S: 0, N: 1 },
    { text: '당신은 논리적으로 결정을 내린다', T: 1, F: 0 },
    { text: '당신은 감정을 고려해 결정을 내린다', T: 0, F: 1 },
    { text: '당신은 계획을 좋아한다', J: 1, P: 0 },
    { text: '당신은 즉흥적이다', J: 0, P: 1 },
  ];

  const handleAnswer = (answerKey: keyof typeof scores, value: number) => {
    setScores((prev) => ({
      ...prev,
      [answerKey]: prev[answerKey] + value,
    }));

    if (currentQuestion + 1 >= questions.length) {
      setCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getPersonalityType = () => {
    let type = '';
    type += scores.E >= scores.I ? 'E' : 'I';
    type += scores.S >= scores.N ? 'S' : 'N';
    type += scores.T >= scores.F ? 'T' : 'F';
    type += scores.J >= scores.P ? 'J' : 'P';
    return type;
  };

  const personalityDescriptions: Record<string, string> = {
    ISTJ: '논리적이고 책임감 있는 현실주의자',
    ISFJ: '따뜻하고 신뢰할 수 있는 후원자',
    INFJ: '통찰력 있는 이상주의자',
    INTJ: '독립적이고 전략적인 개혁가',
    ISTP: '실리적이고 유연한 장인',
    ISFP: '예술적이고 겸손한 중재자',
    INFP: '상상력이 풍부한 몽상가',
    INTP: '논리적이고 호기심 많은 철학자',
    ESTP: '모험심 있는 사업가',
    ESFP: '활발하고 즉흥적인 연예인',
    ENFP: '창의적이고 열정적인 활동가',
    ENTP: '지능적이고 논쟁을 즐기는 변론가',
    ESTJ: '효율적이고 실질적인 관리자',
    ESFJ: '따뜻하고 책임감 있는 조직자',
    ENFJ: '카리스마 있는 지도자',
    ENTJ: '자신감 있는 지휘관',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🧠 성격 유형 테스트</h1>
          <p className="text-gray-400 mb-8">당신의 성격 유형을 알아보세요</p>

          {!completed ? (
            <div className="space-y-6">
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">질문 {currentQuestion + 1}/{questions.length}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-6">
                <p className="text-white text-lg font-semibold mb-6">{questions[currentQuestion].text}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleAnswer(
                        Object.keys(questions[currentQuestion]).find(
                          (k) => k !== 'text' && questions[currentQuestion][k as keyof typeof questions[0]] === 1
                        ) as keyof typeof scores,
                        1
                      )
                    }
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    그렇다
                  </button>
                  <button
                    onClick={() =>
                      handleAnswer(
                        Object.keys(questions[currentQuestion]).find(
                          (k) => k !== 'text' && questions[currentQuestion][k as keyof typeof questions[0]] === 0
                        ) as keyof typeof scores,
                        1
                      )
                    }
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    아니다
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-6 text-center">
                <p className="text-purple-300 text-sm mb-2">당신의 성격 유형은</p>
                <p className="text-white text-5xl font-bold mb-4">{getPersonalityType()}</p>
                <p className="text-purple-300">{personalityDescriptions[getPersonalityType()]}</p>
              </div>

              <button
                onClick={onBack}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                다시 테스트
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 지식 퀴즈
function KnowledgeTest({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">📚 지식 퀴즈</h1>
          <p className="text-gray-400 mb-8">다양한 분야의 지식을 테스트해보세요</p>

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
        </div>
      </div>
    </div>
  );
}
