import { Module } from '@nestjs/common';
import { QuestionService } from './service/question.service';
import { QuestionController } from './question.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { QuestionRepository } from './repositories/question.repository';

@Module({
  imports: [PrismaModule],
  providers: [QuestionService, QuestionRepository],
  controllers: [QuestionController],
  exports: [QuestionRepository],
})
export class QuestionModule {}
