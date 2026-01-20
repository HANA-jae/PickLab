import { useState, useEffect } from 'react';
import {
  NumberGuessGame,
  ReactionTestGame,
  MemoryGame,
  ColorMatchGame,
  WordChainGame,
  DiceRollGame,
  MemorySequenceGame,
} from '../components';

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
