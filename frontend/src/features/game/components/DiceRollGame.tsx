import { useState } from 'react';
import GameLayout from './GameLayout';

interface DiceRollGameProps {
  onBack: () => void;
}

export default function DiceRollGame({ onBack }: DiceRollGameProps) {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerDice, setPlayerDice] = useState(0);
  const [computerDice, setComputerDice] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const rollDice = () => {
    const p = Math.floor(Math.random() * 6) + 1;
    const c = Math.floor(Math.random() * 6) + 1;

    setPlayerDice(p);
    setComputerDice(c);

    if (p > c) {
      setPlayerScore((s) => s + 1);
    } else if (c > p) {
      setComputerScore((s) => s + 1);
    }

    if (currentRound + 1 >= 5) {
      setGameOver(true);
    } else {
      setCurrentRound((r) => r + 1);
    }
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setCurrentRound(0);
    setPlayerDice(0);
    setComputerDice(0);
    setGameOver(false);
  };

  return (
    <GameLayout
      title="주사위 게임"
      emoji="🎲"
      description="높은 숫자가 나올수록 이기는 게임입니다 (5라운드)"
      onBack={onBack}
    >
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <p className="text-gray-300 mb-2">당신</p>
          <div className="text-6xl font-bold text-blue-400 mb-2">{playerDice || '?'}</div>
          <p className="text-2xl font-bold text-white">{playerScore}승</p>
        </div>
        <div className="text-center">
          <p className="text-gray-300 mb-2">컴퓨터</p>
          <div className="text-6xl font-bold text-red-400 mb-2">{computerDice || '?'}</div>
          <p className="text-2xl font-bold text-white">{computerScore}승</p>
        </div>
      </div>

      <p className="text-center text-gray-300 mb-6">라운드 {currentRound + 1}/5</p>

      {!gameOver ? (
        <button
          onClick={rollDice}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all"
        >
          주사위 굴리기
        </button>
      ) : (
        <div className="space-y-4">
          <div
            className={`text-center p-4 rounded-lg ${
              playerScore > computerScore
                ? 'bg-green-500/20 text-green-300'
                : playerScore < computerScore
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-gray-600 text-gray-300'
            }`}
          >
            {playerScore > computerScore
              ? '승리! 🎉'
              : playerScore < computerScore
                ? '패배 😢'
                : '동점 🤝'}
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            다시 시작
          </button>
        </div>
      )}
    </GameLayout>
  );
}
