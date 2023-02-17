import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { ProjectService } from 'src/app/project/service/project.service';
import { UserService } from 'src/app/user/service/user.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formatDateObjectToString } from 'src/app/util/format-date-object-to-string';
import { formatDateStringToObject } from 'src/app/util/format-date-string-to-object';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import { getDaysInMonth } from 'src/app/util/get-days-in-month';
import { validateDateFormat } from 'src/app/util/validate-date-format';
import { DateToSendTimeEntity } from '../entities/date-to-send-time.entity';
import { RequestSendOvertimeEntity } from '../entities/request-send-overtime.entity';
import { AllRequestSendOvertimeUserStatusResponse } from '../protocols/all-requests-send-overtime-user-status.response';
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
    validateDateFormat(dto.dateToSendTime);
    const currentDate = formatDateStringToObject(
      formattedCurrentDate(new Date()),
    );
    const date = formatDateStringToObject(dto.dateToSendTime);

    if (
      (date.day < currentDate.day && date.month <= currentDate.month) ||
      date.year < currentDate.year ||
      date.month < currentDate.month
    ) {
      throw new BadRequestException(
        `Impossible to make a request for a date that has passed`,
      );
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

    await this.checkIfUserHasAlreadyMadeRequestForThatDate(
      userProjectOrError.id,
      date,
    );

    const dateObject = formatDateStringToObject(dto.dateToSendTime);

    await this.requestSendOvertimeRepository.askPermissionToSendOvertime({
      id: createUuid(),
      requestDescription: dto.requestDescription,
      userProjectId: userProjectOrError.id,
      requestDate: formattedCurrentDate(new Date()),
      managerId: projectManager.user.id,
      approvalSatus: ApprovalStatus.analyze,
      dateToSendTime: {
        id: createUuid(),
        ...dateObject,
      },
    });
  }

  async checkIfUserHasAlreadyMadeRequestForThatDate(
    userProjectId: string,
    date: DateToSendTimeEntity,
  ): Promise<RequestSendOvertimeEntity[]> {
    const requestSendOvertimeOrEmpty =
      await this.requestSendOvertimeRepository.findRequestSendOvertimeOnDate(
        userProjectId,
        date,
      );
    const dateString = formatDateObjectToString(date);
    if (requestSendOvertimeOrEmpty.length > 0) {
      throw new BadRequestException(
        `This user has already placed an order to post overtime on the day '${dateString}'`,
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
      dateToSendTime: formatDateObjectToString(item.dateToSendTime),
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

  async findAllRequestsSendOvertimeUserStatus(
    userId: string,
    projectId: string,
  ): Promise<AllRequestSendOvertimeUserStatusResponse[]> {
    const userOrError = await this.userService.findUserById(userId);
    if (!userOrError.billable) {
      throw new BadRequestException(`Only billable user is authorized`);
    }

    const userProjectOrError =
      await this.projectService.verifyRelationUserAndProject(userId, projectId);

    const currentDate = formattedCurrentDate(new Date());
    let date = formatDateStringToObject(currentDate);

    const daysInMonth = getDaysInMonth(date.month, date.year);

    let endMonth = date.month;
    let endYear = date.year;

    if (date.day + 20 > daysInMonth && date.month < 12) {
      endMonth = date.month + 1;
    } else if (date.day + 20 > daysInMonth && date.month === 12) {
      endMonth = 1;
      endYear += 1;
    }

    const requestsSendOvertimeOrEmpty =
      await this.requestSendOvertimeRepository.findAllRequestsSendOvertimeUserStatus(
        {
          userProjectId: userProjectOrError.id,
          startDate: {
            day: date.day,
            month: date.month,
            year: date.year,
          },
          endDate: {
            month: endMonth,
            year: endYear,
          },
        },
      );

    if (requestsSendOvertimeOrEmpty.length === 0) {
      throw new BadRequestException(`No nearby order to send hours found`);
    }

    const allRequests = requestsSendOvertimeOrEmpty.map((request) => ({
      id: request.id,
      dateToSendTime: formatDateObjectToString({
        day: request.dateToSendTime.day,
        month: request.dateToSendTime.month,
        year: request.dateToSendTime.year,
      }),
      status: request.approvalSatus,
    }));

    return allRequests;
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
    if (
      requestSendOvertimeOrNull.userProject.user.id === props.validatedByUserId
    ) {
      throw new BadRequestException(
        `Unable to approve/reprove own request to send overtime`,
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
