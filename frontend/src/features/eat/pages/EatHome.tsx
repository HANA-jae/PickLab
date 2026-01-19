import { useState } from 'react';

type TabType = 'lunch' | 'dinner' | 'recipe';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  emoji: string;
  rating: string;
  category: string;
  subCategory: string;
  taste: string;
  priceRange: string;
  feature: string;
}

interface RecommendationState {
  step1: string; // 종류
  step2: string; // 세부
  step3: string; // 맛
  step4: string; // 가격
  step5: string; // 특징
  recommendedFoods: FoodItem[];
}

export default function EatHome() {
  const [activeTab, setActiveTab] = useState<TabType>('lunch');
  const [recommendations, setRecommendations] = useState<Record<TabType, RecommendationState>>({
    lunch: { step1: '', step2: '', step3: '', step4: '', step5: '', recommendedFoods: [] },
    dinner: { step1: '', step2: '', step3: '', step4: '', step5: '', recommendedFoods: [] },
    recipe: { step1: '', step2: '', step3: '', step4: '', step5: '', recommendedFoods: [] },
  });

  // 각 단계별 선택지
  const lunchOptions = ['한식', '양식', '중식', '일식', '카페'];
  const dinnerOptions = ['고기', '해산물', '채식', '이탈리안', '기타'];
  const recipeOptions = ['간단한 요리', '밥요리', '면요리', '스프', '간식'];

  const tasteOptions = ['순한맛', '중간맛', '매운맛', '짭짤한맛', '상큼한맛'];
  const priceOptions = ['저가', '중가', '고가'];
  const featureOptions = ['빠르게', '건강식', '푸짐한', '가벼운', '특별한'];

  // 각 1단계 옵션별 2단계 선택지
  const lunchSubOptions: Record<string, string[]> = {
    '한식': ['국/찌개', '밥', '반찬', '튀김', '기타'],
    '양식': ['파스타', '고기', '해산물', '치즈', '기타'],
    '중식': ['면', '밥', '탕수육', '짜장/짬뽕', '기타'],
    '일식': ['우동/라멘', '회', '돈카츠', '스시', '기타'],
    '카페': ['음료', '빵', '샌드위치', '디저트', '기타'],
  };

  const dinnerSubOptions: Record<string, string[]> = {
    '고기': ['소고기', '돼지고기', '닭고기', '양고기', '기타'],
    '해산물': ['생선', '게/새우', '조개', '오징어', '기타'],
    '채식': ['야채', '두부', '버섯', '나물', '기타'],
    '이탈리안': ['파스타', '리조또', '피자', '스프', '기타'],
    '기타': ['국/탕', '곡물', '계란', '튀김', '기타'],
  };

  const recipeSubOptions: Record<string, string[]> = {
    '간단한 요리': ['계란', '야채', '고기', '생선', '기타'],
    '밥요리': ['볶음밥', '덮밥', '주먹밥', '김밥', '기타'],
    '면요리': ['파스타', '우동', '스파게티', '국수', '기타'],
    '스프': ['국', '탕', '스프', '수프', '기타'],
    '간식': ['튀김', '계란말이', '무침', '구이', '기타'],
  };

  // 각 탭별 음식 데이터
  const allFoods: Record<TabType, FoodItem[]> = {
    lunch: [
      { id: 1, name: '김밥', description: '신선한 재료로 만든 영양 만점 김밥', emoji: '🍙', rating: '⭐ 4.5', category: '한식', subCategory: '밥', taste: '순한맛', priceRange: '저가', feature: '빠르게' },
      { id: 2, name: '주먹밥', description: '따뜻한 손으로 만든 주먹밥', emoji: '🍙', rating: '⭐ 4.3', category: '한식', subCategory: '밥', taste: '순한맛', priceRange: '저가', feature: '빠르게' },
      { id: 3, name: '된장국', description: '따뜻한 된장국', emoji: '🍲', rating: '⭐ 4.4', category: '한식', subCategory: '국/찌개', taste: '짭짤한맛', priceRange: '저가', feature: '건강식' },
      { id: 4, name: '부추전', description: '바삭한 부추전', emoji: '🥞', rating: '⭐ 4.5', category: '한식', subCategory: '튀김', taste: '짭짤한맛', priceRange: '중가', feature: '푸짐한' },
      { id: 5, name: '돈까스', description: '바삭한 튀김옷의 본연의 맛', emoji: '🍖', rating: '⭐ 4.7', category: '양식', subCategory: '고기', taste: '순한맛', priceRange: '중가', feature: '푸짐한' },
      { id: 6, name: '파스타', description: '부드러운 크림 파스타', emoji: '🍝', rating: '⭐ 4.6', category: '양식', subCategory: '파스타', taste: '중간맛', priceRange: '중가', feature: '특별한' },
      { id: 7, name: '짜장면', description: '깊은 맛의 중식 짜장면', emoji: '🍜', rating: '⭐ 4.4', category: '중식', subCategory: '면', taste: '짭짤한맛', priceRange: '저가', feature: '빠르게' },
      { id: 8, name: '탕수육', description: '바삭한 탕수육', emoji: '🥡', rating: '⭐ 4.5', category: '중식', subCategory: '탕수육', taste: '중간맛', priceRange: '중가', feature: '푸짐한' },
      { id: 9, name: '돈카츠', description: '일본식 돼지까스', emoji: '🍖', rating: '⭐ 4.6', category: '일식', subCategory: '돈카츠', taste: '순한맛', priceRange: '중가', feature: '푸짐한' },
      { id: 10, name: '라멘', description: '깊은 국물맛의 라멘', emoji: '🍜', rating: '⭐ 4.7', category: '일식', subCategory: '우동/라멘', taste: '중간맛', priceRange: '중가', feature: '따뜻한' },
      { id: 11, name: '아메리카노', description: '향긋한 아메리카노', emoji: '☕', rating: '⭐ 4.3', category: '카페', subCategory: '음료', taste: '상큼한맛', priceRange: '저가', feature: '가벼운' },
      { id: 12, name: '샌드위치', description: '신선한 재료의 샌드위치', emoji: '🥪', rating: '⭐ 4.4', category: '카페', subCategory: '샌드위치', taste: '순한맛', priceRange: '중가', feature: '빠르게' },
    ],
    dinner: [
      { id: 1, name: '삼겹살 구이', description: '고기의 참맛을 느낄 수 있는 최고의 선택', emoji: '🥩', rating: '⭐ 4.9', category: '고기', subCategory: '돼지고기', taste: '짭짤한맛', priceRange: '중가', feature: '푸짐한' },
      { id: 2, name: '소불고기', description: '양념한 소고기의 맛', emoji: '🥩', rating: '⭐ 4.8', category: '고기', subCategory: '소고기', taste: '중간맛', priceRange: '고가', feature: '특별한' },
      { id: 3, name: '생선까스', description: '담백한 흰살 생선의 별미', emoji: '🍤', rating: '⭐ 4.5', category: '해산물', subCategory: '생선', taste: '순한맛', priceRange: '중가', feature: '건강식' },
      { id: 4, name: '회', description: '신선한 생선회', emoji: '🍣', rating: '⭐ 4.7', category: '해산물', subCategory: '생선', taste: '상큼한맛', priceRange: '고가', feature: '특별한' },
      { id: 5, name: '야채볶음', description: '싱싱한 야채의 조화', emoji: '🥘', rating: '⭐ 4.4', category: '채식', subCategory: '야채', taste: '순한맛', priceRange: '저가', feature: '건강식' },
      { id: 6, name: '두부구이', description: '부드러운 두부 구이', emoji: '🥡', rating: '⭐ 4.3', category: '채식', subCategory: '두부', taste: '순한맛', priceRange: '저가', feature: '건강식' },
      { id: 7, name: '리조또', description: '이탈리안 리조또', emoji: '🍚', rating: '⭐ 4.6', category: '이탈리안', subCategory: '리조또', taste: '중간맛', priceRange: '중가', feature: '특별한' },
      { id: 8, name: '오일 파스타', description: '마늘향 가득한 파스타', emoji: '🍝', rating: '⭐ 4.7', category: '이탈리안', subCategory: '파스타', taste: '중간맛', priceRange: '중가', feature: '특별한' },
      { id: 9, name: '닭다리', description: '쫄깃한 닭다리구이', emoji: '🍗', rating: '⭐ 4.8', category: '기타', subCategory: '고기', taste: '짭짤한맛', priceRange: '저가', feature: '푸짐한' },
      { id: 10, name: '스테이크', description: '특별한 날을 위한 프리미엄 요리', emoji: '🥩', rating: '⭐ 4.7', category: '기타', subCategory: '고기', taste: '중간맛', priceRange: '고가', feature: '특별한' },
    ],
    recipe: [
      { id: 1, name: '계란 볶음밥', description: '남은 밥으로 만드는 쉽고 맛있는 요리', emoji: '🍚', rating: '⭐ 4.3', category: '밥요리', subCategory: '볶음밥', taste: '짭짤한맛', priceRange: '저가', feature: '빠르게' },
      { id: 2, name: '덮밥', description: '재료 올려서 만드는 한그릇 요리', emoji: '🍚', rating: '⭐ 4.4', category: '밥요리', subCategory: '덮밥', taste: '중간맛', priceRange: '저가', feature: '빠르게' },
      { id: 3, name: '파스타', description: '집에서 쉽게 만드는 이탈리아 요리', emoji: '🍝', rating: '⭐ 4.6', category: '면요리', subCategory: '파스타', taste: '중간맛', priceRange: '중가', feature: '빠르게' },
      { id: 4, name: '우동', description: '쫄깃한 면발', emoji: '🍜', rating: '⭐ 4.5', category: '면요리', subCategory: '우동', taste: '짭짤한맛', priceRange: '저가', feature: '따뜻한' },
      { id: 5, name: '된장국', description: '따뜻한 된장국', emoji: '🍲', rating: '⭐ 4.4', category: '스프', subCategory: '국', taste: '짭짤한맛', priceRange: '저가', feature: '건강식' },
      { id: 6, name: '계란탕', description: '계란이 들어간 수프', emoji: '🍲', rating: '⭐ 4.3', category: '스프', subCategory: '탕', taste: '순한맛', priceRange: '저가', feature: '건강식' },
      { id: 7, name: '계란말이', description: '간식으로도 반찬으로도 좋은 요리', emoji: '🥚', rating: '⭐ 4.4', category: '간식', subCategory: '계란말이', taste: '순한맛', priceRange: '저가', feature: '빠르게' },
      { id: 8, name: '팬케이크', description: '달콤한 팬케이크', emoji: '🥞', rating: '⭐ 4.6', category: '간식', subCategory: '디저트', taste: '중간맛', priceRange: '중가', feature: '특별한' },
      { id: 9, name: '주먹밥', description: '주먹밥 만들기', emoji: '🍙', rating: '⭐ 4.5', category: '간단한 요리', subCategory: '주먹밥', taste: '순한맛', priceRange: '저가', feature: '빠르게' },
      { id: 10, name: '계란 계란계란', description: '계란 요리 대전', emoji: '🥚', rating: '⭐ 4.2', category: '간단한 요리', subCategory: '계란', taste: '순한맛', priceRange: '저가', feature: '빠르게' },
    ],
  };

  const getStep1Options = () => {
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

  const getSubOptions = () => {
    const step1 = recommendations[activeTab].step1;
    if (!step1) return [];

    switch (activeTab) {
      case 'lunch':
        return lunchSubOptions[step1] || [];
      case 'dinner':
        return dinnerSubOptions[step1] || [];
      case 'recipe':
        return recipeSubOptions[step1] || [];
      default:
        return [];
    }
  };

  const getRandomFoods = (foods: FoodItem[], count: number = 3): FoodItem[] => {
    const shuffled = [...foods].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const handleGetRecommendation = () => {
    const current = recommendations[activeTab];
    if (!current.step1 || !current.step2 || !current.step3 || !current.step4 || !current.step5) {
      alert('모든 단계를 선택해주세요!');
      return;
    }

    const foods = allFoods[activeTab];
    const filteredFoods = foods.filter(
      (food) =>
        food.category === current.step1 &&
        food.subCategory === current.step2 &&
        food.taste === current.step3 &&
        food.priceRange === current.step4 &&
        food.feature === current.step5
    );
    const recommendedFoods = getRandomFoods(filteredFoods, 3);

    if (recommendedFoods.length === 0) {
      alert('해당 조건의 음식이 없습니다. 다른 선택지를 시도해주세요!');
      return;
    }

    setRecommendations((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
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
  const step1Options = getStep1Options();
  const step2Options = getSubOptions();

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
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-700 space-y-8">
            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">1️⃣ 종류</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {step1Options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setRecommendations((prev) => ({
                        ...prev,
                        [activeTab]: { ...prev[activeTab], step1: opt, step2: '', step3: '', step4: '', step5: '', recommendedFoods: [] },
                      }))
                    }
                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                      currentRecommendation.step1 === opt
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            {currentRecommendation.step1 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">2️⃣ 세부 카테고리</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {step2Options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setRecommendations((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], step2: opt, step3: '', step4: '', step5: '', recommendedFoods: [] },
                        }))
                      }
                      className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                        currentRecommendation.step2 === opt
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentRecommendation.step2 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">3️⃣ 맛</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tasteOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setRecommendations((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], step3: opt, step4: '', step5: '', recommendedFoods: [] },
                        }))
                      }
                      className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                        currentRecommendation.step3 === opt
                          ? 'bg-yellow-500 text-white shadow-lg'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentRecommendation.step3 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">4️⃣ 가격</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {priceOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setRecommendations((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], step4: opt, step5: '', recommendedFoods: [] },
                        }))
                      }
                      className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                        currentRecommendation.step4 === opt
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentRecommendation.step4 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">5️⃣ 특징</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featureOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setRecommendations((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], step5: opt, recommendedFoods: [] },
                        }))
                      }
                      className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                        currentRecommendation.step5 === opt
                          ? 'bg-pink-500 text-white shadow-lg'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* 선택 요약 */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg">
                  <p className="text-white text-sm">
                    <span className="font-semibold">선택 요약:</span> {currentRecommendation.step1} → {currentRecommendation.step2} → {currentRecommendation.step3} → {currentRecommendation.step4} → {currentRecommendation.step5}
                  </p>
                </div>

                {/* 추천받기 버튼 */}
                <button
                  onClick={handleGetRecommendation}
                  className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg"
                >
                  추천받기 🎉
                </button>
              </div>
            )}
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
