import { Module } from '@nestjs/common';
import { AlternativeService } from './service/alternative.service';
import { AlternativeController } from './alternative.controller';
import { AlternativeRepository } from './repositories/alternative.repository';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [PrismaModule, QuestionModule],
  providers: [AlternativeService, AlternativeRepository],
  controllers: [AlternativeController],
})
export class AlternativeModule {}
