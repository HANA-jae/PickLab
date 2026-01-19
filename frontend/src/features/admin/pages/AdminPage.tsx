import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { TabType, FoodItem } from '../../../types';
import { useMenuProperties } from '../../../hooks/useMenuProperties';

export default function AdminPage() {
  const { properties, addFood, updateFood, deleteFood, setTabMenus } = useMenuProperties();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [filterTab, setFilterTab] = useState<TabType | 'all'>('all');
  const [uploadTab, setUploadTab] = useState<TabType>('lunch');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    emoji: '',
    rating: '⭐ 4.0',
    category: '',
    subCategory: '',
    taste: '',
    priceRange: '',
    feature: '',
    tab: 'lunch',
  });

  // 프로퍼티로부터 전체 음식 불러오기 (탭 합치기)
  useEffect(() => {
    const merged = [
      ...properties.menus.lunch,
      ...properties.menus.dinner,
      ...properties.menus.recipe,
    ];
    setFoods(merged);
  }, [properties.updatedAt]);

  // 음식 추가
  const handleAddFood = () => {
    if (!formData.name || !formData.category || !formData.tab) {
      alert('필수 항목을 모두 입력해주세요!');
      return;
    }

    const newFood: FoodItem = {
      id: Date.now(),
      name: formData.name!,
      description: formData.description || '',
      emoji: formData.emoji || '🍽️',
      rating: formData.rating || '⭐ 4.0',
      category: formData.category!,
      subCategory: formData.subCategory || '',
      taste: formData.taste || '',
      priceRange: formData.priceRange || '',
      feature: formData.feature || '',
      tab: formData.tab!,
    };

    addFood(newFood.tab as TabType, newFood);
    setFoods((prev) => [...prev, newFood]);
    resetForm();
    setIsFormOpen(false);
  };

  // 음식 수정
  const handleUpdateFood = () => {
    if (!editingFood || !formData.name || !formData.category) {
      alert('필수 항목을 모두 입력해주세요!');
      return;
    }

    const updated: FoodItem = {
      ...(editingFood as FoodItem),
      ...formData,
    } as FoodItem;
    updateFood(updated.tab as TabType, updated.id, updated);
    setFoods((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    resetForm();
    setEditingFood(null);
    setIsFormOpen(false);
  };

  // 음식 삭제
  const handleDeleteFood = (id: number) => {
    if (confirm('정말 이 음식을 삭제하시겠습니까?')) {
      const target = foods.find((f) => f.id === id);
      if (target && target.tab) {
        deleteFood(target.tab as TabType, id);
      }
      setFoods((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // 수정 모드 시작
  const handleEditFood = (food: FoodItem) => {
    setEditingFood(food);
    setFormData(food);
    setIsFormOpen(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      emoji: '',
      rating: '⭐ 4.0',
      category: '',
      subCategory: '',
      taste: '',
      priceRange: '',
      feature: '',
      tab: 'lunch',
    });
    setEditingFood(null);
  };

  // 필터링된 음식 목록
  const filteredFoods = filterTab === 'all'
    ? foods
    : foods.filter((food) => food.tab === filterTab);

  // 엑셀 파일 업로드 처리
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        // 첫 번째 행은 헤더로 간주하고 건너뛰기
        const dataRows = jsonData.slice(1);
        
        const newFoods: FoodItem[] = dataRows
          .filter(row => row[0]) // 메뉴명이 있는 행만 처리
          .map((row) => ({
            id: Date.now() + Math.random(), // 고유 ID 생성
            name: String(row[0] || '').trim(), // 1열: 메뉴명
            category: String(row[1] || '').trim(), // 2열: 카테고리
            subCategory: String(row[2] || '').trim(), // 3열: 세부 카테고리
            taste: String(row[3] || '').trim(), // 4열: 맛
            priceRange: String(row[4] || '').trim(), // 5열: 가격대
            feature: String(row[5] || '').trim(), // 6열: 특징
            emoji: '🍽️', // 기본 이모지
            rating: '⭐ 4.0', // 기본 평점
            description: '', // 기본 설명
            tab: uploadTab, // 선택한 탭
          }));

        if (newFoods.length === 0) {
          alert('업로드할 데이터가 없습니다. 엑셀 파일을 확인해주세요.');
          return;
        }

        // 해당 탭에 일괄 추가 (프로퍼티)
        setTabMenus(uploadTab, [...properties.menus[uploadTab], ...newFoods]);
        setFoods((prev) => [...prev, ...newFoods]);
        alert(`${newFoods.length}개의 음식이 추가되었습니다!`);
        
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Excel upload error:', error);
        alert('엑셀 파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-800 to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🔧 관리자 페이지
          </h1>
          <p className="text-xl text-gray-300">음식 메뉴를 추가하고 관리하세요</p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/30"
          >
            + 새 음식 추가
          </button>

          {/* 탭 필터 */}
          <div className="flex gap-2">
            {['all', 'lunch', 'dinner', 'recipe'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab as TabType | 'all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filterTab === tab
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {tab === 'all' ? '전체' : tab === 'lunch' ? '점심' : tab === 'dinner' ? '저녁' : '요리'}
              </button>
            ))}
          </div>
        </div>

        {/* 엑셀 업로드 섹션 */}
        <div className="mb-8 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                📊 엑셀 파일로 일괄 업로드
              </h3>
              <p className="text-sm text-gray-300 mb-2">
                엑셀 파일의 6개 컬럼을 사용합니다:
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• <span className="font-semibold text-green-300">1열</span>: 메뉴명</p>
                <p>• <span className="font-semibold text-green-300">2열</span>: 카테고리 (한식, 양식 등)</p>
                <p>• <span className="font-semibold text-green-300">3열</span>: 세부 카테고리 (국/찌개, 밥 등)</p>
                <p>• <span className="font-semibold text-green-300">4열</span>: 맛 (순한맛, 매운맛 등)</p>
                <p>• <span className="font-semibold text-green-300">5열</span>: 가격대 (저가, 중가, 고가)</p>
                <p>• <span className="font-semibold text-green-300">6열</span>: 특징 (빠르게, 건강식 등)</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              {/* 탭 선택 */}
              <div className="flex gap-2">
                {['lunch', 'dinner', 'recipe'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setUploadTab(tab as TabType)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      uploadTab === tab
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {tab === 'lunch' ? '점심' : tab === 'dinner' ? '저녁' : '요리'}
                  </button>
                ))}
              </div>

              {/* 파일 업로드 버튼 */}
              <label className="cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <div className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-center">
                  📁 엑셀 파일 선택
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 음식 추가/수정 폼 */}
        {isFormOpen && (
          <div className="mb-8 bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md rounded-2xl p-8 border border-gray-600/50 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingFood ? '음식 수정' : '새 음식 추가'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 탭 선택 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  탭 <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.tab}
                  onChange={(e) => setFormData({ ...formData, tab: e.target.value as TabType })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="lunch">점심</option>
                  <option value="dinner">저녁</option>
                  <option value="recipe">요리</option>
                </select>
              </div>

              {/* 음식 이름 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  음식 이름 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="예: 김치찌개"
                />
              </div>

              {/* 이모지 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  이모지
                </label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="🍲"
                />
              </div>

              {/* 평점 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  평점
                </label>
                <input
                  type="text"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="⭐ 4.5"
                />
              </div>

              {/* 카테고리 (종류) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  카테고리 (종류) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="예: 한식, 양식, 중식"
                />
              </div>

              {/* 세부 카테고리 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  세부 카테고리
                </label>
                <input
                  type="text"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="예: 국/찌개, 밥"
                />
              </div>

              {/* 맛 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  맛
                </label>
                <input
                  type="text"
                  value={formData.taste}
                  onChange={(e) => setFormData({ ...formData, taste: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="예: 순한맛, 매운맛"
                />
              </div>

              {/* 가격대 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  가격대
                </label>
                <input
                  type="text"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="예: 저가, 중가, 고가"
                />
              </div>

              {/* 특징 */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  특징
                </label>
                <input
                  type="text"
                  value={formData.feature}
                  onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  placeholder="예: 빠르게, 건강식"
                />
              </div>

              {/* 설명 (전체 너비) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                  rows={3}
                  placeholder="음식에 대한 설명을 입력하세요"
                />
              </div>
            </div>

            {/* 폼 액션 버튼 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={editingFood ? handleUpdateFood : handleAddFood}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {editingFood ? '수정하기' : '추가하기'}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 음식 목록 */}
        <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-700/90 backdrop-blur-md rounded-2xl p-8 border border-gray-600/50 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            등록된 음식 ({filteredFoods.length}개)
          </h2>

          {filteredFoods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">등록된 음식이 없습니다.</p>
              <p className="text-gray-500 mt-2">새 음식을 추가해주세요!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">이모지</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">이름</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">탭</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">카테고리</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">평점</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map((food) => (
                    <tr key={food.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-4 text-2xl">{food.emoji}</td>
                      <td className="py-3 px-4 text-white font-medium">{food.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          food.tab === 'lunch' ? 'bg-blue-500/20 text-blue-300' :
                          food.tab === 'dinner' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {food.tab === 'lunch' ? '점심' : food.tab === 'dinner' ? '저녁' : '요리'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{food.category}</td>
                      <td className="py-3 px-4 text-yellow-400">{food.rating}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditFood(food)}
                            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-all"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteFood(food.id)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-all"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 도움말 */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 사용 방법</h3>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>• 관리자가 추가한 음식은 자동으로 사용자 페이지에 반영됩니다</li>
            <li>• 카테고리는 EatHome의 선택지와 일치해야 추천에 포함됩니다</li>
            <li>• 데이터는 브라우저의 localStorage에 저장됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
