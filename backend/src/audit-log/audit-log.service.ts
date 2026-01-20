import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AuditLogService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async log(data: {
    code: string;
    contentType: string;
    action: string;
    oldValue?: any;
    newValue?: any;
    adminName?: string;
    ipAddress: string;
    userAgent?: string;
  }) {
    try {
      await this.pool.query(
        `INSERT INTO tbl_audit_log (code, content_type, action, old_value, new_value, admin_name, ip_address, user_agent, created_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`,
        [
          data.code,
          data.contentType,
          data.action,
          data.oldValue ? JSON.stringify(data.oldValue) : null,
          data.newValue ? JSON.stringify(data.newValue) : null,
          data.adminName || 'Anonymous',
          data.ipAddress,
          data.userAgent || null,
        ]
      );
    } catch (err) {
      console.error('Failed to write audit log:', err);
      // Silently fail to not interrupt main request
    }
  }

  async getLogs(limit: number = 50, offset: number = 0) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM tbl_audit_log ORDER BY created_date DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      return [];
    }
  }

  async getLogsByCode(code: string) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM tbl_audit_log WHERE code = $1 ORDER BY created_date DESC`,
        [code]
      );
      return result.rows;
    } catch (err) {
      console.error('Failed to fetch logs by code:', err);
      return [];
    }
  }

  async deleteOldLogs(monthsOld: number = 6) {
    try {
      const result = await this.pool.query(
        `DELETE FROM tbl_audit_log WHERE created_date < NOW() - INTERVAL '${monthsOld} months'`
      );
      return { deletedCount: result.rowCount };
    } catch (err) {
      console.error('Failed to delete old logs:', err);
      return { deletedCount: 0 };
    }
  }
}
