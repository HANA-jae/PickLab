import { useState } from 'react';
import QuizLayout from './QuizLayout';

interface PersonalityQuizProps {
  onBack: () => void;
}

export default function PersonalityQuiz({ onBack }: PersonalityQuizProps) {
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
    <QuizLayout
      onBack={onBack}
      title="성격 유형 테스트"
      emoji="🧠"
      description="당신의 성격 유형을 알아보세요"
    >
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
    </QuizLayout>
  );
}
