import { Controller } from '@nestjs/common';
import { RequestSendOvertimeService } from './service/request-send-overtime.service';

@Controller('request-send-overtime')
export class RequestSendOvertimeController {
  constructor(
    private readonly requestSendOvertimeService: RequestSendOvertimeService,
  ) {}
}
