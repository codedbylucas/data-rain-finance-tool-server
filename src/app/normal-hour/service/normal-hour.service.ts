import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectService } from 'src/app/project/service/project.service';
import { UserService } from 'src/app/user/service/user.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import {
  DayTimeStatusEnum,
  DayTimeStatusNormalHour,
} from '../protocols/day-time-status-normal-hour';
import { NormalHourRepository } from '../repositories/normal-hour.repository';

@Injectable()
export class NormalHourService {
  constructor(
    private readonly normalHourRepository: NormalHourRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async sendTime(userId: string, projectId: string): Promise<void> {
    const user = await this.userService.findUserById(userId);
    if (!user.billable) {
      throw new BadRequestException(
        `User who is not billable cannot access this route`,
      );
    }
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
    await this.normalHourRepository.sendTime({
      id: createUuid(),
      date,
      entry: new Date(),
      userProjectId: userProject.id,
    });
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
    const normalHourOrEmpty =
      await this.normalHourRepository.findNormalHourByProjectIdAndDate(
        userProject.id,
        date,
      );

    if (normalHourOrEmpty.length === 0) {
      return {
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.entry,
        ).returnStatus(),
      };
    }
    const normalHour = normalHourOrEmpty[0];
    if (normalHour.entry && !normalHour.exitToBreak) {
      return {
        normalHourId: normalHour.id,
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.exitToBreak,
        ).returnStatus(),
      };
    }
    if (normalHour.exitToBreak && !normalHour.backFromTheBreak) {
      return {
        normalHourId: normalHour.id,
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.backFromTheBreak,
        ).returnStatus(),
      };
    }
    if (normalHour.backFromTheBreak && !normalHour.exit) {
      return {
        normalHourId: normalHour.id,
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.exit,
        ).returnStatus(),
      };
    }
    if (normalHour.exit) {
      throw new BadRequestException(`User has already finished work`);
    }
  }

  async updateNormalHour(
    userId: string,
    normalHourId: string,
    projectId: string,
  ) {
    await this.projectService.verifyRelationUserAndProject(userId, projectId);
    const normalHour = await this.normalHourRepository.findNormalHourById(
      normalHourId,
    );
    if (!normalHour) {
      throw new BadRequestException(
        `Noraml hour with id '${normalHourId} not found'`,
      );
    }

    if (normalHour.entry && !normalHour.exitToBreak) {
      await this.normalHourRepository.updateNormalHour(normalHourId, {
        exitToBreak: new Date(),
      });
      return;
    }
    if (normalHour.exitToBreak && !normalHour.backFromTheBreak) {
      await this.normalHourRepository.updateNormalHour(normalHourId, {
        backFromTheBreak: new Date(),
      });
      return;
    }
    if (normalHour.backFromTheBreak && !normalHour.exit) {
      await this.normalHourRepository.updateNormalHour(normalHourId, {
        exit: new Date(),
      });
      return;
    }
    if (normalHour.exit) {
      throw new BadRequestException(`User has already finished work`);
    }
  }
}
