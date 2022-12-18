import { BadRequestException, Injectable } from '@nestjs/common';
import { AlternativeService } from 'src/app/alternatives/service/alternative.service';
import { TeamService } from 'src/app/team/service/team.service';
import { createUuid } from 'src/app/util/create-uuid';
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
      await this.alternativeTeamRepository.findAlternativeTeamByDubleId(
        dto.alternativeId,
        dto.teamId,
      );

    if (alternativeTeamOrNull) {
      throw new BadRequestException('This relationship already exists');
    }
    const alternativeTeam =
      await this.alternativeTeamRepository.createTeamAlternative({
        ...dto,
        id: createUuid(),
      });
  }
}
