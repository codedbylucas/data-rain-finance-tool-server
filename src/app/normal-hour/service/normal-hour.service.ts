import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectService } from 'src/app/project/service/project.service';
import { UserService } from 'src/app/user/service/user.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import {
  DayTimeStatus,
  DayTimeStatusEnum,
} from '../protocols/day-time-status';
import { NormalHourRepository } from '../repositories/normal-hour.repository';

@Injectable()
export class NormalHourService {
  constructor(
    private readonly normalHourRepository: NormalHourRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async sendTime(userId: string, projectId: string) {
    await this.projectService.findProjectById(projectId);
    const userProject = await this.projectService.verifyRelationUserAndProject(
      userId,
      projectId,
    );
    const date = formattedCurrentDate(new Date());

    const normalHour =
      await this.normalHourRepository.findNormalHourByProjectIdAndDate(
        userProject.id,
        date,
      );

    if (normalHour.length > 0) {
      throw new BadRequestException(
        `User has already started working on this date`,
      );
    }
    const normalHourCreated = await this.normalHourRepository.sendTime({
      id: createUuid(),
      date,
      entry: new Date(),
      userProjectId: userProject.id,
    });

    return normalHourCreated;
  }

  async findWeatherStatusInTheDay(userId: string, projectId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user.billable) {
      throw new BadRequestException(
        `User who is not billable cannot access this route`,
      );
    }
    const userProject = await this.projectService.verifyRelationUserAndProject(
      userId,
      projectId,
    );

    const date = formattedCurrentDate(new Date());
    const normalHour =
      await this.normalHourRepository.findNormalHourByProjectIdAndDate(
        userProject.id,
        date,
      );

    if (normalHour.length === 0) {
      return {
        status: new DayTimeStatus(DayTimeStatusEnum.entry).returnStatus(),
      };
    }
    for (const element of normalHour) {
      if (element.entry && !element.exitToBreak) {
        return {
          normalHourId: normalHour[0].id,
          status: new DayTimeStatus(
            DayTimeStatusEnum.exitToBreak,
          ).returnStatus(),
        };
      }
      if (element.exitToBreak && !element.backFromTheBreak) {
        return {
          normalHourId: normalHour[0].id,
          status: new DayTimeStatus(
            DayTimeStatusEnum.backFromTheBreak,
          ).returnStatus(),
        };
      }
      if (element.backFromTheBreak && !element.exit) {
        return {
          normalHourId: normalHour[0].id,
          status: new DayTimeStatus(DayTimeStatusEnum.exit).returnStatus(),
        };
      }
    }
  }
}
