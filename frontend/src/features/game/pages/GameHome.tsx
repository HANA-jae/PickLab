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
import { contentsApi } from '../../../services/api';
import { Game } from '../../../types';

type GameType = 'number-guess' | 'reaction-test' | 'memory' | 'color-match' | 'word-chain' | 'dice-roll' | 'memory-sequence' | null;

// 게임 ID와 DB 데이터 매핑
const gameComponentMap: Record<string, React.ComponentType<{ onBack: () => void }>> = {
  'number-guess': NumberGuessGame,
  'reaction-test': ReactionTestGame,
  'memory': MemoryGame,
  'color-match': ColorMatchGame,
  'word-chain': WordChainGame,
  'dice-roll': DiceRollGame,
  'memory-sequence': MemorySequenceGame,
};

export default function GameHome() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [loading, setLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await contentsApi.getGames();
      // 사용 중인 게임만 필터링하고 order 순으로 정렬
      const activeGames = (response as Game[])
        .filter(g => g.useYn === 'Y')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setGames(activeGames);
    } catch (error) {
      console.error('Failed to load games:', error);
      // 오류 시 기본 게임 표시
      setGames([
        { gameCode: 'number-guess', gameName: '숫자 맞추기', gameEmoji: '🎯', code: 'G001', name: '숫자 맞추기', emoji: '🎯', useYn: 'Y' },
        { gameCode: 'reaction-test', gameName: '반응속도 테스트', gameEmoji: '⚡', code: 'G002', name: '반응속도 테스트', emoji: '⚡', useYn: 'Y' },
        { gameCode: 'memory', gameName: '메모리 게임', gameEmoji: '🧩', code: 'G003', name: '메모리 게임', emoji: '🧩', useYn: 'Y' },
        { gameCode: 'color-match', gameName: '색깔 맞추기', gameEmoji: '🎨', code: 'G004', name: '색깔 맞추기', emoji: '🎨', useYn: 'Y' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // DB code를 게임 타입으로 변환
  const codeToGameType = (code: string): GameType => {
    const mapping: Record<string, GameType> = {
      'G001': 'number-guess',
      'G002': 'reaction-test',
      'G003': 'memory',
      'G004': 'color-match',
      'G005': 'word-chain',
      'G006': 'dice-roll',
      'G007': 'memory-sequence',
    };
    return mapping[code] as GameType;
  };

  const selectedGameType = selectedGame ? selectedGame : null;
  const selectedGameComponent = selectedGameType && gameComponentMap[selectedGameType];

  if (selectedGameComponent && selectedGameType) {
    const GameComponent = selectedGameComponent;
    return <GameComponent onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-8">🎮 게임</h1>
        <p className="text-gray-300 mb-12">재미있는 게임을 즐겨보세요</p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">게임 목록을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.length > 0 ? (
              games.map((game) => (
                <button
                  key={game.code}
                  onClick={() => setSelectedGame(codeToGameType(game.code))}
                  className="group bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md hover:bg-gray-700 border border-gray-600/50 hover:border-orange-400 rounded-xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 hover:ring-2 hover:ring-orange-400/50 text-left cursor-pointer"
                >
                  <div className="text-4xl mb-4 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:scale-110 transition-all duration-500">
                    {game.emoji || '🎮'}
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-orange-400 transition-all duration-300">
                    {game.name}
                  </h2>
                  <div className="mt-4 text-orange-400 group-hover:translate-x-2 transition-all duration-300 font-semibold">
                    시작하기 →
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">이용 가능한 게임이 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
