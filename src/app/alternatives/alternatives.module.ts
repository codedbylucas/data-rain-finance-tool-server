import { Module } from '@nestjs/common';
import { AlternativesService } from './service/alternatives.service';
import { AlternativesController } from './alternatives.controller';
import { AlternativesRepository } from './repositories/alternatives.repository';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [PrismaModule, QuestionModule],
  providers: [AlternativesService, AlternativesRepository],
  controllers: [AlternativesController],
})
export class AlternativesModule {}
