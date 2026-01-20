import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommonCodeService } from './common-code.service';

@ApiTags('Common Code')
@Controller('common-code')
export class CommonCodeController {
  constructor(private readonly commonCodeService: CommonCodeService) {}

  @Get('master/:masterCode')
  @ApiOperation({ summary: '특정 마스터 코드 정보 조회' })
  async getMasterByCode(@Param('masterCode') masterCode: string) {
    return this.commonCodeService.getMasterByCode(masterCode);
  }

  @Get(':masterCode')
  @ApiOperation({ summary: '마스터 코드로 상세 코드 조회' })
  async getCodesByMaster(@Param('masterCode') masterCode: string) {
    return this.commonCodeService.getCodesByMaster(masterCode);
  }

  @Get()
  @ApiOperation({ summary: '모든 마스터 코드 조회' })
  async getAllMasters() {
    return this.commonCodeService.getAllMasters();
  }
}
