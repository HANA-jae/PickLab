// Food DTO
export class CreateFoodDto {
  food_code: string;
  food_name: string;
  food_emoji?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
  use_yn?: string;
  created_user?: string;
}

export class UpdateFoodDto {
  food_name?: string;
  food_emoji?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
  use_yn?: string;
  updated_user?: string;
}

export class FoodResponseDto {
  food_code: string;
  food_name: string;
  food_emoji?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
  use_yn: string;
  created_date?: Date;
  created_user?: string;
  updated_date?: Date;
  updated_user?: string;
}

// Game DTO
export class CreateGameDto {
  game_code: string;
  game_name: string;
  game_desc?: string;
  game_emoji?: string;
  game_difficult?: string;
  use_yn?: string;
  created_user?: string;
}

export class UpdateGameDto {
  game_name?: string;
  game_desc?: string;
  game_emoji?: string;
  game_difficult?: string;
  use_yn?: string;
  updated_user?: string;
}

export class GameResponseDto {
  game_code: string;
  game_name: string;
  game_desc?: string;
  game_emoji?: string;
  game_difficult: string;
  use_yn: string;
  created_date?: Date;
  created_user?: string;
  updated_date?: Date;
  updated_user?: string;
}

// Quiz DTO
export class CreateQuizDto {
  quiz_code: string;
  quiz_name: string;
  quiz_desc?: string;
  quiz_emoji?: string;
  quiz_category?: string;
  use_yn?: string;
  created_user?: string;
}

export class UpdateQuizDto {
  quiz_name?: string;
  quiz_desc?: string;
  quiz_emoji?: string;
  quiz_category?: string;
  use_yn?: string;
  updated_user?: string;
}

export class QuizResponseDto {
  quiz_code: string;
  quiz_name: string;
  quiz_desc?: string;
  quiz_emoji?: string;
  quiz_category?: string;
  use_yn: string;
  created_date?: Date;
  created_user?: string;
  updated_date?: Date;
  updated_user?: string;
}

// Batch DTO
export interface BatchContentItem {
  type: 'food' | 'game' | 'quiz';
  data: CreateFoodDto | CreateGameDto | CreateQuizDto;
}

export class BatchContentDto {
  items: BatchContentItem[];
}
