import { BadRequestException, Injectable } from '@nestjs/common';
import { AlternativeService } from 'src/app/alternatives/service/alternative.service';
import { TeamService } from 'src/app/team/service/team.service';
import { AlternativeTeamEntity } from '../entities/alternative-team.entity';
import { AlternativeTeamRepository } from '../repositories/alternative-team.repository';

@Injectable()
export class AlternativeTeamService {
  constructor(
    private readonly alternativeTeamRepository: AlternativeTeamRepository,
    private readonly alternativeService: AlternativeService,
    private readonly teamService: TeamService,
  ) {}

  async deleteAlternativeTeamByIds(
    alternativeId: string,
    teamId: string,
  ): Promise<void> {
    await this.verifyAlternativeAndTeamExist(alternativeId, teamId);
    await this.verifyRelationshipAlternativeTeam(alternativeId, teamId);

    await this.alternativeTeamRepository.deleteAlternativeTeamByIds(
      alternativeId,
      teamId,
    );
  }

  async verifyAlternativeAndTeamExist(
    alternativeId: string,
    teamId: string,
  ): Promise<void> {
    await this.alternativeService.verifyAlternativeExist(alternativeId);
    await this.teamService.verifyTeamExist(teamId);
  }

  async verifyRelationshipAlternativeTeam(
    alternativeId: string,
    teamId: string,
  ): Promise<AlternativeTeamEntity> {
    const alternativeTeamOrNull =
      await this.alternativeTeamRepository.findAlternativeTeamByIds(
        alternativeId,
        teamId,
      );
    if (!alternativeTeamOrNull) {
      throw new BadRequestException(
        `It was not possible to find a relationship between alternativeId: '${alternativeId}' and teamId: '${teamId}'`,
      );
    }

    return alternativeTeamOrNull;
  }
}
