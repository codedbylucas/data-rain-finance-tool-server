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
import { ApprovalStatus } from '@prisma/client';
import { Role, RolesAccess } from '../auth/decorators/roles.decorator';
import { UserPayload } from '../auth/protocols/user-payload';
import { AdminNotificationService } from '../infra/gateway/app/notification/user-notifications/admin-notification/services/admin-notification.service';
import { ManagerNotificationService } from '../infra/gateway/app/notification/user-notifications/manager-notification/services/manager-notification.service';
import { ProfessionalServicesNotificationService } from '../infra/gateway/app/notification/user-notifications/professional-services-notifications/services/professional-services-notification.service';
import { AllRequestSendOvertimeUserStatusResponse } from './protocols/all-requests-send-overtime-user-status.response';
import { FindRequestSendOvertimeResponse } from './protocols/find-request-send-overtime.response';
import { AprroveAndReproveRequestSendOvertimeDto } from './service/dto/aprrove-and-reprove-request-send-overtime.dto';
import { AskPermissionToSendOvertimeDto } from './service/dto/ask-permission-to-send-overtime.dto';
import { RequestSendOvertimeService } from './service/request-send-overtime.service';

@Controller('request-send-overtime')
@ApiTags('request-send-overtime')
export class RequestSendOvertimeController {
  constructor(
    private readonly requestSendOvertimeService: RequestSendOvertimeService,
    private readonly managerNotificationService: ManagerNotificationService,
    private readonly adminNotificationService: AdminNotificationService,
    private readonly professionalServicesNotificationService: ProfessionalServicesNotificationService,
  ) {}

  @Post('/user')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create an order to be able to send overtime',
  })
  async askPermissionToSendOvertime(
    @RolesAccess([Role.professionalServices, Role.manager])
    payload: UserPayload,
    @Body() dto: AskPermissionToSendOvertimeDto,
  ) {
    const requestSendOvertime =
      await this.requestSendOvertimeService.askPermissionToSendOvertime(
        payload.userId,
        dto,
      );

    if (payload.roleName === 'professional services') {
      await this.managerNotificationService.askPermissionToSendOvertime({
        receiverId: requestSendOvertime.managerId,
        senderId: payload.userId,
        dateToSendTime: requestSendOvertime.dateToSendTime,
      });
    }

    await this.adminNotificationService.askPermissionToSendOvertime({
      senderId: payload.userId,
      dateToSendTime: requestSendOvertime.dateToSendTime,
    });
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

  @Get('/user/status/:projectId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all requests to submit user overtime on project',
  })
  async findAllRequestsSendOvertimeUserStatus(
    @RolesAccess([Role.manager, Role.professionalServices])
    payload: UserPayload,
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ): Promise<AllRequestSendOvertimeUserStatusResponse[]> {
    return await this.requestSendOvertimeService.findAllRequestsSendOvertimeUserStatus(
      payload.userId,
      projectId,
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
    const response =
      await this.requestSendOvertimeService.changeStatusOfRequestSendOvertime(
        dto.requestSendOvertimeId,
        {
          approvalSatus: ApprovalStatus.approved,
          validationDate: new Date(),
          validatedByUserId: payload.userId,
        },
      );

    this.professionalServicesNotificationService.requestStatusChangeToSubmitOvertime(
      {
        senderId: payload.userId,
        receiverId: response.userId,
        dateToSendTime: response.dateToSendTime,
        approved: true,
        projectId: response.projectId,
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
