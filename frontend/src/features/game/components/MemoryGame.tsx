import { useState, useEffect } from 'react';
import GameLayout from './GameLayout';

interface MemoryGameProps {
  onBack: () => void;
}

export default function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<(number | null)[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const nums = [...Array(8).keys()].flatMap((x) => [x, x]);
    setCards(nums.sort(() => Math.random() - 0.5));
    setFlipped(Array(16).fill(false));
    setMatched([]);
    setMoves(0);
  };

  const handleFlip = (idx: number) => {
    if (flipped[idx] || matched.includes(idx)) return;
    const newFlipped = [...flipped];
    newFlipped[idx] = true;
    setFlipped(newFlipped);

    const flippedIndices = newFlipped.map((f, i) => (f ? i : -1)).filter((i) => i !== -1);
    if (flippedIndices.length === 2) {
      setMoves((m) => m + 1);
      if (cards[flippedIndices[0]] === cards[flippedIndices[1]]) {
        setMatched((m) => [...m, ...flippedIndices]);
        setFlipped(Array(16).fill(false));
      } else {
        setTimeout(() => {
          setFlipped(Array(16).fill(false));
        }, 1000);
      }
    }
  };

  return (
    <GameLayout
      title="메모리 게임"
      emoji="🧩"
      description="같은 숫자를 찾아보세요"
      onBack={onBack}
    >
      <div className="mb-6 text-center">
        <p className="text-gray-300 text-sm mb-1">이동 횟수</p>
        <p className="text-white text-3xl font-bold">{moves}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleFlip(idx)}
            className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
              matched.includes(idx)
                ? 'bg-green-500/30 border border-green-400/50 text-green-300'
                : flipped[idx]
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-700'
            }`}
          >
            {flipped[idx] || matched.includes(idx) ? card : '?'}
          </button>
        ))}
      </div>

      {matched.length === 16 && (
        <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 text-center mb-6">
          <p className="text-green-300 font-semibold">완료! {moves}번의 이동으로 성공!</p>
        </div>
      )}

      <button
        onClick={initGame}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all"
      >
        다시 시작
      </button>
    </GameLayout>
  );
}
