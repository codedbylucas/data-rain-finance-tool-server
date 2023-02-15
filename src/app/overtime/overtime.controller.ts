import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { FindOvertimePostedInTheDayResponse } from './protocols/find-overtime-posted-in-the-day.response';
import { CreateOvertimeDto } from './service/dto/create-overtime.dto';
import { OvertimeService } from './service/overtime.service';

@Controller('overtime')
@ApiTags('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User enters the time he started working',
  })
  async createOvertime(
    @RolesAccess([Role.professionalServices])
    payload: UserPayload,
    @Body() dto: CreateOvertimeDto,
  ): Promise<void> {
    return await this.overtimeService.createOvertime(payload.userId, dto);
  }

  @Get('/status/:projectId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User enters the time he started working',
  })
  async findStatusToSendOvertime(
    @RolesAccess([Role.professionalServices])
    payload: UserPayload,
    @Param('projectId', new ParseUUIDPipe())
    projectId: string,
  ): Promise<FindOvertimePostedInTheDayResponse> {
    return await this.overtimeService.findOvertimePostedInTheDay(
      payload.userId,
      projectId,
    );
  }
}
