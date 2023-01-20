import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from 'src/app/question/repositories/question.repository';
import { TeamService } from 'src/app/team/service/team.service';
import { checkHasDuplicates } from 'src/app/util/check-has-duplicates-in-array';
import { createUuid } from 'src/app/util/create-uuid';
import { AlternativeTeamEntity } from '../entities/alternative-team.entity';
import { AlternativeEntity } from '../entities/alternative.entity';
import { CreateAlternativeResponse } from '../protocols/create-alternative-response';
import { AlternativeRepository } from '../repositories/alternative.repository';
import { CreateAlternativeDto } from './dto/create-alternative.dto';
import { UpdateAlternativeDto } from './dto/update-alternative.dto';

@Injectable()
export class AlternativeService {
  constructor(
    private readonly alternativeRepository: AlternativeRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly teamService: TeamService,
  ) {}

  async createAlternative(
    dto: CreateAlternativeDto,
  ): Promise<CreateAlternativeResponse> {
    const questionOrNull = await this.questionRepository.findQuestionById(
      dto.questionId,
    );
    if (!questionOrNull) {
      throw new BadRequestException(
        `Question with id '${dto.questionId}' not found`,
      );
    }

    if (dto.teams) {
      if (dto.teams.length > 1) {
        throw new BadRequestException(
          `An alternative can contain only one team`,
        );
      }

      const teamIds = dto.teams.map((team) => team.teamId);
      checkHasDuplicates(teamIds, `Team Id cannot be duplicated`);
      for (const team of dto.teams) {
        await this.teamService.verifyTeamExist(team.teamId);
      }
    }

    const alternative = await this.alternativeRepository.createAlternative({
      ...dto,
      id: createUuid(),
    });

    if (dto.teams) {
      const data = dto.teams.map((team) => ({
        alternativeId: alternative.id,
        teamId: team.teamId,
        workHours: team.workHours,
      }));
      await this.alternativeRepository.createAlternativesTeams(data);
    }

    return {
      id: alternative.id,
      description: alternative.description,
      questionId: alternative.questionId,
    };
  }

  async findAlternativeAndTheirTeams(alternativeId: string) {
    const alternativeOrNull =
      await this.alternativeRepository.findAlternativeAndTheirTeams(
        alternativeId,
      );
    if (!alternativeOrNull) {
      throw new NotFoundException(
        `Alternative with ID '${alternativeId}' not found`,
      );
    }
    return alternativeOrNull;
  }

  async updateAlternative(
    alternativeId: string,
    dto: UpdateAlternativeDto,
  ): Promise<void> {
    if (dto.description) {
      await this.alternativeRepository.updateAlternativeById(
        alternativeId,
        dto,
      );
    }

    if (dto.teams) {
      const teamIds = dto.teams.map((team) => team.teamId);
      checkHasDuplicates(teamIds, `Team Id cannot be duplicated`);
      for (const team of dto.teams) {
        await this.teamService.verifyTeamExist(team.teamId);
        const relationshipExist = await this.alternativeTeamRelationshipExist(
          alternativeId,
          team.teamId,
        );
        if (relationshipExist) {
          if (team.workHours) {
            await this.alternativeRepository.updateAlternativesTeams({
              alternativeId,
              teamId: team.teamId,
              workHours: team.workHours,
            });
          }
        } else {
          await this.alternativeRepository.createAlternativesTeams([
            {
              alternativeId: alternativeId,
              teamId: team.teamId,
              workHours: team.workHours,
            },
          ]);
        }
      }
    }
  }

  async deleteAlternativeById(id: string): Promise<void> {
    await this.verifyAlternativeExist(id);
    await this.alternativeRepository.deleteAlternativeById(id);
  }

  async deleteAlternativeTeamByIds(
    alternativeId: string,
    teamId: string,
  ): Promise<void> {
    await this.verifyAlternativeAndTeamExist(alternativeId, teamId);
    await this.verifyRelationshipAlternativeTeam(alternativeId, teamId);

    await this.alternativeRepository.deleteAlternativeTeamByIds(
      alternativeId,
      teamId,
    );
  }

  async verifyAlternativeAndTeamExist(
    alternativeId: string,
    teamId: string,
  ): Promise<void> {
    await this.verifyAlternativeExist(alternativeId);
    await this.teamService.verifyTeamExist(teamId);
  }

  async verifyAlternativeExist(id: string): Promise<AlternativeEntity> {
    const alternativeOrNull =
      await this.alternativeRepository.findAlternativeById(id);

    if (!alternativeOrNull) {
      throw new BadRequestException(`Alternative with id '${id}' not found`);
    }
    return alternativeOrNull;
  }

  async alternativeTeamRelationshipExist(
    alternativeId: string,
    teamId: string,
  ): Promise<boolean> {
    const alternativeTeamOrNull =
      await this.alternativeRepository.findAlternativeTeamByIds(
        alternativeId,
        teamId,
      );

    if (!alternativeTeamOrNull) {
      return false;
    }

    return true;
  }

  async verifyRelationshipAlternativeTeam(
    alternativeId: string,
    teamId: string,
  ): Promise<AlternativeTeamEntity> {
    const alternativeTeamOrNull =
      await this.alternativeRepository.findAlternativeTeamByIds(
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
