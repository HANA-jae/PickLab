import { useState } from 'react';

type TabType = 'lunch' | 'dinner' | 'recipe';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  emoji: string;
  rating: string;
  category: string;
}

interface RecommendationState {
  selectedOption: string;
  recommendedFoods: FoodItem[];
}

export default function EatHome() {
  const [activeTab, setActiveTab] = useState<TabType>('lunch');
  const [recommendations, setRecommendations] = useState<Record<TabType, RecommendationState>>({
    lunch: { selectedOption: '', recommendedFoods: [] },
    dinner: { selectedOption: '', recommendedFoods: [] },
    recipe: { selectedOption: '', recommendedFoods: [] },
  });

  // 각 탭별 선택 옵션
  const lunchOptions = ['한식', '양식', '중식', '일식', '카페'];
  const dinnerOptions = ['고기', '해산물', '채식', '이탈리안', '기타'];
  const recipeOptions = ['간단한 요리', '밥요리', '면요리', '스ープ', '간식'];

  // 각 탭별 음식 데이터
  const allFoods: Record<TabType, FoodItem[]> = {
    lunch: [
      { id: 1, name: '김밥', description: '신선한 재료로 만든 영양 만점 김밥', emoji: '🍙', rating: '⭐ 4.5', category: '한식' },
      { id: 2, name: '주먹밥', description: '따뜻한 손으로 만든 주먹밥', emoji: '🍙', rating: '⭐ 4.3', category: '한식' },
      { id: 3, name: '돈까스', description: '바삭한 튀김옷의 본연의 맛', emoji: '🍖', rating: '⭐ 4.7', category: '양식' },
      { id: 4, name: '파스타', description: '부드러운 크림 파스타', emoji: '🍝', rating: '⭐ 4.6', category: '양식' },
      { id: 5, name: '짜장면', description: '깊은 맛의 중식 짜장면', emoji: '🍜', rating: '⭐ 4.4', category: '중식' },
      { id: 6, name: '탕수육', description: '바삭한 탕수육', emoji: '🥡', rating: '⭐ 4.5', category: '중식' },
      { id: 7, name: '돈카츠', description: '일본식 돼지까스', emoji: '🍖', rating: '⭐ 4.6', category: '일식' },
      { id: 8, name: '라멘', description: '깊은 국물맛의 라멘', emoji: '🍜', rating: '⭐ 4.7', category: '일식' },
      { id: 9, name: '아메리카노', description: '향긋한 아메리카노', emoji: '☕', rating: '⭐ 4.3', category: '카페' },
      { id: 10, name: '샌드위치', description: '신선한 재료의 샌드위치', emoji: '🥪', rating: '⭐ 4.4', category: '카페' },
    ],
    dinner: [
      { id: 1, name: '삼겹살 구이', description: '고기의 참맛을 느낄 수 있는 최고의 선택', emoji: '🥩', rating: '⭐ 4.9', category: '고기' },
      { id: 2, name: '소불고기', description: '양념한 소고기의 맛', emoji: '🥩', rating: '⭐ 4.8', category: '고기' },
      { id: 3, name: '생선까스', description: '담백한 흰살 생선의 별미', emoji: '🍤', rating: '⭐ 4.5', category: '해산물' },
      { id: 4, name: '회', description: '신선한 생선회', emoji: '🍣', rating: '⭐ 4.7', category: '해산물' },
      { id: 5, name: '야채볶음', description: '싱싱한 야채의 조화', emoji: '🥘', rating: '⭐ 4.4', category: '채식' },
      { id: 6, name: '두부구이', description: '부드러운 두부 구이', emoji: '🥡', rating: '⭐ 4.3', category: '채식' },
      { id: 7, name: '리조또', description: '이탈리안 리조또', emoji: '🍚', rating: '⭐ 4.6', category: '이탈리안' },
      { id: 8, name: '오일 파스타', description: '마늘향 가득한 파스타', emoji: '🍝', rating: '⭐ 4.7', category: '이탈리안' },
      { id: 9, name: '치킨', description: '언제나 먹기 좋은 국민 음식', emoji: '🍗', rating: '⭐ 4.8', category: '기타' },
      { id: 10, name: '스테이크', description: '특별한 날을 위한 프리미엄 요리', emoji: '🥩', rating: '⭐ 4.7', category: '기타' },
    ],
    recipe: [
      { id: 1, name: '계란 볶음밥', description: '남은 밥으로 만드는 쉽고 맛있는 요리', emoji: '🍚', rating: '⭐ 4.3', category: '밥요리' },
      { id: 2, name: '덮밥', description: '재료 올려서 만드는 한그릇 요리', emoji: '🍚', rating: '⭐ 4.4', category: '밥요리' },
      { id: 3, name: '파스타', description: '집에서 쉽게 만드는 이탈리아 요리', emoji: '🍝', rating: '⭐ 4.6', category: '면요리' },
      { id: 4, name: '우동', description: '쫄깃한 면발', emoji: '🍜', rating: '⭐ 4.5', category: '면요리' },
      { id: 5, name: '된장국', description: '따뜻한 된장국', emoji: '🍲', rating: '⭐ 4.4', category: '스프' },
      { id: 6, name: '계란탕', description: '계란이 들어간 수프', emoji: '🍲', rating: '⭐ 4.3', category: '스프' },
      { id: 7, name: '계란말이', description: '간식으로도 반찬으로도 좋은 요리', emoji: '🥚', rating: '⭐ 4.4', category: '간식' },
      { id: 8, name: '팬케이크', description: '달콤한 팬케이크', emoji: '🥞', rating: '⭐ 4.6', category: '간식' },
      { id: 9, name: '밥주먹밥', description: '주먹밥 만들기', emoji: '🍙', rating: '⭐ 4.5', category: '간단한 요리' },
      { id: 10, name: '계란 계란 계란', description: '계란 요리 대전', emoji: '🥚', rating: '⭐ 4.2', category: '간단한 요리' },
    ],
  };

  const getOptions = () => {
    switch (activeTab) {
      case 'lunch':
        return lunchOptions;
      case 'dinner':
        return dinnerOptions;
      case 'recipe':
        return recipeOptions;
      default:
        return [];
    }
  };

  const getRandomFoods = (foods: FoodItem[], count: number = 3): FoodItem[] => {
    const shuffled = [...foods].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const handleGetRecommendation = () => {
    const selectedOption = recommendations[activeTab].selectedOption;
    if (!selectedOption) {
      alert('선택지를 먼저 선택해주세요!');
      return;
    }

    const foods = allFoods[activeTab];
    const filteredFoods = foods.filter((food) => food.category === selectedOption);
    const recommendedFoods = getRandomFoods(filteredFoods, 3);

    setRecommendations((prev) => ({
      ...prev,
      [activeTab]: {
        selectedOption,
        recommendedFoods,
      },
    }));
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

  const currentRecommendation = recommendations[activeTab];
  const options = getOptions();

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

        {/* 선택지 섹션 */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">원하는 종류를 선택하세요</h2>

            {/* 선택지 버튼 그룹 */}
            <div className="flex flex-wrap gap-3 mb-8">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    setRecommendations((prev) => ({
                      ...prev,
                      [activeTab]: {
                        ...prev[activeTab],
                        selectedOption: option,
                        recommendedFoods: [],
                      },
                    }))
                  }
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    currentRecommendation.selectedOption === option
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* 선택된 옵션 표시 */}
            {currentRecommendation.selectedOption && (
              <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <p className="text-blue-300">
                  ✓ <span className="font-semibold">{currentRecommendation.selectedOption}</span> 선택됨
                </p>
              </div>
            )}

            {/* 추천받기 버튼 */}
            <button
              onClick={handleGetRecommendation}
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              추천받기 🎉
            </button>
          </div>
        </div>

        {/* 추천 음식 카드 그리드 */}
        {currentRecommendation.recommendedFoods.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              당신을 위한 추천 음식 🎯
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentRecommendation.recommendedFoods.map((food, index) => (
                <div
                  key={`${food.id}-${index}`}
                  className="group rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 p-8 border border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/30 hover:border-orange-500 cursor-pointer transform hover:scale-105"
                >
                  {/* 순위 배지 */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* 아이콘 */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {food.emoji}
                  </div>

                  {/* 음식명 */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {food.name}
                  </h3>

                  {/* 카테고리 */}
                  <p className="text-orange-400 text-sm font-semibold mb-3">
                    #{food.category}
                  </p>

                  {/* 설명 */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {food.description}
                  </p>

                  {/* 평점 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                    <span className="text-yellow-400 font-semibold">{food.rating}</span>
                    <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                      저장
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 메시지 */}
        {currentRecommendation.recommendedFoods.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😋</div>
            <p className="text-xl text-gray-400 mb-4">
              아직 추천을 받지 않았어요
            </p>
            <p className="text-gray-500">
              위에서 원하는 종류를 선택하고 "추천받기" 버튼을 눌러주세요!
            </p>
          </div>
        )}

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
