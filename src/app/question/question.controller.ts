import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateQuestionResponse } from './protocols/create-question-response';
import { FindQuestionResponse } from './protocols/find-questions-response';
import { CreateQuestionDto } from './service/dto/create-question.dto';
import { UpdateQuestionDto } from './service/dto/update-question.dto';
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

  @Patch(':id')
  async updateQuestionById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<void> {
    return await this.questionService.updateQuestionById(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestionById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.questionService.deleteQuestionById(id);
  }
}
