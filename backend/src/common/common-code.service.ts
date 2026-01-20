import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CommonCodeService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://pickuser:koreapicklab1%40%23@pg1101.gabiadb.com:5432/picklab',
    });
    console.log('[CommonCode] Pool initialized with connection string');
  }

  /**
   * 특정 마스터 코드에 해당하는 상세 코드 조회
   * @param masterCode - 마스터 코드 (예: 'CATEGORY1', 'CATEGORY2', ...)
   */
  async getCodesByMaster(masterCode: string) {
    const query = `SELECT * FROM tbl_common_detail WHERE master_code = $1 ORDER BY sort_no`;
    console.log('[CommonCode Query]', query, 'Params:', [masterCode]);
    
    try {
      const result = await this.pool.query(query, [masterCode]);
      console.log('[CommonCode Result]', `Found ${result.rows.length} rows`);
      return result.rows;
    } catch (error) {
      console.error('[CommonCode Error] getCodesByMaster failed:', error.message);
      throw error;
    }
  }

  /**
   * 모든 마스터 코드 조회
   */
  async getAllMasters() {
    const query = `SELECT * FROM tbl_common_master ORDER BY master_code`;
    console.log('[CommonCode Query]', query);
    
    try {
      const result = await this.pool.query(query);
      console.log('[CommonCode Result]', `Found ${result.rows.length} rows`);
      return result.rows;
    } catch (error) {
      console.error('[CommonCode Error] getAllMasters failed:', error.message);
      throw error;
    }
  }

  /**
   * 특정 마스터 코드 정보 조회
   * @param masterCode - 마스터 코드
   */
  async getMasterByCode(masterCode: string) {
    const query = `SELECT * FROM tbl_common_master WHERE master_code = $1`;
    console.log('[CommonCode Query]', query, 'Params:', [masterCode]);
    
    try {
      const result = await this.pool.query(query, [masterCode]);
      console.log('[CommonCode Result] getMasterByCode:', result.rows.length ? 'found' : 'not found');
      return result.rows[0] || null;
    } catch (error) {
      console.error('[CommonCode Error] getMasterByCode failed:', error.message);
      throw error;
    }
  }
}
