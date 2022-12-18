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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateQuestionResponse } from './protocols/create-question-response';
import { FindAllQuestionsResponse } from './protocols/find-all-questions-response';
import { CreateQuestionDto } from './service/dto/create-question.dto';
import { UpdateQuestionDto } from './service/dto/update-question.dto';
import { QuestionService } from './service/question.service';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOperation({
    summary: 'Question is created',
  })
  async createQuestion(
    @Body() dto: CreateQuestionDto,
  ): Promise<CreateQuestionResponse> {
    return await this.questionService.createQuestion(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all questions',
  })
  async findAllQuestions(): Promise<FindAllQuestionsResponse[]> {
    return await this.questionService.findAllQuestions();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update question by id',
  })
  async updateQuestionById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<void> {
    return await this.questionService.updateQuestionById(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete question by id',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestionById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return await this.questionService.deleteQuestionById(id);
  }
}
