import { useState } from 'react';
import QuizLayout from './QuizLayout';

interface IQQuizProps {
  onBack: () => void;
}

export default function IQQuiz({ onBack }: IQQuizProps) {
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

  const isQuizComplete = currentQuestion === questions.length - 1 && answered;

  return (
    <QuizLayout
      onBack={onBack}
      title="IQ 테스트"
      emoji="🧪"
      description="논리력과 패턴 인식을 테스트합니다"
    >
      {!isQuizComplete ? (
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
    </QuizLayout>
  );
}
