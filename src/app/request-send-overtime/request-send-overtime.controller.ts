import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { AskPermissionToSendOvertimeDto } from './service/dto/ask-permission-to-send-overtime.dto';
import { RequestSendOvertimeService } from './service/request-send-overtime.service';

@Controller('request-send-overtime')
export class RequestSendOvertimeController {
  constructor(
    private readonly requestSendOvertimeService: RequestSendOvertimeService,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async askPermissionToSendOvertime(
    @RolesAccess([Role.professionalServices]) payload: UserPayload,
    @Body() dto: AskPermissionToSendOvertimeDto,
  ) {
    return await this.requestSendOvertimeService.askPermissionToSendOvertime(
      payload.userId,
      dto,
    );
  }
}
