import { useState, useEffect } from 'react';

type GameType = 'number-guess' | 'reaction-test' | null;

interface GameInfo {
  id: GameType;
  name: string;
  description: string;
  emoji: string;
}

const games: GameInfo[] = [
  {
    id: 'number-guess',
    name: '숫자 맞추기',
    description: '1~100 사이의 숫자를 맞춰보세요',
    emoji: '🎯',
  },
  {
    id: 'reaction-test',
    name: '반응속도 테스트',
    description: '화면이 바뀌는 순간 클릭해보세요',
    emoji: '⚡',
  },
];

export default function GameHome() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  // 게임 페이지 진입 시 게임 리스트 화면으로 초기화
  useEffect(() => {
    setSelectedGame(null);
  }, []);

  if (selectedGame === 'number-guess') {
    return <NumberGuessGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'reaction-test') {
    return <ReactionTestGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🎮 게임</h1>
        <p className="text-gray-300 mb-12">재미있는 게임을 즐겨보세요</p>

        {/* 게임 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-400 rounded-lg p-6 transition-all duration-300 text-left cursor-pointer"
            >
              <div className="text-4xl mb-4">{game.emoji}</div>
              <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                {game.name}
              </h2>
              <p className="text-gray-400 mt-2">{game.description}</p>
              <div className="mt-4 text-orange-400 group-hover:translate-x-1 transition-transform">
                시작하기 →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 숫자 맞추기 게임
function NumberGuessGame({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎯 숫자 맞추기</h1>
          <p className="text-gray-400 mb-8">1~100 사이의 숫자를 맞춰보세요</p>

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
        </div>
      </div>
    </div>
  );
}

// 반응속도 게임
function ReactionTestGame({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">⚡ 반응속도 테스트</h1>
          <p className="text-gray-400 mb-8">화면이 바뀌는 순간 클릭하세요 (3라운드)</p>

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
        </div>
      </div>
    </div>
  );
}
