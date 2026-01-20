import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentsService } from './contents.service';
import { CreateFoodDto, UpdateFoodDto, CreateGameDto, UpdateGameDto, CreateQuizDto, UpdateQuizDto, BatchContentDto } from './dto';

@ApiTags('Contents')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  // Food endpoints
  @Get('food')
  @ApiOperation({ summary: '모든 음식 조회' })
  async getAllFoods() {
    return this.contentsService.getAllFoods();
  }

  @Get('food/search/by-categories')
  @ApiOperation({ summary: '카테고리 조건으로 음식 검색' })
  async getFoodsByCategories(
    @Query('category1') category1?: string,
    @Query('category2') category2?: string,
    @Query('category3') category3?: string,
    @Query('category4') category4?: string,
    @Query('category5') category5?: string,
  ) {
    return this.contentsService.getFoodsByCategories({
      category1,
      category2,
      category3,
      category4,
      category5,
    });
  }

  @Get('food/:code')
  @ApiOperation({ summary: '음식 상세 조회' })
  async getFoodByCode(@Param('code') code: string) {
    return this.contentsService.getFoodByCode(code);
  }

  @Post('food')
  @ApiOperation({ summary: '음식 추가' })
  async createFood(@Body() dto: CreateFoodDto) {
    return this.contentsService.createFood(dto);
  }

  @Patch('food/:code')
  @ApiOperation({ summary: '음식 수정' })
  async updateFood(@Param('code') code: string, @Body() dto: UpdateFoodDto) {
    return this.contentsService.updateFood(code, dto);
  }

  @Delete('food/:code')
  @ApiOperation({ summary: '음식 삭제' })
  async deleteFood(@Param('code') code: string) {
    return this.contentsService.deleteFood(code);
  }

  // Game endpoints
  @Get('game')
  @ApiOperation({ summary: '모든 게임 조회' })
  async getAllGames() {
    return this.contentsService.getAllGames();
  }

  @Get('game/:code')
  @ApiOperation({ summary: '게임 상세 조회' })
  async getGameByCode(@Param('code') code: string) {
    return this.contentsService.getGameByCode(code);
  }

  @Post('game')
  @ApiOperation({ summary: '게임 추가' })
  async createGame(@Body() dto: CreateGameDto) {
    return this.contentsService.createGame(dto);
  }

  @Patch('game/:code')
  @ApiOperation({ summary: '게임 수정' })
  async updateGame(@Param('code') code: string, @Body() dto: UpdateGameDto) {
    return this.contentsService.updateGame(code, dto);
  }

  @Delete('game/:code')
  @ApiOperation({ summary: '게임 삭제' })
  async deleteGame(@Param('code') code: string) {
    return this.contentsService.deleteGame(code);
  }

  // Quiz endpoints
  @Get('quiz')
  @ApiOperation({ summary: '모든 퀴즈 조회' })
  async getAllQuizzes() {
    return this.contentsService.getAllQuizzes();
  }

  @Get('quiz/:code')
  @ApiOperation({ summary: '퀴즈 상세 조회' })
  async getQuizByCode(@Param('code') code: string) {
    return this.contentsService.getQuizByCode(code);
  }

  @Post('quiz')
  @ApiOperation({ summary: '퀴즈 추가' })
  async createQuiz(@Body() dto: CreateQuizDto) {
    return this.contentsService.createQuiz(dto);
  }

  @Patch('quiz/:code')
  @ApiOperation({ summary: '퀴즈 수정' })
  async updateQuiz(@Param('code') code: string, @Body() dto: UpdateQuizDto) {
    return this.contentsService.updateQuiz(code, dto);
  }

  @Delete('quiz/:code')
  @ApiOperation({ summary: '퀴즈 삭제' })
  async deleteQuiz(@Param('code') code: string) {
    return this.contentsService.deleteQuiz(code);
  }

  // Combined endpoints
  @Get()
  @ApiOperation({ summary: '콘텐츠 타입별 조회' })
  async getContentsByType(@Query('type') type?: string) {
    return this.contentsService.getContentsByType(type || '');
  }

  @Patch(':code/status')
  @ApiOperation({ summary: '콘텐츠 활성화 상태 변경' })
  async toggleStatus(
    @Param('code') code: string,
    @Body() body: { isActive: boolean }
  ) {
    return this.contentsService.toggleContentStatus(code, body.isActive);
  }

  @Post('batch')
  @ApiOperation({ summary: '배치 처리 (최대 100건)' })
  async batchUpsert(@Body() dto: BatchContentDto) {
    if (!dto.items || dto.items.length === 0) {
      return { message: 'No items to process' };
    }

    if (dto.items.length > 100) {
      return { error: 'Maximum 100 items per batch' };
    }

    const results: any[] = [];

    for (const item of dto.items) {
      try {
        let result;
        if (item.type === 'food') {
          const data = item.data as CreateFoodDto;
          const existing = await this.contentsService.getFoodByCode(data.food_code);
          result = existing
            ? await this.contentsService.updateFood(data.food_code, data)
            : await this.contentsService.createFood(data);
        } else if (item.type === 'game') {
          const data = item.data as CreateGameDto;
          const existing = await this.contentsService.getGameByCode(data.game_code);
          result = existing
            ? await this.contentsService.updateGame(data.game_code, data)
            : await this.contentsService.createGame(data);
        } else if (item.type === 'quiz') {
          const data = item.data as CreateQuizDto;
          const existing = await this.contentsService.getQuizByCode(data.quiz_code);
          result = existing
            ? await this.contentsService.updateQuiz(data.quiz_code, data)
            : await this.contentsService.createQuiz(data);
        }
        results.push({ type: item.type, status: 'success', data: result });
      } catch (err) {
        results.push({ type: item.type, status: 'error', error: err.message });
      }
    }

    return { processedCount: results.length, results };
  }
}
