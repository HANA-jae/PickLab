import { useState } from 'react';
import GameLayout from './GameLayout';

interface WordChainGameProps {
  onBack: () => void;
}

export default function WordChainGame({ onBack }: WordChainGameProps) {
  const [score, setScore] = useState(0);
  const [word, setWord] = useState('산');
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const lastChar = word[word.length - 1];
    if (!inputValue) {
      setMessage('단어를 입력하세요');
      return;
    }
    if (inputValue[0] !== lastChar) {
      setMessage(`${lastChar}로 시작하는 단어를 입력하세요`);
      return;
    }
    setScore((s) => s + 1);
    setWord(inputValue);
    setInputValue('');
    setMessage('');
  };

  return (
    <GameLayout
      title="단어 끝말잇기"
      emoji="📝"
      description="현재 단어의 마지막 글자로 시작하는 단어를 입력하세요"
      onBack={onBack}
    >
      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-2">점수: {score}</p>
        <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-6 text-center mb-4">
          <p className="text-gray-300 text-sm mb-1">현재 단어</p>
          <p className="text-white text-4xl font-bold">{word}</p>
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={`${word[word.length - 1]}로 시작하는 단어`}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-4"
        />

        {message && <p className="text-red-400 text-sm mb-4">{message}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
        >
          입력
        </button>
      </div>
    </GameLayout>
  );
}
