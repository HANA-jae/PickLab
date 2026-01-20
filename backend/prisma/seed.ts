import 'dotenv/config';
import { Pool } from 'pg';

// PostgreSQL 직접 연결
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  console.log('🌱 시드 데이터 생성 시작...');

  try {
    // 음식 데이터 (F001~F012)
    const foods = [
      {
        food_code: 'F001',
        food_name: '김치찌개',
        food_emoji: '🍲',
        category1: '한식',
        category2: '국/찌개',
        category3: '매운맛',
        category4: '중가',
        category5: '든든하게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F002',
        food_name: '불고기',
        food_emoji: '🥩',
        category1: '한식',
        category2: '고기',
        category3: '단맛',
        category4: '중가',
        category5: '든든하게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F003',
        food_name: '비빔밥',
        food_emoji: '🍚',
        category1: '한식',
        category2: '밥',
        category3: '순한맛',
        category4: '중가',
        category5: '건강식',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F004',
        food_name: '떡볶이',
        food_emoji: '🍢',
        category1: '한식',
        category2: '분식',
        category3: '매운맛',
        category4: '저가',
        category5: '빠르게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F005',
        food_name: '파스타',
        food_emoji: '🍝',
        category1: '양식',
        category2: '면',
        category3: '순한맛',
        category4: '중가',
        category5: '빠르게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F006',
        food_name: '스테이크',
        food_emoji: '🥩',
        category1: '양식',
        category2: '고기',
        category3: '순한맛',
        category4: '고가',
        category5: '든든하게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F007',
        food_name: '짜장면',
        food_emoji: '🍜',
        category1: '중식',
        category2: '면',
        category3: '순한맛',
        category4: '저가',
        category5: '빠르게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F008',
        food_name: '탕수육',
        food_emoji: '🍤',
        category1: '중식',
        category2: '고기',
        category3: '단맛',
        category4: '중가',
        category5: '든든하게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F009',
        food_name: '초밥',
        food_emoji: '🍣',
        category1: '일식',
        category2: '해산물',
        category3: '순한맛',
        category4: '중가',
        category5: '건강식',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F010',
        food_name: '라멘',
        food_emoji: '🍜',
        category1: '일식',
        category2: '면',
        category3: '순한맛',
        category4: '중가',
        category5: '든든하게',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F011',
        food_name: '샐러드',
        food_emoji: '🥗',
        category1: '양식',
        category2: '채소',
        category3: '순한맛',
        category4: '중가',
        category5: '건강식',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        food_code: 'F012',
        food_name: '피자',
        food_emoji: '🍕',
        category1: '양식',
        category2: '빵',
        category3: '순한맛',
        category4: '중가',
        category5: '든든하게',
        use_yn: 'Y',
        created_user: 'admin',
      },
    ];

    // 게임 데이터 (G001~G007)
    const games = [
      {
        game_code: 'G001',
        game_name: '숫자 맞추기',
        game_desc: '1~100 사이의 숫자를 맞춰보세요',
        game_emoji: '🎯',
        game_difficult: 'L',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        game_code: 'G002',
        game_name: '반응속도 테스트',
        game_desc: '화면 변화를 얼마나 빨리 감지하나요?',
        game_emoji: '⚡',
        game_difficult: 'L',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        game_code: 'G003',
        game_name: '메모리 게임',
        game_desc: '같은 카드를 찾아보세요',
        game_emoji: '🧩',
        game_difficult: 'M',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        game_code: 'G004',
        game_name: '색깔 맞추기',
        game_desc: '텍스트와 색상을 빠르게 맞춰보세요',
        game_emoji: '🎨',
        game_difficult: 'M',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        game_code: 'G005',
        game_name: '끝말잇기',
        game_desc: '컴퓨터와 끝말잇기 대결',
        game_emoji: '📝',
        game_difficult: 'M',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        game_code: 'G006',
        game_name: '주사위 게임',
        game_desc: '더 높은 숫자를 굴려보세요',
        game_emoji: '🎲',
        game_difficult: 'L',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        game_code: 'G007',
        game_name: '숫자 기억력',
        game_desc: '점점 길어지는 숫자를 기억하세요',
        game_emoji: '🔢',
        game_difficult: 'H',
        use_yn: 'Y',
        created_user: 'admin',
      },
    ];

    // 퀴즈 데이터 (Q001~Q007)
    const quizzes = [
      {
        quiz_code: 'Q001',
        quiz_name: '성격 유형 퀴즈',
        quiz_desc: '당신의 성격 유형을 알아보세요',
        quiz_emoji: '🧠',
        quiz_category: '성격',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        quiz_code: 'Q002',
        quiz_name: '지식 퀴즈',
        quiz_desc: '다양한 분야의 지식을 테스트하세요',
        quiz_emoji: '📚',
        quiz_category: '지식',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        quiz_code: 'Q003',
        quiz_name: '색상 감정 퀴즈',
        quiz_desc: '색상으로 알아보는 감정 상태',
        quiz_emoji: '🎨',
        quiz_category: '감정',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        quiz_code: 'Q004',
        quiz_name: 'IQ 퀴즈',
        quiz_desc: '논리와 패턴 인식 능력을 측정하세요',
        quiz_emoji: '🧪',
        quiz_category: '지능',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        quiz_code: 'Q005',
        quiz_name: '스트레스 지수 퀴즈',
        quiz_desc: '현재 스트레스 수준을 확인하세요',
        quiz_emoji: '😰',
        quiz_category: '감정',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        quiz_code: 'Q006',
        quiz_name: '창의성 퀴즈',
        quiz_desc: '창의적 사고력을 측정하세요',
        quiz_emoji: '💡',
        quiz_category: '지능',
        use_yn: 'Y',
        created_user: 'admin',
      },
      {
        quiz_code: 'Q007',
        quiz_name: '뇌 유형 퀴즈',
        quiz_desc: '좌뇌형인가요, 우뇌형인가요?',
        quiz_emoji: '🧬',
        quiz_category: '성격',
        use_yn: 'Y',
        created_user: 'admin',
      },
    ];

    // 음식 데이터 삽입
    for (const food of foods) {
      await pool.query(
        `INSERT INTO tbl_food_info (food_code, food_name, food_emoji, category1, category2, category3, category4, category5, use_yn, created_user)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (food_code) DO UPDATE SET
         food_name = $2, food_emoji = $3, category1 = $4, category2 = $5, category3 = $6, category4 = $7, category5 = $8, use_yn = $9, updated_user = $10, updated_date = CURRENT_TIMESTAMP`,
        [food.food_code, food.food_name, food.food_emoji, food.category1, food.category2, food.category3, food.category4, food.category5, food.use_yn, food.created_user]
      );
    }
    console.log(`✅ 음식 ${foods.length}개 생성 완료`);

    // 게임 데이터 삽입
    for (const game of games) {
      await pool.query(
        `INSERT INTO tbl_game_info (game_code, game_name, game_desc, game_emoji, game_difficult, use_yn, created_user)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (game_code) DO UPDATE SET
         game_name = $2, game_desc = $3, game_emoji = $4, game_difficult = $5, use_yn = $6, updated_user = $7, updated_date = CURRENT_TIMESTAMP`,
        [game.game_code, game.game_name, game.game_desc, game.game_emoji, game.game_difficult, game.use_yn, game.created_user]
      );
    }
    console.log(`✅ 게임 ${games.length}개 생성 완료`);

    // 퀴즈 데이터 삽입
    for (const quiz of quizzes) {
      await pool.query(
        `INSERT INTO tbl_quiz_info (quiz_code, quiz_name, quiz_desc, quiz_emoji, quiz_category, use_yn, created_user)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (quiz_code) DO UPDATE SET
         quiz_name = $2, quiz_desc = $3, quiz_emoji = $4, quiz_category = $5, use_yn = $6, updated_user = $7, updated_date = CURRENT_TIMESTAMP`,
        [quiz.quiz_code, quiz.quiz_name, quiz.quiz_desc, quiz.quiz_emoji, quiz.quiz_category, quiz.use_yn, quiz.created_user]
      );
    }
    console.log(`✅ 퀴즈 ${quizzes.length}개 생성 완료`);

    console.log('🎉 시드 데이터 생성 완료!');
  } catch (err) {
    console.error('❌ 시드 생성 중 오류:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
