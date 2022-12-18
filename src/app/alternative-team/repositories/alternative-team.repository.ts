import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { AlternativeTeamEntity } from '../entities/alternative-team.entity';
import { DbCreateAlternativeTeamProps } from '../protocols/props/db-create-alternative-team.props';
import { UpdateAlternativeTeamProps } from '../protocols/props/update-alternative-team.props';

@Injectable()
export class AlternativeTeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTeamAlternative(
    props: DbCreateAlternativeTeamProps,
  ): Promise<AlternativeTeamEntity> {
    const data: Prisma.AlternativeTeamCreateInput = {
      id: props.id,
      workHours: props.workHours,
      alternative: {
        connect: {
          id: props.alternativeId,
        },
      },
      team: {
        connect: {
          id: props.teamId,
        },
      },
    };
    const alternativeTeam = await this.prisma.alternativeTeam
      .create({ data })
      .catch(serverError);
    return alternativeTeam;
  }

  async findAlternativeTeamByIds(
    alternativeId: string,
    teamId: string,
  ): Promise<AlternativeTeamEntity> {
    const alternativeTeamOrNull = await this.prisma.alternativeTeam
      .findUnique({
        where: {
          alternativeId_teamId: {
            alternativeId,
            teamId,
          },
        },
      })
      .catch(serverError);

    return alternativeTeamOrNull;
  }

  async updateAlternativeTeamByIds(
    props: UpdateAlternativeTeamProps,
  ): Promise<AlternativeTeamEntity> {
    const alternativeTeamUpdated = await this.prisma.alternativeTeam
      .update({
        where: {
          alternativeId_teamId: {
            alternativeId: props.alternativeId,
            teamId: props.teamId,
          },
        },
        data: {
          workHours: props.workHours,
        },
      })
      .catch(serverError);

    return alternativeTeamUpdated;
  }
}
