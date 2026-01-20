import { useState } from 'react';
import GameLayout from './GameLayout';

interface ReactionTestGameProps {
  onBack: () => void;
}

export default function ReactionTestGame({ onBack }: ReactionTestGameProps) {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'start' | 'done'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  const handleStart = () => {
    if (gameState === 'waiting') {
      setGameState('ready');
      const delay = Math.random() * 3000 + 1000; // 1~4초 랜덤
      setTimeout(() => {
        setGameState('start');
        setStartTime(Date.now());
      }, delay);
    } else if (gameState === 'start') {
      const time = Date.now() - (startTime || 0);
      setReactionTime(time);
      setResults((prev) => [...prev, time]);
      setCurrentRound((prev) => prev + 1);

      if (currentRound + 1 < 3) {
        setTimeout(() => {
          setGameState('waiting');
          setReactionTime(null);
        }, 1000);
      } else {
        setGameState('done');
      }
    } else if (gameState === 'done') {
      setGameState('waiting');
      setReactionTime(null);
      setStartTime(null);
      setResults([]);
      setCurrentRound(0);
    }
  };

  const avgTime =
    results.length > 0 ? Math.round(results.reduce((a, b) => a + b) / results.length) : 0;

  return (
    <GameLayout
      title="반응속도 테스트"
      emoji="⚡"
      description="화면이 바뀌는 순간 클릭하세요 (3라운드)"
      onBack={onBack}
    >
      <div className="space-y-6">
        {/* 게임 화면 */}
        <button
          onClick={handleStart}
          disabled={gameState === 'ready'}
          className={`w-full h-48 rounded-lg font-bold text-2xl transition-all duration-200 ${
            gameState === 'ready'
              ? 'bg-yellow-500 text-gray-900 cursor-wait'
              : gameState === 'start'
                ? 'bg-green-500 text-white animate-pulse'
                : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {gameState === 'ready' && '준비하세요...'}
          {gameState === 'start' && '지금 클릭!'}
          {gameState === 'waiting' && '시작'}
          {gameState === 'done' && '완료'}
        </button>

        {/* 라운드 정보 */}
        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">라운드</p>
            <p className="text-white text-2xl font-bold">
              {currentRound}/3
            </p>
          </div>
        </div>

        {/* 현재 반응속도 */}
        {reactionTime !== null && gameState !== 'done' && (
          <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4 text-center">
            <p className="text-blue-300 text-sm mb-1">반응속도</p>
            <p className="text-white text-3xl font-bold">{reactionTime}ms</p>
          </div>
        )}

        {/* 결과 */}
        {gameState === 'done' && results.length > 0 && (
          <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4">
            <p className="text-green-300 text-sm mb-3 font-semibold">평균 반응속도</p>
            <p className="text-white text-3xl font-bold mb-4 text-center">{avgTime}ms</p>
            <div className="space-y-2">
              {results.map((time, idx) => (
                <div key={idx} className="flex justify-between text-sm text-gray-300">
                  <span>라운드 {idx + 1}</span>
                  <span className="font-mono">{time}ms</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 다시 시작 버튼 */}
        {gameState === 'done' && (
          <button
            onClick={handleStart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            다시 시작
          </button>
        )}
      </div>
    </GameLayout>
  );
}
