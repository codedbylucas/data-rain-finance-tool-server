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
import { FindRequestSendOvertimeResponse } from './protocols/find-request-send-overtime.response';
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
    summary: 'Find all requests to submit overtime that are under review',
  })
  async findAllRequestSendOvertime(
    @RolesAccess([Role.manager, Role.admin]) payload: UserPayload,
  ): Promise<FindRequestSendOvertimeResponse[]> {
    return await this.requestSendOvertimeService.findAllRequestSendOvertime(
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
    @RolesAccess([Role.manager, Role.admin]) payload: UserPayload,
    @Body() dto: AprroveAndReproveRequestSendOvertimeDto,
  ) {
    return await this.requestSendOvertimeService.changeStatusOfRequestSendOvertime(
      dto.requestSendOvertimeId,
      {
        approvalSatus: ApprovalStatus.approved,
        validationDate: new Date(),
        validatedByUserId: payload.userId,
      },
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
    @RolesAccess([Role.manager, Role.admin]) payload: UserPayload,
    @Body() dto: AprroveAndReproveRequestSendOvertimeDto,
  ) {
    return await this.requestSendOvertimeService.changeStatusOfRequestSendOvertime(
      dto.requestSendOvertimeId,
      {
        approvalSatus: ApprovalStatus.reproved,
        validationDate: new Date(),
        validatedByUserId: payload.userId,
      },
    );
  }
}
