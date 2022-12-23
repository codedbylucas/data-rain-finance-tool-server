import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { QuestionModule } from '../question/question.module';
import { AlternativeController } from './alternative.controller';
import { AlternativeRepository } from './repositories/alternative.repository';
import { AlternativeService } from './service/alternative.service';

@Module({
  imports: [PrismaModule, QuestionModule],
  providers: [AlternativeService, AlternativeRepository],
  controllers: [AlternativeController],
  exports: [AlternativeService],
})
export class AlternativeModule {}
