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
import { SendTimeDto } from './dto/send-time.dto';

@Injectable()
export class NormalHourService {
  constructor(
    private readonly normalHourRepository: NormalHourRepository,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  async sendTime(userId: string, dto: SendTimeDto): Promise<void> {
    const user = await this.userService.findUserById(userId);
    if (!user.billable) {
      throw new BadRequestException(
        `User who is not billable cannot access this route`,
      );
    }
    const userProject = await this.projectService.verifyRelationUserAndProject(
      userId,
      dto.projectId,
    );
    const date = formattedCurrentDate(new Date());

    const normalHouOrNull =
      await this.normalHourRepository.findNormalHourByProjectIdAndDate(
        userProject.id,
        date,
      );

    if (normalHouOrNull) {
      if (normalHouOrNull.entry && !normalHouOrNull.exitToBreak) {
        return await this.normalHourRepository.updateNormalHour(
          normalHouOrNull.id,
          {
            exitToBreak: new Date(),
          },
        );
      }

      if (normalHouOrNull.exitToBreak && !normalHouOrNull.backFromTheBreak) {
        return await this.normalHourRepository.updateNormalHour(
          normalHouOrNull.id,
          {
            backFromTheBreak: new Date(),
          },
        );
      }

      if (normalHouOrNull.backFromTheBreak && !normalHouOrNull.exit) {
        return await this.normalHourRepository.updateNormalHour(
          normalHouOrNull.id,
          {
            exit: new Date(),
          },
        );
      }

      if (normalHouOrNull.exit) {
        throw new BadRequestException(`Work routine completed`);
      }
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
    const normalHourOrNull =
      await this.normalHourRepository.findNormalHourByProjectIdAndDate(
        userProject.id,
        date,
      );

    if (!normalHourOrNull) {
      return {
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.entry,
        ).returnStatus(),
      };
    }

    if (normalHourOrNull.entry && !normalHourOrNull.exitToBreak) {
      return {
        normalHourId: normalHourOrNull.id,
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.exitToBreak,
        ).returnStatus(),
      };
    }
    if (normalHourOrNull.exitToBreak && !normalHourOrNull.backFromTheBreak) {
      return {
        normalHourId: normalHourOrNull.id,
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.backFromTheBreak,
        ).returnStatus(),
      };
    }
    if (normalHourOrNull.backFromTheBreak && !normalHourOrNull.exit) {
      return {
        normalHourId: normalHourOrNull.id,
        status: new DayTimeStatusNormalHour(
          DayTimeStatusEnum.exit,
        ).returnStatus(),
      };
    }
    if (normalHourOrNull.exit) {
      throw new BadRequestException(`User has already finished work`);
    }
  }
}
