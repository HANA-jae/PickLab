// Type definitions for PickLab
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// ---- Contents API Types (camelCase) ----
export interface Content {
  code: string;
  name: string;
  emoji?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
  useYn: string;
  order?: number;
  createdUser?: string;
  createdDate?: string;
  updatedUser?: string;
  updatedDate?: string;
}

export interface Food extends Content {
  foodCode?: string; // alias for code
  foodName?: string; // alias for name
  foodEmoji?: string; // alias for emoji
}

export interface Game extends Content {
  gameCode?: string;
  gameName?: string;
  gameEmoji?: string;
}

export interface Quiz extends Content {
  quizCode?: string;
  quizName?: string;
  quizEmoji?: string;
}

export interface CommonCode {
  masterCode: string;
  detailCode: string;
  detailName: string;
  detailOrder?: number;
  useYn?: string;
}

export interface CommonMaster {
  masterCode: string;
  masterDesc?: string;
  useYn?: string;
  sortNo?: number;
}

// ---- Menu/Properties Types (Legacy) ----
export type TabType = 'lunch' | 'dinner' | 'recipe';

export interface FoodItem {
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
  tab?: TabType; // optional: Admin 입력 시 탭 보존
}

export interface MenuProperties {
  menus: Record<TabType, FoodItem[]>;
  updatedAt: number;
}

