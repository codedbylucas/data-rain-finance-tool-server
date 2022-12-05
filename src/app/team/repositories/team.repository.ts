import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { serverError } from 'src/app/util/server-error';
import { Repository } from 'typeorm';
import { TeamEntity } from '../entities/team.entity';
import { CreateTeamDto } from '../service/dto/create-team.dto';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async createTeam(data: CreateTeamDto): Promise<TeamEntity> {
    const createdTeam = this.teamRepository.create(data);
    const savedTeam = await this.teamRepository
      .save(createdTeam)
      .catch(serverError);
    return savedTeam;
  }
}
