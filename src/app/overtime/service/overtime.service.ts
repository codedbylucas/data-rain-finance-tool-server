import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectService } from 'src/app/project/service/project.service';
import { RequestSendOvertimeService } from 'src/app/request-send-overtime/service/request-send-overtime.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import { formattedCurrentTime } from 'src/app/util/formatted-current-time';
import {
  DayTimeStatusOvertime,
  DayTimeStatusOvertimeEnum,
} from '../protocols/day-time-status-overtime';
import { FindOvertimePostedInTheDayResponse } from '../protocols/find-overtime-posted-in-the-day.response';
import { OvertimeRepository } from '../repositories/overtime.repository';
import { CreateOvertimeDto } from './dto/create-overtime.dto';

@Injectable()
export class OvertimeService {
  constructor(
    private readonly overtimeRepository: OvertimeRepository,
    private readonly requestSendOvertimeService: RequestSendOvertimeService,
    private readonly projectService: ProjectService,
  ) {}

  async createOvertime(userId: string, dto: CreateOvertimeDto): Promise<void> {
    const requestSendOvertime =
      await this.requestSendOvertimeService.verifyRequestSendOvertimeExist(
        dto.requestSendOvertimeId,
      );

    if (userId !== requestSendOvertime.userProject.user.id) {
      throw new BadRequestException(
        `The request to send time does not belong to the logged in user`,
      );
    }

    const date = formattedCurrentDate(new Date());

    if (!requestSendOvertime.overtime) {
      await this.overtimeRepository.createOvertime({
        id: createUuid(),
        date,
        entry: new Date(),
        requestSendOvertimeId: requestSendOvertime.id,
      });
      return;
    }

    if (
      requestSendOvertime.overtime.entry &&
      !requestSendOvertime.overtime.exit
    ) {
      await this.overtimeRepository.updateOvertime({
        id: requestSendOvertime.overtime.id,
        exit: new Date(),
      });
      return;
    }
    if (
      requestSendOvertime.overtime.entry &&
      requestSendOvertime.overtime.exit
    ) {
      throw new BadRequestException(
        `User has already finished working overtime`,
      );
    }
  }

  async findOvertimePostedInTheDay(
    userId: string,
    projectId: string,
  ): Promise<FindOvertimePostedInTheDayResponse> {
    const userProject = await this.projectService.verifyRelationUserAndProject(
      userId,
      projectId,
    );
    const requestSendOvertimeOrNull =
      await this.overtimeRepository.findRequestSendOvertimeByUserProjectsId(
        userProject.id,
      );

    if (requestSendOvertimeOrNull.length === 0) {
      throw new BadRequestException(`There is no request to submit overtime`);
    }
    const requestSendOvertime = requestSendOvertimeOrNull[0];

    if (requestSendOvertime.approvalSatus !== 'approved') {
      throw new BadRequestException(
        `There is no request to submit approved overtime`,
      );
    }

    const overtimeOrnull =
      await this.overtimeRepository.findOvertimeByRequestSendOvertimeId(
        requestSendOvertime.id,
      );

    if (!overtimeOrnull) {
      throw new BadRequestException(`Overtime has not yet been sent`);
    }

    return {
      date: overtimeOrnull.date,
      entry: formattedCurrentTime(overtimeOrnull.entry),
      exit: formattedCurrentTime(overtimeOrnull.exit),
    };
  }
}
