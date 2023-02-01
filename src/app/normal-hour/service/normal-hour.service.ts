import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjectService } from 'src/app/project/service/project.service';
import { createUuid } from 'src/app/util/create-uuid';
import { formattedCurrentDate } from 'src/app/util/formatted-current-date';
import { NormalHourRepository } from '../repositories/normal-hour.repository';

@Injectable()
export class NormalHourService {
  constructor(
    private readonly normalHourRepository: NormalHourRepository,
    private readonly projectService: ProjectService,
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
}
