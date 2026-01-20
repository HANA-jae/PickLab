import { useState } from 'react';
import GameLayout from './GameLayout';

interface NumberGuessGameProps {
  onBack: () => void;
}

export default function NumberGuessGame({ onBack }: NumberGuessGameProps) {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (!guess) return;

    const num = parseInt(guess);
    setAttempts((prev) => prev + 1);

    if (num === target) {
      setMessage(`축하합니다! ${attempts + 1}번 만에 맞췄어요!`);
      setGameOver(true);
    } else if (num < target) {
      setMessage('더 큰 수입니다');
    } else {
      setMessage('더 작은 수입니다');
    }

    setGuess('');
  };

  const handleReset = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('');
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <GameLayout
      title="숫자 맞추기"
      emoji="🎯"
      description="1~100 사이의 숫자를 맞춰보세요"
      onBack={onBack}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            숫자를 입력하세요
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !gameOver && handleGuess()}
            disabled={gameOver}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 disabled:opacity-50"
            placeholder="1~100"
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg text-center font-semibold text-lg ${
              gameOver
                ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                : 'bg-blue-500/20 border border-blue-400/50 text-blue-300'
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-center text-sm text-gray-400">
          시도 횟수: <span className="text-white font-bold">{attempts}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGuess}
            disabled={gameOver || !guess}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            맞춰보기
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            다시 시작
          </button>
        </div>
      </div>
    </GameLayout>
  );
}
