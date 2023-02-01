import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
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
  ) {
    return await this.normalHourService.sendTime(payload.userId, dto.projectId);
  }
}
