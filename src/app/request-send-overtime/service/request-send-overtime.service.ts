import { BadRequestException, Injectable } from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { ProjectService } from 'src/app/project/service/project.service';
import { UserService } from 'src/app/user/service/user.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import { RequestSendOvertimeEntity } from '../entities/request-send-overtime.entity';
import { RequestSendOvertimeRepository } from '../repositories/request-send-overtime.repository';
import { AskPermissionToSendOvertimeDto } from './dto/ask-permission-to-send-overtime.dto';

@Injectable()
export class RequestSendOvertimeService {
  constructor(
    private readonly requestSendOvertimeRepository: RequestSendOvertimeRepository,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  async askPermissionToSendOvertime(
    userId: string,
    dto: AskPermissionToSendOvertimeDto,
  ): Promise<void> {
    const userOrError = await this.userService.findUserById(userId);
    if (!userOrError.billable) {
      throw new BadRequestException(`Only billable user is authorized`);
    }
    const projectOrError = await this.projectService.findProjectById(
      dto.projectId,
    );
    const userProjectOrError =
      await this.projectService.verifyRelationUserAndProject(
        userId,
        dto.projectId,
      );

    const projectManager = projectOrError.users.find(
      (userProject) => userProject.user.roleName === 'manager',
    );
    if (!projectManager) {
      throw new BadRequestException(
        `A manager needs to be on the project to ask for permission to post overtime`,
      );
    }

    const requestDate = formattedCurrentDate(new Date());
    await this.checkIfUserHasAlreadyPlacedAnOrder(
      userProjectOrError.id,
      requestDate,
    );

    await this.requestSendOvertimeRepository.askPermissionToSendOvertime({
      id: createUuid(),
      requestDescription: dto.requestDescription,
      userProjectId: userProjectOrError.id,
      requestDate,
      managerId: projectManager.user.id,
      approvalSatus: ApprovalStatus.analyze,
    });
  }

  async checkIfUserHasAlreadyPlacedAnOrder(
    userProjectId: string,
    date: string,
  ): Promise<RequestSendOvertimeEntity[]> {
    const requestSendOvertimeOrEmpty =
      await this.requestSendOvertimeRepository.findRequestSendOvertime(
        userProjectId,
        date,
      );
    if (requestSendOvertimeOrEmpty.length > 0) {
      throw new BadRequestException(
        `This user has already placed an order on today's date`,
      );
    }
    return requestSendOvertimeOrEmpty;
  }
}
