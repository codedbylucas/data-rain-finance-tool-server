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
    this.validateDateFormat(dto.dateToSendTime);

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
      dateToSendTime: dto.dateToSendTime,
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
      dateToSendTime: item.dateToSendTime,
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

  validateDateFormat(date: string): void {
    if (!date.includes('/')) {
      throw new BadRequestException(`Badly formatted date to send time`);
    }
    const dateSplit = date.split('/');
    if (dateSplit.length !== 3) {
      throw new BadRequestException(`Badly formatted date to send time`);
    }
    if (
      dateSplit[0].length !== 2 ||
      dateSplit[1].length !== 2 ||
      dateSplit[2].length !== 4
    ) {
      throw new BadRequestException(`Badly formatted date to send time`);
    }

    const day = Number(dateSplit[0]);
    const month = Number(dateSplit[1]);
    const year = Number(dateSplit[2]);

    if (month > 12 || month < 1) {
      throw new BadRequestException(`Invalid month in date to send time`);
    }
    if (day > 31 || day < 1) {
      throw new BadRequestException(`Invalid day in date to send time`);
    }

    const currentDate = new Date();
    const currentMonth = Number(currentDate.getMonth());
    const currentYear = Number(currentDate.getFullYear());

    if (year > currentYear + 1) {
      throw new BadRequestException(
        `Impossible to place an order for such a distant date`,
      );
    }
    if (year > currentYear && month > 1 && currentMonth < 5) {
      throw new BadRequestException(
        `Impossible to place an order for such a distant date`,
      );
    }

    if (month === 2 && day > 28) {
      const leapYear = year / 4;
      if (!Number.isInteger(leapYear)) {
        throw new BadRequestException(`Invalid day in date to send time`);
      }
    }
    if (
      (month === 4 && day > 30) ||
      (month === 6 && day > 30) ||
      (month === 9 && day > 30) ||
      (month === 11 && day > 30)
    ) {
      throw new BadRequestException(`Month ${month} contains only 30 days`);
    }
  }
}
