import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { FindHoursPostedInTheDayResposne } from './protocols/find-hours-posted-in-the-day.response';
import { SendTimeDto } from './service/dto/send-time.dto';
import { NormalHourService } from './service/normal-hour.service';

@Controller('normal-hour')
@ApiTags('normal-hour')
export class NormalHourController {
  constructor(private readonly normalHourService: NormalHourService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User enters the time he started working',
  })
  async sendTime(
    @RolesAccess([Role.professionalServices, Role.manager])
    payload: UserPayload,
    @Body() dto: SendTimeDto,
  ): Promise<void> {
    return await this.normalHourService.sendTime(payload.userId, dto);
  }

  @Get(':projectId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find weather status in the day',
  })
  async findWeatherStatusInTheDay(
    @RolesAccess([Role.professionalServices, Role.manager])
    payload: UserPayload,
    @Param('projectId') projectId: string,
  ): Promise<FindHoursPostedInTheDayResposne> {
    return await this.normalHourService.findHorsPostedInTheDay(
      payload.userId,
      projectId,
    );
  }
}
