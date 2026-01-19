import { useState } from 'react';

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
                돌아가기
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

// 색상 감정 테스트
function ColorEmotionTest({ onBack }: { onBack: () => void }) {
  const colorEmotions = [
    { color: 'bg-red-500', name: '빨강', emotion: '열정적이고 에너지 있는' },
    { color: 'bg-blue-500', name: '파랑', emotion: '차분하고 신뢰할 수 있는' },
    { color: 'bg-green-500', name: '녹색', emotion: '차분하고 자연스러운' },
    { color: 'bg-yellow-500', name: '노랑', emotion: '밝고 긍정적인' },
    { color: 'bg-purple-500', name: '보라', emotion: '신비롭고 창의적인' },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎨 색상 감정 테스트</h1>
          <p className="text-gray-400 mb-8">가장 끌리는 색상을 선택하세요</p>

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
        </div>
      </div>
    </div>
  );
}

// IQ 테스트
function IQTest({ onBack }: { onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      question: '2, 4, 6, 8, ?',
      options: ['10', '9', '12', '14'],
      correct: 0,
      explanation: '2씩 증가하는 패턴입니다.',
    },
    {
      question: '1, 4, 9, 16, ?',
      options: ['25', '20', '24', '30'],
      correct: 0,
      explanation: '1², 2², 3², 4², 5²입니다.',
    },
    {
      question: '모든 고양이는 동물이다. 톰은 고양이다. 톰은?',
      options: ['동물이다', '포유류이다', '새이다', '알 수 없다'],
      correct: 0,
      explanation: '논리적 추론 문제입니다.',
    },
    {
      question: '시계가 3:15를 가리킬 때, 시침과 분침 사이의 각도는?',
      options: ['7.5도', '15도', '22.5도', '30도'],
      correct: 0,
      explanation: '분침은 3(90도), 시침은 약 97.5도입니다.',
    },
    {
      question: '100명 중 60명이 커피를 마신다. 40명이 차를 마신다. 20명이 둘 다 마신다. 어느 것도 안 마시는 사람은?',
      options: ['20명', '30명', '40명', '50명'],
      correct: 0,
      explanation: '60+40-20=80명이 어떤 것이라도 마시므로, 20명이 안 마집니다.',
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

  const isTestComplete = currentQuestion === questions.length - 1 && answered;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🧪 IQ 테스트</h1>
          <p className="text-gray-400 mb-8">논리력과 패턴 인식을 테스트합니다</p>

          {!isTestComplete ? (
            <div className="space-y-6">
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">문제 {currentQuestion + 1}/{questions.length}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-6">
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

                {answered && (
                  <p className="text-gray-300 text-sm mt-4 pt-4 border-t border-gray-600">{questions[currentQuestion].explanation}</p>
                )}
              </div>

              {answered && (
                <button
                  onClick={handleNext}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  다음 문제
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-6 text-center">
                <p className="text-purple-300 text-sm mb-2">테스트 완료!</p>
                <p className="text-white text-5xl font-bold mb-4">
                  {score}/{questions.length}
                </p>
                <p className="text-purple-300">
                  예상 IQ: {Math.round(80 + (score / questions.length) * 40)}
                </p>
              </div>

              <button
                onClick={onBack}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 스트레스 지수 테스트
function StressTest({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">😰 스트레스 지수 테스트</h1>
          <p className="text-gray-400 mb-8">1(전혀 그렇지 않다) ~ 5(매우 그렇다)로 평가하세요</p>

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
        </div>
      </div>
    </div>
  );
}

// 창의성 테스트
function CreativityTest({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">💡 창의성 테스트</h1>
          <p className="text-gray-400 mb-8">당신의 창의적 사고력을 측정합니다</p>

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
        </div>
      </div>
    </div>
  );
}

// 뇌 유형 테스트
function BrainTypeTest({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🧬 뇌 유형 테스트</h1>
          <p className="text-gray-400 mb-8">당신의 뇌 성향을 알아보세요</p>

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
        </div>
      </div>
    </div>
  );
}
