import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { AlternativeTeamEntity } from '../entities/alternative-team.entity';

@Injectable()
export class AlternativeTeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAlternativeTeamByIds(
    alternativeId: string,
    teamId: string,
  ): Promise<AlternativeTeamEntity> {
    const alternativeTeamOrNull = await this.prisma.alternativesTeams
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

  
}
