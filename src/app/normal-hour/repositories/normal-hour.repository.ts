import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { NormalHourEntity } from '../entities/normal-hour.entity';
import { DbCreateNormalHour } from '../props/db-create-normal-hour.props';

@Injectable()
export class NormalHourRepository {
  constructor(private readonly prisma: PrismaService) {}

  async sendTime(props: DbCreateNormalHour): Promise<NormalHourEntity> {
    const data: Prisma.NormalHoursCreateInput = {
      id: props.id,
      date: props.date,
      entry: props.entry,
      userProject: {
        connect: {
          id: props.userProjectId,
        },
      },
    };

    const normalHourCreated = await this.prisma.normalHours
      .create({
        data,
      })
      .catch(serverError);

    return normalHourCreated;
  }

  async findNormalHourByProjectIdAndDate(
    userProjectId: string,
    date: string,
  ): Promise<NormalHourEntity[]> {
    const normalHour = await this.prisma.normalHours
      .findMany({
        where: {
          userProjectId,
          AND: {
            date,
          },
        },
      })
      .catch(serverError);

    return normalHour;
  }
}
