import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateFoodDto, UpdateFoodDto, CreateGameDto, UpdateGameDto, CreateQuizDto, UpdateQuizDto } from './dto';

@Injectable()
export class ContentsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://pickuser:koreapicklab1%40%23@pg1101.gabiadb.com:5432/picklab',
    });
    console.log('[Contents] Pool initialized with connection string');
  }

  // Food methods
  async getAllFoods() {
    const query = `SELECT * FROM tbl_food_info ORDER BY food_code`;
    console.log('[Contents Query]', query);
    
    try {
      const result = await this.pool.query(query);
      console.log('[Contents Result] getAllFoods:', result.rows.length, 'rows');
      return result.rows;
    } catch (error) {
      console.error('[Contents Error] getAllFoods failed:', error.message);
      throw error;
    }
  }

  async getFoodByCode(code: string) {
    const query = `SELECT * FROM tbl_food_info WHERE food_code = $1`;
    console.log('[Contents Query]', query, 'Params:', [code]);
    
    try {
      const result = await this.pool.query(query, [code]);
      console.log('[Contents Result] getFoodByCode:', result.rows.length ? 'found' : 'not found');
      return result.rows[0] || null;
    } catch (error) {
      console.error('[Contents Error] getFoodByCode failed:', error.message);
      throw error;
    }
  }

  async getFoodsByCategories(categories: {
    category1?: string;
    category2?: string;
    category3?: string;
    category4?: string;
    category5?: string;
  }) {
    const conditions: string[] = ['use_yn = $1'];
    const values: any[] = ['Y'];
    let paramCount = 2;

    if (categories.category1) {
      conditions.push(`category1 = $${paramCount}`);
      values.push(categories.category1);
      paramCount++;
    }
    if (categories.category2) {
      conditions.push(`category2 = $${paramCount}`);
      values.push(categories.category2);
      paramCount++;
    }
    if (categories.category3) {
      conditions.push(`category3 = $${paramCount}`);
      values.push(categories.category3);
      paramCount++;
    }
    if (categories.category4) {
      conditions.push(`category4 = $${paramCount}`);
      values.push(categories.category4);
      paramCount++;
    }
    if (categories.category5) {
      conditions.push(`category5 = $${paramCount}`);
      values.push(categories.category5);
      paramCount++;
    }

    const query = `SELECT * FROM tbl_food_info WHERE ${conditions.join(' AND ')} ORDER BY food_code`;
    console.log('[Contents Query]', query, 'Params:', values);

    try {
      const result = await this.pool.query(query, values);
      console.log('[Contents Result] getFoodsByCategories:', result.rows.length, 'rows');
      return result.rows;
    } catch (error) {
      console.error('[Contents Error] getFoodsByCategories failed:', error.message);
      throw error;
    }
  }

  async createFood(dto: CreateFoodDto) {
    const result = await this.pool.query(
      `INSERT INTO tbl_food_info (food_code, food_name, food_emoji, category1, category2, category3, category4, category5, use_yn, created_user)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [dto.food_code, dto.food_name, dto.food_emoji, dto.category1, dto.category2, dto.category3, dto.category4, dto.category5, dto.use_yn || 'Y', dto.created_user || 'admin']
    );
    return result.rows[0];
  }

  async updateFood(code: string, dto: UpdateFoodDto) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(dto[key]);
        paramCount++;
      }
    });

    updates.push(`updated_date = CURRENT_TIMESTAMP`);
    
    values.push(code);

    const result = await this.pool.query(
      `UPDATE tbl_food_info SET ${updates.join(', ')} WHERE food_code = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteFood(code: string) {
    await this.pool.query(
      `DELETE FROM tbl_food_info WHERE food_code = $1`,
      [code]
    );
    return { success: true };
  }

  // Game methods
  async getAllGames() {
    const query = `SELECT * FROM tbl_game_info ORDER BY game_code`;
    console.log('[Contents Query]', query);
    
    try {
      const result = await this.pool.query(query);
      console.log('[Contents Result] getAllGames:', result.rows.length, 'rows');
      return result.rows;
    } catch (error) {
      console.error('[Contents Error] getAllGames failed:', error.message);
      throw error;
    }
  }

  async getGameByCode(code: string) {
    const result = await this.pool.query(
      `SELECT * FROM tbl_game_info WHERE game_code = $1`,
      [code]
    );
    return result.rows[0] || null;
  }

  async createGame(dto: CreateGameDto) {
    const result = await this.pool.query(
      `INSERT INTO tbl_game_info (game_code, game_name, game_desc, game_emoji, game_difficult, use_yn, created_user)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [dto.game_code, dto.game_name, dto.game_desc, dto.game_emoji, dto.game_difficult || 'L', dto.use_yn || 'Y', dto.created_user || 'admin']
    );
    return result.rows[0];
  }

  async updateGame(code: string, dto: UpdateGameDto) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(dto[key]);
        paramCount++;
      }
    });

    updates.push(`updated_date = CURRENT_TIMESTAMP`);
    values.push(code);

    const result = await this.pool.query(
      `UPDATE tbl_game_info SET ${updates.join(', ')} WHERE game_code = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteGame(code: string) {
    await this.pool.query(
      `DELETE FROM tbl_game_info WHERE game_code = $1`,
      [code]
    );
    return { success: true };
  }

  // Quiz methods
  async getAllQuizzes() {
    const query = `SELECT * FROM tbl_quiz_info ORDER BY quiz_code`;
    console.log('[Contents Query]', query);
    
    try {
      const result = await this.pool.query(query);
      console.log('[Contents Result] getAllQuizzes:', result.rows.length, 'rows');
      return result.rows;
    } catch (error) {
      console.error('[Contents Error] getAllQuizzes failed:', error.message);
      throw error;
    }
  }

  async getQuizByCode(code: string) {
    const result = await this.pool.query(
      `SELECT * FROM tbl_quiz_info WHERE quiz_code = $1`,
      [code]
    );
    return result.rows[0] || null;
  }

  async createQuiz(dto: CreateQuizDto) {
    const result = await this.pool.query(
      `INSERT INTO tbl_quiz_info (quiz_code, quiz_name, quiz_desc, quiz_emoji, quiz_category, use_yn, created_user)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [dto.quiz_code, dto.quiz_name, dto.quiz_desc, dto.quiz_emoji, dto.quiz_category, dto.use_yn || 'Y', dto.created_user || 'admin']
    );
    return result.rows[0];
  }

  async updateQuiz(code: string, dto: UpdateQuizDto) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(dto[key]);
        paramCount++;
      }
    });

    updates.push(`updated_date = CURRENT_TIMESTAMP`);
    values.push(code);

    const result = await this.pool.query(
      `UPDATE tbl_quiz_info SET ${updates.join(', ')} WHERE quiz_code = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteQuiz(code: string) {
    await this.pool.query(
      `DELETE FROM tbl_quiz_info WHERE quiz_code = $1`,
      [code]
    );
    return { success: true };
  }

  // Combined methods
  async getContentsByType(type: string) {
    if (type === 'food') return this.getAllFoods();
    if (type === 'game') return this.getAllGames();
    if (type === 'quiz') return this.getAllQuizzes();
    
    // Return all if type not specified
    const foods = await this.getAllFoods();
    const games = await this.getAllGames();
    const quizzes = await this.getAllQuizzes();
    
    return {
      foods,
      games,
      quizzes,
    };
  }

  async toggleContentStatus(code: string, isActive: boolean) {
    const useYn = isActive ? 'Y' : 'N';

    // Try each table
    let result = await this.pool.query(
      `UPDATE tbl_food_info SET use_yn = $1, updated_date = CURRENT_TIMESTAMP WHERE food_code = $2 RETURNING *`,
      [useYn, code]
    );
    if (result.rowCount > 0) return { type: 'food', data: result.rows[0] };

    result = await this.pool.query(
      `UPDATE tbl_game_info SET use_yn = $1, updated_date = CURRENT_TIMESTAMP WHERE game_code = $2 RETURNING *`,
      [useYn, code]
    );
    if (result.rowCount > 0) return { type: 'game', data: result.rows[0] };

    result = await this.pool.query(
      `UPDATE tbl_quiz_info SET use_yn = $1, updated_date = CURRENT_TIMESTAMP WHERE quiz_code = $2 RETURNING *`,
      [useYn, code]
    );
    if (result.rowCount > 0) return { type: 'quiz', data: result.rows[0] };

    return null;
  }
}
