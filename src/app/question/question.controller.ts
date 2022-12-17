import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateQuestionResponse } from './protocols/create-question-response';
import { FindQuestionResponse } from './protocols/find-all-questions-response';
import { CreateQuestionDto } from './service/dto/create-question.dto';
import { QuestionService } from './service/question.service';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async createQuestion(
    @Body() dto: CreateQuestionDto,
  ): Promise<CreateQuestionResponse> {
    return await this.questionService.createQuestion(dto);
  }

  @Get()
  async findAllQuestions(): Promise<FindQuestionResponse[]> {
    return await this.questionService.findAllQuestions();
  }
}
