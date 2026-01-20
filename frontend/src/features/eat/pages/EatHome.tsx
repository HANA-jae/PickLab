import { useState, useEffect } from 'react';
import { contentsApi } from '../../../services/api';
import { Food, CommonCode, CommonMaster } from '../../../types';

export default function EatHome() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [recommendedFood, setRecommendedFood] = useState<Food | null>(null);
  const [noResultMessage, setNoResultMessage] = useState<boolean>(false);
  
  // 카테고리 필터 상태
  const [categories1, setCategories1] = useState<CommonCode[]>([]);
  const [categories2, setCategories2] = useState<CommonCode[]>([]);
  const [categories3, setCategories3] = useState<CommonCode[]>([]);
  const [categories4, setCategories4] = useState<CommonCode[]>([]);
  const [categories5, setCategories5] = useState<CommonCode[]>([]);
  
  const [selectedCategory1, setSelectedCategory1] = useState<string | null>(null);
  const [selectedCategory2, setSelectedCategory2] = useState<string | null>(null);
  const [selectedCategory3, setSelectedCategory3] = useState<string | null>(null);
  const [selectedCategory4, setSelectedCategory4] = useState<string | null>(null);
  const [selectedCategory5, setSelectedCategory5] = useState<string | null>(null);

  // 카테고리 메타 정보 (masterDesc 사용)
  const [category1Title, setCategory1Title] = useState<string>('카테고리 1');
  const [category2Title, setCategory2Title] = useState<string>('카테고리 2');
  const [category3Title, setCategory3Title] = useState<string>('카테고리 3');
  const [category4Title, setCategory4Title] = useState<string>('카테고리 4');
  const [category5Title, setCategory5Title] = useState<string>('카테고리 5');

  // 초기 데이터 로드 (카테고리만)
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // Category 1과 master 정보 로드
      const [cat1Data, masterData] = await Promise.all([
        contentsApi.getCommonCodes('CATEGORY1'),
        contentsApi.getCommonMaster('CATEGORY1')
      ]);
      setCategories1(cat1Data as CommonCode[]);
      if (masterData && (masterData as CommonMaster).masterDesc) {
        setCategory1Title((masterData as CommonMaster).masterDesc!);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // Category 1 선택 시 음식 로드, 하위 카테고리 초기화
  useEffect(() => {
    if (selectedCategory1) {
      setLoading(true);
      loadFoods();
    } else {
      setFoods([]);
      setCategories2([]);
      setSelectedCategory2(null);
      setCategories3([]);
      setSelectedCategory3(null);
      setCategories4([]);
      setSelectedCategory4(null);
      setCategories5([]);
      setSelectedCategory5(null);
    }
  }, [selectedCategory1]);

  // Category 2 선택 해제 시 하위 카테고리 초기화
  useEffect(() => {
    if (!selectedCategory2) {
      setSelectedCategory3(null);
      setSelectedCategory4(null);
      setSelectedCategory5(null);
    }
  }, [selectedCategory2]);

  // Category 3 선택 해제 시 하위 카테고리 초기화
  useEffect(() => {
    if (!selectedCategory3) {
      setSelectedCategory4(null);
      setSelectedCategory5(null);
    }
  }, [selectedCategory3]);

  // Category 4 선택 해제 시 하위 카테고리 초기화
  useEffect(() => {
    if (!selectedCategory4) {
      setSelectedCategory5(null);
    }
  }, [selectedCategory4]);

  // 카테고리 선택 변경 시 추천 결과 초기화
  useEffect(() => {
    setRecommendedFood(null);
    setNoResultMessage(false);
  }, [selectedCategory1, selectedCategory2, selectedCategory3, selectedCategory4, selectedCategory5]);

  const loadFoods = async () => {
    try {
      const response = await contentsApi.getFoods();
      // 사용 중인 음식만 필터링하고 order 순으로 정렬
      const activeFoods = (response as Food[])
        .filter(f => f.useYn === 'Y')
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setFoods(activeFoods);
      // 음식 로드 후 모든 카테고리 로드
      await loadAllCategories(activeFoods);
    } catch (error) {
      console.error('Failed to load foods:', error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllCategories = async (foodsList: Food[]) => {
    try {
      // 모든 카테고리 데이터를 병렬로 로드
      const [
        [cat2Data, master2Data],
        [cat3Data, master3Data],
        [cat4Data, master4Data],
        [cat5Data, master5Data]
      ] = await Promise.all([
        Promise.all([contentsApi.getCommonCodes('CATEGORY2'), contentsApi.getCommonMaster('CATEGORY2')]),
        Promise.all([contentsApi.getCommonCodes('CATEGORY3'), contentsApi.getCommonMaster('CATEGORY3')]),
        Promise.all([contentsApi.getCommonCodes('CATEGORY4'), contentsApi.getCommonMaster('CATEGORY4')]),
        Promise.all([contentsApi.getCommonCodes('CATEGORY5'), contentsApi.getCommonMaster('CATEGORY5')])
      ]);

      // Category 2: DB에 정의된 모든 코드 그대로 표시
      setCategories2(cat2Data as CommonCode[]);
      if (master2Data && (master2Data as CommonMaster).masterDesc) {
        setCategory2Title((master2Data as CommonMaster).masterDesc!);
      }

      // Category 3: DB에 정의된 모든 코드 그대로 표시
      setCategories3(cat3Data as CommonCode[]);
      if (master3Data && (master3Data as CommonMaster).masterDesc) {
        setCategory3Title((master3Data as CommonMaster).masterDesc!);
      }

      // Category 4: DB에 정의된 모든 코드 그대로 표시
      setCategories4(cat4Data as CommonCode[]);
      if (master4Data && (master4Data as CommonMaster).masterDesc) {
        setCategory4Title((master4Data as CommonMaster).masterDesc!);
      }

      // Category 5: DB에 정의된 모든 코드 그대로 표시
      setCategories5(cat5Data as CommonCode[]);
      if (master5Data && (master5Data as CommonMaster).masterDesc) {
        setCategory5Title((master5Data as CommonMaster).masterDesc!);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // 필터링된 음식 목록
  const filteredFoods = foods.filter(food => {
    if (selectedCategory1 && food.category1 !== selectedCategory1) return false;
    if (selectedCategory2 && food.category2 !== selectedCategory2) return false;
    if (selectedCategory3 && food.category3 !== selectedCategory3) return false;
    if (selectedCategory4 && food.category4 !== selectedCategory4) return false;
    if (selectedCategory5 && food.category5 !== selectedCategory5) return false;
    return true;
  });

  // 전체 보기 (필터 초기화)
  const resetFilters = () => {
    setSelectedCategory1(null);
    setSelectedCategory2(null);
    setSelectedCategory3(null);
    setSelectedCategory4(null);
    setSelectedCategory5(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 타이틀 */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-6xl font-black tracking-tight mb-3" style={{ fontFamily: '"Noto Sans KR", sans-serif', letterSpacing: '-0.02em' }}>
              <span className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-clip-text text-transparent drop-shadow-lg">
                오늘은 뭐 먹을까?
              </span>
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-slate-400 text-lg mt-4">당신의 취향을 선택하면 완벽한 메뉴를 추천해드릴게요</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">음식 목록을 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 카테고리 필터 */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">{'>'}</span>
                  카테고리 선택
                </h2>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  ✕ 초기화
                </button>
              </div>

              {/* Category 1 */}
              {categories1.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">{category1Title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {categories1.filter(c => c.useYn === 'Y').map(cat => (
                      <button
                        key={cat.detailCode}
                        onClick={() => setSelectedCategory1(
                          selectedCategory1 === cat.detailCode ? null : cat.detailCode
                        )}
                        className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                          selectedCategory1 === cat.detailCode
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white scale-105 shadow-amber-500/50'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/70 hover:scale-105'
                        }`}
                      >
                        {cat.detailName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category 2 (Category 1 선택 시에만 표시) */}
              {selectedCategory1 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    {category2Title} {categories2.length === 0 && <span className="text-gray-500">(옵션 없음)</span>}
                  </h3>
                  {categories2.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories2.filter(c => c.useYn === 'Y').map(cat => (
                        <button
                          key={cat.detailCode}
                          onClick={() => setSelectedCategory2(
                            selectedCategory2 === cat.detailCode ? null : cat.detailCode
                          )}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory2 === cat.detailCode
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {cat.detailName}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">선택 가능한 옵션이 없습니다</p>
                  )}
                </div>
              )}

              {/* Category 3 (Category 2 선택 시에만 표시) */}
              {selectedCategory2 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    {category3Title} {categories3.length === 0 && <span className="text-gray-500">(옵션 없음)</span>}
                  </h3>
                  {categories3.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories3.filter(c => c.useYn === 'Y').map(cat => (
                        <button
                          key={cat.detailCode}
                          onClick={() => setSelectedCategory3(
                            selectedCategory3 === cat.detailCode ? null : cat.detailCode
                          )}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory3 === cat.detailCode
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {cat.detailName}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">선택 가능한 옵션이 없습니다</p>
                  )}
                </div>
              )}

              {/* Category 4 (Category 3 선택 시에만 표시) */}
              {selectedCategory3 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    {category4Title} {categories4.length === 0 && <span className="text-gray-500">(옵션 없음)</span>}
                  </h3>
                  {categories4.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories4.filter(c => c.useYn === 'Y').map(cat => (
                        <button
                          key={cat.detailCode}
                          onClick={() => setSelectedCategory4(
                            selectedCategory4 === cat.detailCode ? null : cat.detailCode
                          )}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory4 === cat.detailCode
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {cat.detailName}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">선택 가능한 옵션이 없습니다</p>
                  )}
                </div>
              )}

              {/* Category 5 (Category 4 선택 시에만 표시) */}
              {selectedCategory4 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">
                    {category5Title} {categories5.length === 0 && <span className="text-gray-500">(옵션 없음)</span>}
                  </h3>
                  {categories5.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {categories5.filter(c => c.useYn === 'Y').map(cat => (
                        <button
                          key={cat.detailCode}
                          onClick={() => setSelectedCategory5(
                            selectedCategory5 === cat.detailCode ? null : cat.detailCode
                          )}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory5 === cat.detailCode
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {cat.detailName}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">선택 가능한 옵션이 없습니다</p>
                  )}
                </div>
              )}
            </div>

            {/* 추천받기 버튼 (5레벨까지 선택 시) */}
            {selectedCategory5 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      setRecommendedFood(null);
                      setNoResultMessage(false);
                      
                      // 카테고리 조건으로 DB에서 검색
                      const result = await contentsApi.getFoodsByCategories({
                        category1: selectedCategory1 || undefined,
                        category2: selectedCategory2 || undefined,
                        category3: selectedCategory3 || undefined,
                        category4: selectedCategory4 || undefined,
                        category5: selectedCategory5 || undefined,
                      });
                      
                      const foods = result as Food[];
                      if (foods.length > 0) {
                        // 랜덤으로 하나 선택
                        const randomFood = foods[Math.floor(Math.random() * foods.length)];
                        setRecommendedFood(randomFood);
                      } else {
                        setNoResultMessage(true);
                      }
                    } catch (error) {
                      console.error('Failed to get food recommendation:', error);
                      setNoResultMessage(true);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="group relative px-12 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-white font-bold text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 animate-bounce overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-3xl">🎲</span>
                    음식 추천받기!
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </button>
              </div>
            )}

            {/* 추천 결과 표시 */}
            {noResultMessage && (
              <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-2xl font-bold text-white mb-3">죄송해요ㅠ.ㅠ</h3>
                <p className="text-lg text-gray-300 mb-4">결과를 찾지 못했어요.</p>
                <p className="text-base text-gray-400">혹시 어떤 요리를 기대했는지 저희에게 알려주실 수 있을까요?</p>
              </div>
            )}

            {recommendedFood && (
              <div className="mt-12 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-rose-900/20 backdrop-blur-xl border-2 border-amber-500/50 rounded-3xl p-12 text-center shadow-2xl animate-fade-in">
                <div className="inline-block animate-shake-pause">
                  <div className="text-9xl mb-8 drop-shadow-2xl">{recommendedFood.emoji || '🍽️'}</div>
                </div>
                <div className="inline-block mb-6">
                  <h3 className="text-4xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                    오늘의 추천 메뉴
                  </h3>
                  <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full mt-2"></div>
                </div>
                <h2 className="text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">{recommendedFood.foodName}</h2>
                <p className="text-gray-400 text-lg">맛있게 드세요! 😋</p>
              </div>
            )}

            {/* 음식 상세 정보 모달 */}
            {selectedFood && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedFood(null)}
              >
                <div
                  className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-6xl mb-4 text-center">{selectedFood.emoji || '🍽️'}</div>
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedFood.name}</h2>
                  
                  <div className="space-y-2 mb-6">
                    {selectedFood.code && (
                      <p className="text-sm text-gray-400">
                        <span className="text-gray-500">코드:</span> {selectedFood.code}
                      </p>
                    )}
                    {selectedFood.category1 && (
                      <p className="text-sm text-gray-400">
                        <span className="text-gray-500">카테고리:</span> {selectedFood.category1}
                      </p>
                    )}
                    {selectedFood.category2 && (
                      <p className="text-sm text-gray-400">
                        <span className="text-gray-500">세부:</span> {selectedFood.category2}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedFood(null)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
