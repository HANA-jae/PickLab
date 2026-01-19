import { useState } from 'react';

type TabType = 'lunch' | 'dinner' | 'recipe';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  emoji: string;
  rating: string;
}

export default function EatHome() {
  const [activeTab, setActiveTab] = useState<TabType>('lunch');

  const lunchRecommendations: FoodItem[] = [
    {
      id: 1,
      name: '김밥',
      description: '신선한 재료로 만든 영양 만점 김밥',
      emoji: '🍙',
      rating: '⭐ 4.5',
    },
    {
      id: 2,
      name: '돈까스',
      description: '바삭한 튀김옷의 본연의 맛',
      emoji: '🍖',
      rating: '⭐ 4.7',
    },
    {
      id: 3,
      name: '비빔밥',
      description: '다양한 야채가 들어간 건강식',
      emoji: '🥗',
      rating: '⭐ 4.6',
    },
    {
      id: 4,
      name: '우동',
      description: '쫄깃한 면발의 일식 우동',
      emoji: '🍜',
      rating: '⭐ 4.4',
    },
  ];

  const dinnerRecommendations: FoodItem[] = [
    {
      id: 1,
      name: '삼겹살 구이',
      description: '고기의 참맛을 느낄 수 있는 최고의 선택',
      emoji: '🥩',
      rating: '⭐ 4.9',
    },
    {
      id: 2,
      name: '생선까스',
      description: '담백한 흰살 생선의 별미',
      emoji: '🍤',
      rating: '⭐ 4.5',
    },
    {
      id: 3,
      name: '치킨',
      description: '언제나 먹기 좋은 국민 음식',
      emoji: '🍗',
      rating: '⭐ 4.8',
    },
    {
      id: 4,
      name: '스테이크',
      description: '특별한 날을 위한 프리미엄 요리',
      emoji: '🥩',
      rating: '⭐ 4.7',
    },
  ];

  const recipeRecommendations: FoodItem[] = [
    {
      id: 1,
      name: '계란 볶음밥',
      description: '남은 밥으로 만드는 쉽고 맛있는 요리',
      emoji: '🍚',
      rating: '⭐ 4.3',
    },
    {
      id: 2,
      name: '파스타',
      description: '집에서 쉽게 만드는 이탈리아 요리',
      emoji: '🍝',
      rating: '⭐ 4.6',
    },
    {
      id: 3,
      name: '계란말이',
      description: '간식으로도 반찬으로도 좋은 요리',
      emoji: '🥚',
      rating: '⭐ 4.4',
    },
    {
      id: 4,
      name: '수프',
      description: '따뜻하고 영양 많은 수프',
      emoji: '🍲',
      rating: '⭐ 4.5',
    },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'lunch':
        return lunchRecommendations;
      case 'dinner':
        return dinnerRecommendations;
      case 'recipe':
        return recipeRecommendations;
      default:
        return lunchRecommendations;
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'lunch':
        return '🌞 점심 추천';
      case 'dinner':
        return '🌙 저녁 추천';
      case 'recipe':
        return '👨‍🍳 요리 추천';
      default:
        return '';
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            🍔 음식 추천
          </h1>
          <p className="text-xl text-gray-400">
            오늘은 뭐 먹을까요? 편하게 추천받아보세요!
          </p>
        </div>

        {/* 탭 버튼 */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {(['lunch', 'dinner', 'recipe'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* 음식 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.map((food) => (
            <div
              key={food.id}
              className="group rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 p-6 border border-gray-700 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
            >
              {/* 아이콘 */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {food.emoji}
              </div>

              {/* 음식명 */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {food.name}
              </h3>

              {/* 설명 */}
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {food.description}
              </p>

              {/* 평점 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                <span className="text-yellow-400 font-semibold">{food.rating}</span>
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                  추천
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 p-8 border border-orange-500/30">
            <h2 className="text-2xl font-bold text-white mb-2">음식 추천이 마음에 들었나요?</h2>
            <p className="text-gray-400 mb-4">친구들과 함께 추천 음식을 공유하고 함께 즐겨보세요!</p>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-semibold transition-all hover:scale-105">
              공유하기 🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
