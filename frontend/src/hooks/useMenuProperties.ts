import { useEffect, useMemo, useRef, useState } from 'react';
import type { FoodItem, MenuProperties, TabType } from '../types';
import { ApiMenuRepository, LocalStorageMenuRepository, type MenuRepository } from '../services/menuRepository';

// 기본 메뉴(기존 추천 화면의 기본값)를 프로퍼티 초기값으로 사용
const defaultMenus: Record<TabType, FoodItem[]> = {
  lunch: [
    { id: 1, name: '김밥', description: '신선한 재료로 만든 영양 만점 김밥', emoji: '🍙', rating: '⭐ 4.5', category: '한식', subCategory: '밥', taste: '순한맛', priceRange: '저가', feature: '빠르게', tab: 'lunch' },
    { id: 2, name: '주먹밥', description: '따뜻한 손으로 만든 주먹밥', emoji: '🍙', rating: '⭐ 4.3', category: '한식', subCategory: '밥', taste: '순한맛', priceRange: '저가', feature: '빠르게', tab: 'lunch' },
    { id: 3, name: '된장국', description: '따뜻한 된장국', emoji: '🍲', rating: '⭐ 4.4', category: '한식', subCategory: '국/찌개', taste: '짭짤한맛', priceRange: '저가', feature: '건강식', tab: 'lunch' },
    { id: 4, name: '부추전', description: '바삭한 부추전', emoji: '🥞', rating: '⭐ 4.5', category: '한식', subCategory: '튀김', taste: '짭짤한맛', priceRange: '중가', feature: '푸짐한', tab: 'lunch' },
    { id: 5, name: '돈까스', description: '바삭한 튀김옷의 본연의 맛', emoji: '🍖', rating: '⭐ 4.7', category: '양식', subCategory: '고기', taste: '순한맛', priceRange: '중가', feature: '푸짐한', tab: 'lunch' },
    { id: 6, name: '파스타', description: '부드러운 크림 파스타', emoji: '🍝', rating: '⭐ 4.6', category: '양식', subCategory: '파스타', taste: '중간맛', priceRange: '중가', feature: '특별한', tab: 'lunch' },
    { id: 7, name: '짜장면', description: '깊은 맛의 중식 짜장면', emoji: '🍜', rating: '⭐ 4.4', category: '중식', subCategory: '면', taste: '짭짤한맛', priceRange: '저가', feature: '빠르게', tab: 'lunch' },
    { id: 8, name: '탕수육', description: '바삭한 탕수육', emoji: '🥡', rating: '⭐ 4.5', category: '중식', subCategory: '탕수육', taste: '중간맛', priceRange: '중가', feature: '푸짐한', tab: 'lunch' },
    { id: 9, name: '돈카츠', description: '일본식 돼지까스', emoji: '🍖', rating: '⭐ 4.6', category: '일식', subCategory: '돈카츠', taste: '순한맛', priceRange: '중가', feature: '푸짐한', tab: 'lunch' },
    { id: 10, name: '라멘', description: '깊은 국물맛의 라멘', emoji: '🍜', rating: '⭐ 4.7', category: '일식', subCategory: '우동/라멘', taste: '중간맛', priceRange: '중가', feature: '따뜻한', tab: 'lunch' },
    { id: 11, name: '아메리카노', description: '향긋한 아메리카노', emoji: '☕', rating: '⭐ 4.3', category: '카페', subCategory: '음료', taste: '상큼한맛', priceRange: '저가', feature: '가벼운', tab: 'lunch' },
    { id: 12, name: '샌드위치', description: '신선한 재료의 샌드위치', emoji: '🥪', rating: '⭐ 4.4', category: '카페', subCategory: '샌드위치', taste: '순한맛', priceRange: '중가', feature: '빠르게', tab: 'lunch' },
  ],
  dinner: [
    { id: 1, name: '삼겹살 구이', description: '고기의 참맛을 느낄 수 있는 최고의 선택', emoji: '🥩', rating: '⭐ 4.9', category: '고기', subCategory: '돼지고기', taste: '짭짤한맛', priceRange: '중가', feature: '푸짐한', tab: 'dinner' },
    { id: 2, name: '소불고기', description: '양념한 소고기의 맛', emoji: '🥩', rating: '⭐ 4.8', category: '고기', subCategory: '소고기', taste: '중간맛', priceRange: '고가', feature: '특별한', tab: 'dinner' },
    { id: 3, name: '생선까스', description: '담백한 흰살 생선의 별미', emoji: '🍤', rating: '⭐ 4.5', category: '해산물', subCategory: '생선', taste: '순한맛', priceRange: '중가', feature: '건강식', tab: 'dinner' },
    { id: 4, name: '회', description: '신선한 생선회', emoji: '🍣', rating: '⭐ 4.7', category: '해산물', subCategory: '생선', taste: '상큼한맛', priceRange: '고가', feature: '특별한', tab: 'dinner' },
    { id: 5, name: '야채볶음', description: '싱싱한 야채의 조화', emoji: '🥘', rating: '⭐ 4.4', category: '채식', subCategory: '야채', taste: '순한맛', priceRange: '저가', feature: '건강식', tab: 'dinner' },
    { id: 6, name: '두부구이', description: '부드러운 두부 구이', emoji: '🥡', rating: '⭐ 4.3', category: '채식', subCategory: '두부', taste: '순한맛', priceRange: '저가', feature: '건강식', tab: 'dinner' },
    { id: 7, name: '리조또', description: '이탈리안 리조또', emoji: '🍚', rating: '⭐ 4.6', category: '이탈리안', subCategory: '리조또', taste: '중간맛', priceRange: '중가', feature: '특별한', tab: 'dinner' },
    { id: 8, name: '오일 파스타', description: '마늘향 가득한 파스타', emoji: '🍝', rating: '⭐ 4.7', category: '이탈리안', subCategory: '파스타', taste: '중간맛', priceRange: '중가', feature: '특별한', tab: 'dinner' },
    { id: 9, name: '닭다리', description: '쫄깃한 닭다리구이', emoji: '🍗', rating: '⭐ 4.8', category: '기타', subCategory: '고기', taste: '짭짤한맛', priceRange: '저가', feature: '푸짐한', tab: 'dinner' },
    { id: 10, name: '스테이크', description: '특별한 날을 위한 프리미엄 요리', emoji: '🥩', rating: '⭐ 4.7', category: '기타', subCategory: '고기', taste: '중간맛', priceRange: '고가', feature: '특별한', tab: 'dinner' },
  ],
  recipe: [
    { id: 1, name: '계란 볶음밥', description: '남은 밥으로 만드는 쉽고 맛있는 요리', emoji: '🍚', rating: '⭐ 4.3', category: '밥요리', subCategory: '볶음밥', taste: '짭짤한맛', priceRange: '저가', feature: '빠르게', tab: 'recipe' },
    { id: 2, name: '덮밥', description: '재료 올려서 만드는 한그릇 요리', emoji: '🍚', rating: '⭐ 4.4', category: '밥요리', subCategory: '덮밥', taste: '중간맛', priceRange: '저가', feature: '빠르게', tab: 'recipe' },
    { id: 3, name: '파스타', description: '집에서 쉽게 만드는 이탈리아 요리', emoji: '🍝', rating: '⭐ 4.6', category: '면요리', subCategory: '파스타', taste: '중간맛', priceRange: '중가', feature: '빠르게', tab: 'recipe' },
    { id: 4, name: '우동', description: '쫄깃한 면발', emoji: '🍜', rating: '⭐ 4.5', category: '면요리', subCategory: '우동', taste: '짭짤한맛', priceRange: '저가', feature: '따뜻한', tab: 'recipe' },
    { id: 5, name: '된장국', description: '따뜻한 된장국', emoji: '🍲', rating: '⭐ 4.4', category: '스프', subCategory: '국', taste: '짭짤한맛', priceRange: '저가', feature: '건강식', tab: 'recipe' },
    { id: 6, name: '계란탕', description: '계란이 들어간 수프', emoji: '🍲', rating: '⭐ 4.3', category: '스프', subCategory: '탕', taste: '순한맛', priceRange: '저가', feature: '건강식', tab: 'recipe' },
    { id: 7, name: '계란말이', description: '간식으로도 반찬으로도 좋은 요리', emoji: '🥚', rating: '⭐ 4.4', category: '간식', subCategory: '계란말이', taste: '순한맛', priceRange: '저가', feature: '빠르게', tab: 'recipe' },
    { id: 8, name: '팬케이크', description: '달콤한 팬케이크', emoji: '🥞', rating: '⭐ 4.6', category: '간식', subCategory: '디저트', taste: '중간맛', priceRange: '중가', feature: '특별한', tab: 'recipe' },
    { id: 9, name: '주먹밥', description: '주먹밥 만들기', emoji: '🍙', rating: '⭐ 4.5', category: '간단한 요리', subCategory: '주먹밥', taste: '순한맛', priceRange: '저가', feature: '빠르게', tab: 'recipe' },
    { id: 10, name: '계란 계란계란', description: '계란 요리 대전', emoji: '🥚', rating: '⭐ 4.2', category: '간단한 요리', subCategory: '계란', taste: '순한맛', priceRange: '저가', feature: '빠르게', tab: 'recipe' },
  ],
};

export function useMenuProperties(options?: { repository?: MenuRepository }) {
  const [properties, setProperties] = useState<MenuProperties>({ menus: defaultMenus, updatedAt: Date.now() });
  const repoRef = useRef<MenuRepository | null>(null);

  // 저장소 선택: 옵션 우선, 그 다음 ENV로 API/로컬 결정
  useEffect(() => {
    if (!repoRef.current) {
      if (options?.repository) {
        repoRef.current = options.repository;
      } else {
        const useRemote = Boolean(import.meta.env.VITE_USE_REMOTE_MENU || import.meta.env.VITE_API_URL);
        repoRef.current = useRemote
          ? new ApiMenuRepository(defaultMenus)
          : new LocalStorageMenuRepository(defaultMenus);
      }
    }
    // 최초 로드
    (async () => {
      const loaded = await repoRef.current!.load();
      setProperties(loaded);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 변경 시 저장
  useEffect(() => {
    (async () => {
      if (repoRef.current) {
        await repoRef.current.save(properties);
      }
    })();
  }, [properties]);

  const actions = useMemo(() => {
    const addFood = (tab: TabType, item: FoodItem) => {
      setProperties((prev) => ({
        menus: { ...prev.menus, [tab]: [...prev.menus[tab], { ...item, tab }] },
        updatedAt: Date.now(),
      }));
    };

    const updateFood = (tab: TabType, id: number, partial: Partial<FoodItem>) => {
      setProperties((prev) => ({
        menus: {
          ...prev.menus,
          [tab]: prev.menus[tab].map((f) => (f.id === id ? { ...f, ...partial, tab } : f)),
        },
        updatedAt: Date.now(),
      }));
    };

    const deleteFood = (tab: TabType, id: number) => {
      setProperties((prev) => ({
        menus: { ...prev.menus, [tab]: prev.menus[tab].filter((f) => f.id !== id) },
        updatedAt: Date.now(),
      }));
    };

    const setTabMenus = (tab: TabType, items: FoodItem[]) => {
      setProperties((prev) => ({
        menus: { ...prev.menus, [tab]: items.map((i) => ({ ...i, tab })) },
        updatedAt: Date.now(),
      }));
    };

    return { addFood, updateFood, deleteFood, setTabMenus };
  }, []);

  return { properties, setProperties, ...actions };
}
