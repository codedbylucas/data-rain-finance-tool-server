import { BadRequestException, Injectable } from '@nestjs/common';
import { AlternativeService } from 'src/app/alternatives/service/alternative.service';
import { TeamService } from 'src/app/team/service/team.service';
import { createUuid } from 'src/app/util/create-uuid';
import { UpdateAlternativeTeamProps } from '../protocols/props/update-alternative-team.props';
import { UpdateAlternativeTeamResponse } from '../protocols/update-alternative-team-response';
import { AlternativeTeamRepository } from '../repositories/alternative-team.repository';
import { CreateAlternativeTeamDto } from './dto/create-alternative-team.dto';

@Injectable()
export class AlternativeTeamService {
  constructor(
    private readonly alternativeTeamRepository: AlternativeTeamRepository,
    private readonly alternativeService: AlternativeService,
    private readonly teamService: TeamService,
  ) {}

  async createAlternativeTeam(dto: CreateAlternativeTeamDto): Promise<void> {
    await this.alternativeService.verifyAlternativeExist(dto.alternativeId);
    await this.teamService.verifyTeamExist(dto.teamId);

    const alternativeTeamOrNull =
      await this.alternativeTeamRepository.findAlternativeTeamByIds(
        dto.alternativeId,
        dto.teamId,
      );

    if (alternativeTeamOrNull) {
      throw new BadRequestException('This relationship already exists');
    }
    await this.alternativeTeamRepository.createTeamAlternative({
      ...dto,
      id: createUuid(),
    });
  }

  async updateAlternativeTeamByIds(
    props: UpdateAlternativeTeamProps,
  ): Promise<UpdateAlternativeTeamResponse> {
    await this.alternativeService.verifyAlternativeExist(props.alternativeId);
    await this.teamService.verifyTeamExist(props.teamId);
    const alternativeTeamOrNull =
      await this.alternativeTeamRepository.findAlternativeTeamByIds(
        props.alternativeId,
        props.teamId,
      );

    if (!alternativeTeamOrNull) {
      throw new BadRequestException(
        `It was not possible to find a relationship between ${props.alternativeId} and ${props.teamId}`,
      );
    }
    const alternativeTeamUpdated =
      await this.alternativeTeamRepository.updateAlternativeTeamByIds(props);

    return {
      alternativeId: alternativeTeamUpdated.alternativeId,
      teamId: alternativeTeamUpdated.teamId,
      workHours: alternativeTeamUpdated.workHours,
    };
  }
}
