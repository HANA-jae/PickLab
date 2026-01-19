import { useState, useEffect } from 'react';

type GameType = 'number-guess' | 'reaction-test' | 'memory' | 'color-match' | 'word-chain' | 'dice-roll' | 'memory-sequence' | null;

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
  {
    id: 'memory',
    name: '메모리 게임',
    description: '숨겨진 카드를 찾아보세요',
    emoji: '🧩',
  },
  {
    id: 'color-match',
    name: '색깔 맞추기',
    description: '색깔 이름과 색을 맞춰보세요',
    emoji: '🎨',
  },
  {
    id: 'word-chain',
    name: '단어 끝말잇기',
    description: '단어의 마지막 글자로 다음 단어를 이어보세요',
    emoji: '📝',
  },
  {
    id: 'dice-roll',
    name: '주사위 게임',
    description: '주사위를 굴려서 더 높은 점수를 얻으세요',
    emoji: '🎲',
  },
  {
    id: 'memory-sequence',
    name: '숫자 기억력',
    description: '보여지는 숫자들을 기억해 맞춰보세요',
    emoji: '🔢',
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

  if (selectedGame === 'memory') {
    return <MemoryGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'color-match') {
    return <ColorMatchGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'word-chain') {
    return <WordChainGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'dice-roll') {
    return <DiceRollGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'memory-sequence') {
    return <MemorySequenceGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-8">🎮 게임</h1>
        <p className="text-gray-300 mb-12">재미있는 게임을 즐겨보세요</p>

        {/* 게임 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="group bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md hover:bg-gray-700 border border-gray-600/50 hover:border-orange-400 rounded-xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 hover:ring-2 hover:ring-orange-400/50 text-left cursor-pointer"
            >
              <div className="text-4xl mb-4 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:scale-110 transition-all duration-500">{game.emoji}</div>
              <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-all duration-300">
                {game.name}
              </h2>
              <p className="text-gray-300 group-hover:text-gray-200 mt-2 transition-colors duration-300">{game.description}</p>
              <div className="mt-4 text-orange-400 group-hover:translate-x-2 transition-all duration-300 font-semibold">
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

// 메모리 게임
function MemoryGame({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
        >
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🧩 메모리 게임</h1>
          <p className="text-gray-400 mb-8">같은 숫자를 찾아보세요</p>

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
        </div>
      </div>
    </div>
  );
}

// 색깔 맞추기
function ColorMatchGame({ onBack }: { onBack: () => void }) {
  const colors = ['빨강', '파랑', '녹색', '노랑', '보라', '주황'];
  const colorMap: Record<string, string> = {
    빨강: 'bg-red-500',
    파랑: 'bg-blue-500',
    녹색: 'bg-green-500',
    노랑: 'bg-yellow-500',
    보라: 'bg-purple-500',
    주황: 'bg-orange-500',
  };

  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState({ text: colors[0], color: colors[Math.floor(Math.random() * colors.length)] });
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (color: string) => {
    const correct = color === current.color;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setAnswered(true);
  };

  const nextQuestion = () => {
    setCurrent({ text: colors[Math.floor(Math.random() * colors.length)], color: colors[Math.floor(Math.random() * colors.length)] });
    setAnswered(false);
    setIsCorrect(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎨 색깔 맞추기</h1>
          <p className="text-gray-400 mb-8">텍스트와 일치하는 색을 클릭하세요</p>

          <div className="mb-8">
            <p className="text-gray-300 text-sm mb-2">점수: {score}</p>
            <div className={`${colorMap[current.color]} w-full h-32 rounded-lg flex items-center justify-center mb-6`}>
              <p className="text-3xl font-bold text-white">{current.text}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleAnswer(color)}
                  disabled={answered}
                  className={`p-4 rounded-lg font-bold text-white transition-all ${colorMap[color]} ${
                    answered ? 'opacity-50' : 'hover:opacity-80'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {answered && (
            <div className={`text-center p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {isCorrect ? '정답입니다!' : '틀렸습니다!'}
            </div>
          )}

          {answered && (
            <button onClick={nextQuestion} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all">
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 단어 끝말잇기
function WordChainGame({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">📝 단어 끝말잇기</h1>
          <p className="text-gray-400 mb-8">현재 단어의 마지막 글자로 시작하는 단어를 입력하세요</p>

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

            <button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all">
              입력
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 주사위 게임
function DiceRollGame({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎲 주사위 게임</h1>
          <p className="text-gray-400 mb-8">높은 숫자가 나올수록 이기는 게임입니다 (5라운드)</p>

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

          <p className="text-center text-gray-300 mb-6">
            라운드 {currentRound + 1}/5
          </p>

          {!gameOver ? (
            <button onClick={rollDice} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all">
              주사위 굴리기
            </button>
          ) : (
            <div className="space-y-4">
              <div
                className={`text-center p-4 rounded-lg ${playerScore > computerScore ? 'bg-green-500/20 text-green-300' : playerScore < computerScore ? 'bg-red-500/20 text-red-300' : 'bg-gray-600 text-gray-300'}`}
              >
                {playerScore > computerScore ? '승리! 🎉' : playerScore < computerScore ? '패배 😢' : '동점 🤝'}
              </div>
              <button onClick={resetGame} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all">
                다시 시작
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 숫자 기억력 게임
function MemorySequenceGame({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          ← 돌아가기
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔢 숫자 기억력</h1>
          <p className="text-gray-400 mb-8">보여지는 순서대로 숫자를 클릭하세요</p>

          <div className="text-center mb-8">
            <p className="text-gray-300 text-sm mb-1">현재 Level</p>
            <p className="text-white text-4xl font-bold">{level}</p>
          </div>

          {message && <p className="text-center text-blue-300 mb-6">{message}</p>}

          {!gameStarted ? (
            <button onClick={startGame} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all mb-6">
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
                    num === 1 ? 'bg-red-500 hover:bg-red-600' : num === 2 ? 'bg-blue-500 hover:bg-blue-600' : num === 3 ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
                  } text-white disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {gameOver && (
            <button onClick={startGame} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all">
              다시 시작
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
