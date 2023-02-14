import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { ProjectService } from 'src/app/project/service/project.service';
import { UserService } from 'src/app/user/service/user.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import { RequestSendOvertimeEntity } from '../entities/request-send-overtime.entity';
import { DbRequestSendOvertimeResponse } from '../protocols/db-find-request-send-overtime.response';
import { FindRequestSendOvertimeResponse } from '../protocols/find-request-send-overtime.response';
import { ChangeStatusOfRequestSendOvertimeProps } from '../protocols/props/change-stauts-of-request-send-overtime.props';
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
      (userProject) => userProject.user.role.name === 'manager',
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

  async findAllRequestSendOvertime(
    userId: string,
  ): Promise<FindRequestSendOvertimeResponse[]> {
    const userOrNull = await this.userService.findUserById(userId);
    let requestSendOvertimeOrEmpty: DbRequestSendOvertimeResponse[] = null;

    if (userOrNull.role.name === 'admin') {
      requestSendOvertimeOrEmpty =
        await this.requestSendOvertimeRepository.findAllRequestSendOvertimeInAnalyze();
    } else if (userOrNull.role.name === 'manager') {
      requestSendOvertimeOrEmpty =
        await this.requestSendOvertimeRepository.findAllRequestSendOvertimeByManagerId(
          userId,
        );
    }

    if (requestSendOvertimeOrEmpty.length === 0) {
      throw new NotFoundException(`No request to post overtime was found`);
    }

    const requestSendOvertimes = requestSendOvertimeOrEmpty.map((item) => ({
      requestSendOvertimeId: item.id,
      requestDescription: item.requestDescription,
      approvalSatus: item.approvalSatus,
      project: {
        name: item.userProject.project.name,
        description: item.userProject.project.description,
      },
      client: {
        companyName: item.userProject.project.client.companyName,
      },
      user: {
        name: item.userProject.user.name,
        email: item.userProject.user.email,
      },
    }));
    return requestSendOvertimes;
  }

  async changeStatusOfRequestSendOvertime(
    id: string,
    props: ChangeStatusOfRequestSendOvertimeProps,
  ) {
    const requestSendOvertimeOrNull = await this.verifyRequestSendOvertimeExist(
      id,
    );
    if (requestSendOvertimeOrNull.approvalSatus !== 'analyze') {
      throw new BadRequestException(
        `It is only possible to change the status of a request to send overtime if it is under review`,
      );
    }
    await this.requestSendOvertimeRepository.changeStatusOfRequestSendOvertime(
      id,
      props,
    );
  }

  async verifyRequestSendOvertimeExist(id: string) {
    const requestSendOvertimeOrNull =
      await this.requestSendOvertimeRepository.findRequestSendOvertimeById(id);
    if (!requestSendOvertimeOrNull) {
      throw new BadRequestException(
        `Request to send hours with id does not exist`,
      );
    }
    return requestSendOvertimeOrNull;
  }
}
