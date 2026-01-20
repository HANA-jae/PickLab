/**
 * snake_case를 camelCase로 변환하는 유틸 함수
 */

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * 객체의 모든 키를 snake_case에서 camelCase로 변환
 */
export function transformToCamelCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => transformToCamelCase(item));
  }

  if (typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  const transformed: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = snakeToCamel(key);
      transformed[camelKey] = transformToCamelCase(obj[key]);
    }
  }

  return transformed;
}

/**
 * DB 쿼리 결과를 자동으로 camelCase로 변환
 */
export function transformDbResult(rows: any[] | any): any {
  if (!rows) {
    return rows;
  }
  return transformToCamelCase(rows);
}
