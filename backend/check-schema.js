require('dotenv').config();
const { Client } = require('pg');

const c = new Client({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    await c.connect();
    
    // 테이블 목록
    console.log('=== Tables ===');
    const tablesRes = await c.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log(tablesRes.rows.map(t => t.table_name));
    
    // 각 테이블 컬럼 정보
    console.log('\n=== Table Columns ===');
    const colRes = await c.query(
      "SELECT table_name, column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position"
    );
    
    let currentTable = '';
    colRes.rows.forEach(col => {
      if (col.table_name !== currentTable) {
        console.log(`\n${col.table_name}:`);
        currentTable = col.table_name;
      }
      console.log(`  ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`);
    });
    
    await c.end();
  } catch (err) {
    console.error('Error:', err);
  }
})();
