import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApprovalStatus } from '@prisma/client';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { AprroveAndReproveRequestSendOvertimeDto } from './service/dto/aprrove-and-reprove-request-send-overtime.dto';
import { AskPermissionToSendOvertimeDto } from './service/dto/ask-permission-to-send-overtime.dto';
import { RequestSendOvertimeService } from './service/request-send-overtime.service';

@Controller('request-send-overtime')
@ApiTags('request-send-overtime')
export class RequestSendOvertimeController {
  constructor(
    private readonly requestSendOvertimeService: RequestSendOvertimeService,
  ) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create an order to be able to send overtime',
  })
  async askPermissionToSendOvertime(
    @RolesAccess([Role.professionalServices]) payload: UserPayload,
    @Body() dto: AskPermissionToSendOvertimeDto,
  ) {
    return await this.requestSendOvertimeService.askPermissionToSendOvertime(
      payload.userId,
      dto,
    );
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Fetch all requests to post overtime on projects that the manager is',
  })
  async findAllRequestSendOvertimeByManagerId(
    @RolesAccess([Role.manager, Role.admin]) payload: UserPayload,
  ) {
    return await this.requestSendOvertimeService.findAllRequestSendOvertimeByManagerId(
      payload.userId,
    );
  }

  @Post('approve')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Approve request send overtime',
  })
  async approveRequestSendOvertime(
    @RolesAccess([Role.manager]) payload: UserPayload,
    @Body() dto: AprroveAndReproveRequestSendOvertimeDto,
  ) {
    return await this.requestSendOvertimeService.changeStatusOfRequestSendOvertime(
      dto.requestSendOvertimeId,
      { approvalSatus: ApprovalStatus.approved, authorizationDate: new Date() },
    );
  }

  @Post('reprove')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reprove request send overtime',
  })
  async reproveRequestSendOvertime(
    @RolesAccess([Role.manager]) payload: UserPayload,
    @Body() dto: AprroveAndReproveRequestSendOvertimeDto,
  ) {
    return await this.requestSendOvertimeService.changeStatusOfRequestSendOvertime(
      dto.requestSendOvertimeId,
      { approvalSatus: ApprovalStatus.reproved, disapprovalDate: new Date() },
    );
  }
}
