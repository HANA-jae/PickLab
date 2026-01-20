import { useState } from 'react';
import GameLayout from './GameLayout';

interface MemorySequenceGameProps {
  onBack: () => void;
}

export default function MemorySequenceGame({ onBack }: MemorySequenceGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const startGame = () => {
    setSequence([Math.floor(Math.random() * 4)]);
    setUserSequence([]);
    setLevel(1);
    setGameStarted(true);
    setGameOver(false);
    setMessage('시작!');
  };

  const handleNumber = (num: number) => {
    const newSequence = [...userSequence, num];
    setUserSequence(newSequence);

    if (newSequence[newSequence.length - 1] !== sequence[newSequence.length - 1]) {
      setGameOver(true);
      setMessage(`게임 오버! Level ${level} 달성`);
      return;
    }

    if (newSequence.length === sequence.length) {
      setUserSequence([]);
      const newSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSeq);
      setLevel((l) => l + 1);
      setMessage(`Level ${level + 1}!`);
    }
  };

  return (
    <GameLayout
      title="숫자 기억력"
      emoji="🔢"
      description="보여지는 순서대로 숫자를 클릭하세요"
      onBack={onBack}
    >
      <div className="text-center mb-8">
        <p className="text-gray-300 text-sm mb-1">현재 Level</p>
        <p className="text-white text-4xl font-bold">{level}</p>
      </div>

      {message && <p className="text-center text-blue-300 mb-6">{message}</p>}

      {!gameStarted ? (
        <button
          onClick={startGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all mb-6"
        >
          게임 시작
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num - 1)}
              disabled={!gameStarted || gameOver}
              className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
                num === 1
                  ? 'bg-red-500 hover:bg-red-600'
                  : num === 2
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : num === 3
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-yellow-500 hover:bg-yellow-600'
              } text-white disabled:opacity-50`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {gameOver && (
        <button
          onClick={startGame}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all"
        >
          다시 시작
        </button>
      )}
    </GameLayout>
  );
}
