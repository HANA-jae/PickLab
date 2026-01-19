import { useState, useEffect } from 'react';
import type { TabType, FoodItem } from '../../../types';
import { useMenuProperties } from '../../../hooks/useMenuProperties';

interface RecommendationState {
  step1: string; // 종류
  step2: string; // 세부
  step3: string; // 맛
  step4: string; // 가격
  step5: string; // 특징
  isHangover: boolean; // 해장 여부
  recommendedFoods: FoodItem[];
}

export default function EatHome() {
  const [activeTab, setActiveTab] = useState<TabType>('lunch');
  const [recommendations, setRecommendations] = useState<Record<TabType, RecommendationState>>({
    lunch: { step1: '', step2: '', step3: '', step4: '', step5: '', isHangover: false, recommendedFoods: [] },
    dinner: { step1: '', step2: '', step3: '', step4: '', step5: '', isHangover: false, recommendedFoods: [] },
    recipe: { step1: '', step2: '', step3: '', step4: '', step5: '', isHangover: false, recommendedFoods: [] },
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { properties } = useMenuProperties();

  // properties 변경 시 에러 초기화
  useEffect(() => {
    setErrorMessage('');
  }, [properties.updatedAt]);

  // 현재 탭의 추천 상태
  const currentRecommendation = recommendations[activeTab];

  // 탭 변경 시 현재 탭의 상태 리셋
  const handleTabChange = (tab: TabType) => {
    if (activeTab === tab) {
      // 같은 탭을 클릭했으면 상태 리셋
      setRecommendations((prev) => ({
        ...prev,
        [tab]: { step1: '', step2: '', step3: '', step4: '', step5: '', isHangover: false, recommendedFoods: [] },
      }));
      setErrorMessage('');
    } else {
      // 다른 탭으로 변경
      setActiveTab(tab);
    }
  };

  // 다른 탭으로 변경될 때
  useEffect(() => {
    setErrorMessage('');
  }, [activeTab]);
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

  // 모든 메뉴는 전역 프로퍼티에서 관리/사용
  const allFoods: Record<TabType, FoodItem[]> = properties.menus;

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
      setErrorMessage('모든 단계를 선택해주세요!');
      return;
    }

    // 프로퍼티 기반 전체 음식
    const allAvailableFoods = allFoods[activeTab];

    const filteredFoods = allAvailableFoods.filter(
      (food) =>
        food.category === current.step1 &&
        food.subCategory === current.step2 &&
        food.taste === current.step3 &&
        food.priceRange === current.step4 &&
        food.feature === current.step5
    );
    const recommendedFoods = getRandomFoods(filteredFoods, 3);

    if (recommendedFoods.length === 0) {
      setErrorMessage('해당 조건의 음식이 없습니다. 다른 선택지를 시도해주세요!');
      return;
    }

    setErrorMessage('');
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

  const step1Options = getStep1Options();
  const step2Options = getSubOptions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-800 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🍔 음식 추천
          </h1>
          <p className="text-xl text-gray-300">
            오늘은 뭐 먹을까요? 편하게 추천받아보세요!
          </p>
        </div>

        {/* 탭 버튼 */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {(['lunch', 'dinner', 'recipe'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/50 scale-105 ring-2 ring-orange-400/50'
                  : 'bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700 hover:border-gray-600'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* 선택지 섹션 */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md rounded-2xl p-8 border border-gray-600/50 shadow-2xl space-y-8">
            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">1️⃣ 종류</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {step1Options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setRecommendations((prev) => ({
                        ...prev,
                        [activeTab]: { ...prev[activeTab], step1: opt, step2: '', step3: '', step4: '', step5: '', recommendedFoods: [] },
                      }));
                      setErrorMessage('');
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                      currentRecommendation.step1 === opt
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/50 scale-105'
                        : 'bg-gray-700/50 backdrop-blur-sm text-gray-300 hover:bg-gray-600/70 hover:text-white hover:shadow-md border border-gray-600 hover:border-gray-500'
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
                <div className="flex items-end gap-2 mb-4">
                  {/* 왼쪽: 세부 카테고리 버튼들 */}
                  <div className="flex flex-wrap gap-2">
                    {step2Options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setRecommendations((prev) => ({
                            ...prev,
                            [activeTab]: { ...prev[activeTab], step2: opt, step3: '', step4: '', step5: '', isHangover: false, recommendedFoods: [] },
                          }));
                          setErrorMessage('');
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                          currentRecommendation.step2 === opt
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 ring-2 ring-green-400/50 scale-105'
                            : 'bg-gray-700/50 backdrop-blur-sm text-gray-300 hover:bg-gray-600/70 hover:text-white hover:shadow-md border border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* 바로 옆: 해장용 체크박스 */}
                  {currentRecommendation.step2 && activeTab !== 'recipe' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                      <label className={`flex items-center gap-2 cursor-pointer group px-4 py-2 rounded-lg transition-all duration-300 ${
                        currentRecommendation.isHangover === true
                          ? 'bg-orange-500/20 border border-orange-400/50 animate-bounce'
                          : 'bg-gray-700/30 border border-gray-600/50 hover:bg-gray-700/50'
                      }`}>
                        <input
                          type="checkbox"
                          checked={currentRecommendation.isHangover === true}
                          onChange={() => {
                            setRecommendations((prev) => ({
                              ...prev,
                              [activeTab]: { ...prev[activeTab], isHangover: !currentRecommendation.isHangover },
                            }));
                            setErrorMessage('');
                          }}
                          className="w-4 h-4 cursor-pointer accent-orange-400"
                        />
                        <span className={`text-sm font-semibold transition-colors duration-300 ${
                          currentRecommendation.isHangover === true
                            ? 'text-orange-300'
                            : 'text-gray-300 group-hover:text-white'
                        }`}>
                          {activeTab === 'lunch' ? '🍜 해장용이신가요?' : '🍺 안주용이신가요?'}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentRecommendation.step2 && currentRecommendation.isHangover !== undefined && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">3️⃣ 맛</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tasteOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setRecommendations((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], step3: opt, step4: '', step5: '', recommendedFoods: [] },
                        }));
                        setErrorMessage('');
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                        currentRecommendation.step3 === opt
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/50 ring-2 ring-yellow-400/50 scale-105'
                          : 'bg-gray-700/50 backdrop-blur-sm text-gray-300 hover:bg-gray-600/70 hover:text-white hover:shadow-md border border-gray-600 hover:border-gray-500'
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
                      onClick={() => {
                        setRecommendations((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], step4: opt, step5: '', recommendedFoods: [] },
                        }));
                        setErrorMessage('');
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                        currentRecommendation.step4 === opt
                          ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/50 scale-105'
                          : 'bg-gray-700/50 backdrop-blur-sm text-gray-300 hover:bg-gray-600/70 hover:text-white hover:shadow-md border border-gray-600 hover:border-gray-500'
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
                      onClick={() => {
                        setRecommendations((prev) => ({
                          ...prev,
                          [activeTab]: { ...prev[activeTab], step5: opt, recommendedFoods: [] },
                        }));
                        setErrorMessage('');
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                        currentRecommendation.step5 === opt
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50 ring-2 ring-pink-400/50 scale-105'
                          : 'bg-gray-700/50 backdrop-blur-sm text-gray-300 hover:bg-gray-600/70 hover:text-white hover:shadow-md border border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* 선택 요약 */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-xl backdrop-blur-sm shadow-lg">
                  <p className="text-white text-sm">
                    <span className="font-semibold">선택 요약:</span> {currentRecommendation.step1} → {currentRecommendation.step2} → {currentRecommendation.step3} → {currentRecommendation.step4} → {currentRecommendation.step5}
                  </p>
                </div>

                {/* 추천받기 버튼 */}
                <button
                  onClick={handleGetRecommendation}
                  className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50"
                >
                  추천받기 🎉
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 추천 결과 영역 */}
        <div className="mb-12">
          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="mb-8 p-6 bg-red-500/20 border-2 border-red-500 rounded-2xl animate-in fade-in duration-300">
              <p className="text-red-300 font-semibold text-lg">⚠️ {errorMessage}</p>
            </div>
          )}

          {/* 추천 음식 카드 그리드 */}
          {currentRecommendation.recommendedFoods.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-8 text-center">
                당신을 위한 추천 음식 🎯
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentRecommendation.recommendedFoods.map((food, index) => (
                <div
                  key={`${food.id}-${index}`}
                  className="group relative rounded-2xl bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md p-8 border border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/50 hover:border-orange-400 cursor-pointer transform hover:scale-105 hover:ring-2 hover:ring-orange-400/50"
                >
                  {/* 순위 배지 */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* 아이콘 */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg group-hover:drop-shadow-2xl">
                    {food.emoji}
                  </div>

                  {/* 음식명 */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-all duration-300">
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
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105">
                      저장
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}

          {/* 빈 상태 메시지 */}
          {currentRecommendation.recommendedFoods.length === 0 && !errorMessage && (
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
        </div>

        {/* 하단 CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm p-8 border border-orange-500/30 shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">음식 추천이 마음에 들었나요?</h2>
            <p className="text-gray-300 mb-4">친구들과 함께 추천 음식을 공유하고 함께 즐겨보세요!</p>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50">
              공유하기 🔗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
