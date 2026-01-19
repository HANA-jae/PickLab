import { apiService } from './api';
import type { MenuProperties, TabType, FoodItem } from '../types';

export interface MenuRepository {
  load(): Promise<MenuProperties>;
  save(props: MenuProperties): Promise<void>;
}

const LOCAL_STORAGE_KEY = 'menuProperties';

export class LocalStorageMenuRepository implements MenuRepository {
  private defaultMenus: Record<TabType, FoodItem[]>;
  constructor(defaultMenus: Record<TabType, FoodItem[]>) {
    this.defaultMenus = defaultMenus;
  }

  async load(): Promise<MenuProperties> {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed: MenuProperties = JSON.parse(raw);
        return {
          menus: {
            lunch: parsed.menus?.lunch ?? this.defaultMenus.lunch,
            dinner: parsed.menus?.dinner ?? this.defaultMenus.dinner,
            recipe: parsed.menus?.recipe ?? this.defaultMenus.recipe,
          },
          updatedAt: parsed.updatedAt ?? Date.now(),
        };
      }
    } catch (e) {
      console.warn('LocalStorage load failed, using defaults.', e);
    }
    return { menus: this.defaultMenus, updatedAt: Date.now() };
  }

  async save(props: MenuProperties): Promise<void> {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(props));
    } catch (e) {
      console.warn('LocalStorage save failed.', e);
    }
  }
}

export class ApiMenuRepository implements MenuRepository {
  private defaultMenus: Record<TabType, FoodItem[]>;
  constructor(defaultMenus: Record<TabType, FoodItem[]>) {
    this.defaultMenus = defaultMenus;
  }

  async load(): Promise<MenuProperties> {
    try {
      const res = await apiService.get<MenuProperties>('/menu-properties');
      // 병합 및 기본값 보정
      return {
        menus: {
          lunch: res.menus?.lunch ?? this.defaultMenus.lunch,
          dinner: res.menus?.dinner ?? this.defaultMenus.dinner,
          recipe: res.menus?.recipe ?? this.defaultMenus.recipe,
        },
        updatedAt: res.updatedAt ?? Date.now(),
      };
    } catch (e) {
      console.warn('API load failed, fallback to local defaults.', e);
      return { menus: this.defaultMenus, updatedAt: Date.now() };
    }
  }

  async save(props: MenuProperties): Promise<void> {
    try {
      await apiService.put<MenuProperties>('/menu-properties', props);
    } catch (e) {
      console.warn('API save failed, changes kept locally only until sync.', e);
      // 실패 시에도 함수 자체는 throw하지 않도록 설계 (UI 연속성)
    }
  }
}
