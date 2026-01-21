import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateFoodDto, UpdateFoodDto, CreateGameDto, UpdateGameDto, CreateQuizDto, UpdateQuizDto } from './dto';
import { transformToCamelCase } from '../common/utils/snake-to-camel.util';

@Injectable()
export class ContentsService {
  private pool: Pool;
  private commonMasterHasSortNo: boolean | null = null;
  private commonMasterHasName: boolean | null = null;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://pickuser:koreapicklab1%40%23@pg1101.gabiadb.com:5432/picklab',
    });
    console.log('[Contents] Pool initialized with connection string');
  }

  private async hasCommonMasterSortNo() {
    if (this.commonMasterHasSortNo !== null) {
      return this.commonMasterHasSortNo;
    }

    const result = await this.pool.query(
      `SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tbl_common_master' AND column_name = 'sort_no' LIMIT 1`
    );
    this.commonMasterHasSortNo = result.rows.length > 0;
    return this.commonMasterHasSortNo;
  }

  private async hasCommonMasterName() {
    if (this.commonMasterHasName !== null) {
      return this.commonMasterHasName;
    }

    const result = await this.pool.query(
      `SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tbl_common_master' AND column_name = 'master_name' LIMIT 1`
    );
    this.commonMasterHasName = result.rows.length > 0;
    return this.commonMasterHasName;
  }

  // Food methods
  async getAllFoods() {
    const query = `SELECT * FROM tbl_food_info ORDER BY food_code`;
    console.log('[Contents Query]', query);
    
    try {
      const result = await this.pool.query(query);
      console.log('[Contents Result] getAllFoods:', result.rows.length, 'rows');
      return transformToCamelCase(result.rows);
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
      return transformToCamelCase(result.rows[0]) || null;
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

  async createFood(dto: CreateFoodDto | any) {
    // 코드 자동 채번: F + max 번호
    const maxCodeResult = await this.pool.query(
      `SELECT food_code FROM tbl_food_info WHERE food_code LIKE 'F%' ORDER BY food_code DESC LIMIT 1`
    );
    
    let newCode = 'F001';
    if (maxCodeResult.rows.length > 0) {
      const maxCode = maxCodeResult.rows[0].food_code;
      const maxNum = parseInt(maxCode.substring(1));
      newCode = 'F' + String(maxNum + 1).padStart(3, '0');
    }

    // camelCase와 snake_case 모두 지원
    const foodName = dto.food_name || dto.name;
    const foodEmoji = dto.food_emoji || dto.emoji;
    const useYn = dto.use_yn || dto.useYn || 'Y';
    const createdUser = dto.created_user || dto.createdUser || 'admin';

    const result = await this.pool.query(
      `INSERT INTO tbl_food_info (food_code, food_name, food_emoji, category1, category2, category3, category4, category5, use_yn, created_user)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [newCode, foodName, foodEmoji, dto.category1, dto.category2, dto.category3, dto.category4, dto.category5, useYn, createdUser]
    );
    return transformToCamelCase(result.rows[0]);
  }

  async updateFood(code: string, dto: UpdateFoodDto | any) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // camelCase → snake_case 변환 매핑
    const fieldMap: Record<string, string> = {
      'code': 'food_code',
      'name': 'food_name',
      'emoji': 'food_emoji',
      'useYn': 'use_yn',
    };

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined && key !== 'code' && key !== 'order') { // code, order는 제외
        const dbKey = fieldMap[key] || key; // 매핑 없으면 그대로 사용 (category1-5 등)
        updates.push(`${dbKey} = $${paramCount}`);
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
      return transformToCamelCase(result.rows);
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
    return transformToCamelCase(result.rows[0]) || null;
  }

  async createGame(dto: CreateGameDto | any) {
    // 코드 자동 채번: G + max 번호
    const maxCodeResult = await this.pool.query(
      `SELECT game_code FROM tbl_game_info WHERE game_code LIKE 'G%' ORDER BY game_code DESC LIMIT 1`
    );
    
    let newCode = 'G001';
    if (maxCodeResult.rows.length > 0) {
      const maxCode = maxCodeResult.rows[0].game_code;
      const maxNum = parseInt(maxCode.substring(1));
      newCode = 'G' + String(maxNum + 1).padStart(3, '0');
    }

    // camelCase와 snake_case 모두 지원
    const gameName = dto.game_name || dto.name;
    const gameEmoji = dto.game_emoji || dto.emoji;
    const useYn = dto.use_yn || dto.useYn || 'Y';
    const createdUser = dto.created_user || dto.createdUser || 'admin';

    const result = await this.pool.query(
      `INSERT INTO tbl_game_info (game_code, game_name, game_desc, game_emoji, game_difficult, use_yn, created_user)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [newCode, gameName, dto.game_desc, gameEmoji, dto.game_difficult || 'L', useYn, createdUser]
    );
    return transformToCamelCase(result.rows[0]);
  }

  async updateGame(code: string, dto: UpdateGameDto | any) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // camelCase → snake_case 변환 매핑
    const fieldMap: Record<string, string> = {
      'code': 'game_code',
      'name': 'game_name',
      'emoji': 'game_emoji',
      'useYn': 'use_yn',
    };

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined && key !== 'code' && key !== 'order') {
        const dbKey = fieldMap[key] || key;
        updates.push(`${dbKey} = $${paramCount}`);
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
      return transformToCamelCase(result.rows);
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
    return transformToCamelCase(result.rows[0]) || null;
  }

  async createQuiz(dto: CreateQuizDto | any) {
    // 코드 자동 채번: Q + max 번호
    const maxCodeResult = await this.pool.query(
      `SELECT quiz_code FROM tbl_quiz_info WHERE quiz_code LIKE 'Q%' ORDER BY quiz_code DESC LIMIT 1`
    );
    
    let newCode = 'Q001';
    if (maxCodeResult.rows.length > 0) {
      const maxCode = maxCodeResult.rows[0].quiz_code;
      const maxNum = parseInt(maxCode.substring(1));
      newCode = 'Q' + String(maxNum + 1).padStart(3, '0');
    }

    // camelCase와 snake_case 모두 지원
    const quizName = dto.quiz_name || dto.name;
    const quizEmoji = dto.quiz_emoji || dto.emoji;
    const useYn = dto.use_yn || dto.useYn || 'Y';
    const createdUser = dto.created_user || dto.createdUser || 'admin';

    const result = await this.pool.query(
      `INSERT INTO tbl_quiz_info (quiz_code, quiz_name, quiz_desc, quiz_emoji, quiz_category, use_yn, created_user)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [newCode, quizName, dto.quiz_desc, quizEmoji, dto.quiz_category, useYn, createdUser]
    );
    return transformToCamelCase(result.rows[0]);
  }

  async updateQuiz(code: string, dto: UpdateQuizDto | any) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // camelCase → snake_case 변환 매핑
    const fieldMap: Record<string, string> = {
      'code': 'quiz_code',
      'name': 'quiz_name',
      'emoji': 'quiz_emoji',
      'useYn': 'use_yn',
    };

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined && key !== 'code' && key !== 'order') {
        const dbKey = fieldMap[key] || key;
        updates.push(`${dbKey} = $${paramCount}`);
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

  // Common Code Master methods
  async getAllCommonMasters() {
    const hasSortNo = await this.hasCommonMasterSortNo();
    const query = hasSortNo
      ? `SELECT * FROM tbl_common_master ORDER BY sort_no, master_code`
      : `SELECT * FROM tbl_common_master ORDER BY master_code`;
    console.log('[Contents Query]', query);
    
    try {
      const result = await this.pool.query(query);
      console.log('[Contents Result] getAllCommonMasters:', result.rows.length, 'rows');
      return transformToCamelCase(result.rows);
    } catch (error) {
      console.error('[Contents Error] getAllCommonMasters failed:', error.message);
      throw error;
    }
  }

  async createCommonMaster(dto: any) {
    console.log('[Contents] Creating common master:', dto);

    const { masterCode, masterName, masterDesc, useYn = 'Y', sortNo = 0 } = dto;
    const hasSortNo = await this.hasCommonMasterSortNo();
    const hasName = await this.hasCommonMasterName();

    if (hasName && !hasSortNo) {
      const result = await this.pool.query(
        `INSERT INTO tbl_common_master (master_code, master_name, master_desc, use_yn, created_user)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [masterCode, masterName, masterDesc, useYn, 'admin']
      );
      return transformToCamelCase(result.rows[0]);
    }

    if (!hasSortNo) {
      const result = await this.pool.query(
        `INSERT INTO tbl_common_master (master_code, master_desc, use_yn, created_user)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [masterCode, masterDesc, useYn, 'admin']
      );
      return transformToCamelCase(result.rows[0]);
    }

    if (hasName) {
      const result = await this.pool.query(
        `INSERT INTO tbl_common_master (master_code, master_name, master_desc, use_yn, sort_no, created_user)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [masterCode, masterName, masterDesc, useYn, sortNo, 'admin']
      );
      return transformToCamelCase(result.rows[0]);
    }

    const result = await this.pool.query(
      `INSERT INTO tbl_common_master (master_code, master_desc, use_yn, sort_no, created_user)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [masterCode, masterDesc, useYn, sortNo, 'admin']
    );
    return transformToCamelCase(result.rows[0]);
  }

  async updateCommonMaster(seq: number, dto: any) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const hasSortNo = await this.hasCommonMasterSortNo();
    const hasName = await this.hasCommonMasterName();
    const fieldMap: Record<string, string> = {
      'masterCode': 'master_code',
      ...(hasName ? { 'masterName': 'master_name' } : {}),
      'masterDesc': 'master_desc',
      'useYn': 'use_yn',
      ...(hasSortNo ? { 'sortNo': 'sort_no' } : {}),
    };

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined && key !== 'seq') {
        const dbKey = fieldMap[key];
        if (!dbKey) return;
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(dto[key]);
        paramCount++;
      }
    });

    updates.push(`updated_date = CURRENT_TIMESTAMP`);
    values.push(seq);

    const result = await this.pool.query(
      `UPDATE tbl_common_master SET ${updates.join(', ')} WHERE seq = $${paramCount} RETURNING *`,
      values
    );
    return transformToCamelCase(result.rows[0]);
  }

  async deleteCommonMaster(seq: number) {
    await this.pool.query(`DELETE FROM tbl_common_master WHERE seq = $1`, [seq]);
    return { deleted: true, seq };
  }

  // Common Code Detail methods
  async getCommonCodesByMaster(masterCode: string) {
    const query = `SELECT * FROM tbl_common_detail WHERE master_code = $1 ORDER BY sort_no, detail_code`;
    console.log('[Contents Query]', query, 'Params:', [masterCode]);
    
    try {
      const result = await this.pool.query(query, [masterCode]);
      console.log('[Contents Result] getCommonCodesByMaster:', result.rows.length, 'rows');
      return transformToCamelCase(result.rows);
    } catch (error) {
      console.error('[Contents Error] getCommonCodesByMaster failed:', error.message);
      throw error;
    }
  }

  async createCommonDetail(dto: any) {
    console.log('[Contents] Creating common detail:', dto);

    const { masterCode, detailCode, detailName, useYn = 'Y', sortNo = 0 } = dto;

    const result = await this.pool.query(
      `INSERT INTO tbl_common_detail (master_code, detail_code, detail_name, use_yn, sort_no, created_user)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [masterCode, detailCode, detailName, useYn, sortNo, 'admin']
    );
    return transformToCamelCase(result.rows[0]);
  }

  async updateCommonDetail(seq: number, dto: any) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    const seenDbKeys = new Set<string>();

    const fieldMap: Record<string, string> = {
      'masterCode': 'master_code',
      'detailCode': 'detail_code',
      'detailDesc': 'detail_name',
      'detailName': 'detail_name',
      'useYn': 'use_yn',
      'sortNo': 'sort_no',
    };

    Object.keys(dto).forEach(key => {
      if (dto[key] !== undefined && key !== 'seq') {
        const dbKey = fieldMap[key];
        if (!dbKey) return;
        if (seenDbKeys.has(dbKey)) return;
        seenDbKeys.add(dbKey);
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(dto[key]);
        paramCount++;
      }
    });

    updates.push(`updated_date = CURRENT_TIMESTAMP`);
    values.push(seq);

    const result = await this.pool.query(
      `UPDATE tbl_common_detail SET ${updates.join(', ')} WHERE seq = $${paramCount} RETURNING *`,
      values
    );
    return transformToCamelCase(result.rows[0]);
  }

  async deleteCommonDetail(seq: number) {
    await this.pool.query(
      `DELETE FROM tbl_common_detail WHERE seq = $1`,
      [seq]
    );
    return { deleted: true, seq };
  }
}
