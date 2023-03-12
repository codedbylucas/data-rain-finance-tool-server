import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectService } from 'src/app/project/service/project.service';
import { UserService } from 'src/app/user/service/user.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import { formattedCurrentTime } from 'src/app/util/formatted-current-time';
import { FindHoursPostedInTheDayResposne } from '../protocols/find-hours-posted-in-the-day.response';
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

  async findHorsPostedInTheDay(
    userId: string,
    projectId: string,
  ): Promise<FindHoursPostedInTheDayResposne> {
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
  const newDate = new Date()
    const date = formattedCurrentDate(new Date());
      console.log('date', date)
      console.log(new Date())
      console.log('new date', newDate)
      
    const normalHourOrNull =
      await this.normalHourRepository.findNormalHourByProjectIdAndDate(
        userProject.id,
        date,
      );

    if (!normalHourOrNull) {
      throw new BadRequestException(`No time was sent on the day`);
    }

    return {
      date: normalHourOrNull.date,
      entry: formattedCurrentTime(normalHourOrNull.entry),
      exitToBreak: formattedCurrentTime(normalHourOrNull.exitToBreak),
      backFromTheBreak: formattedCurrentTime(normalHourOrNull.backFromTheBreak),
      exit: formattedCurrentTime(normalHourOrNull.exit),
    };
  }
}
