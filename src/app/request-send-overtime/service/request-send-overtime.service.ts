import { Injectable } from '@nestjs/common';
import { RequestSendOvertimeRepository } from '../repositories/request-send-overtime.repository';

@Injectable()
export class RequestSendOvertimeService {
  constructor(
    private readonly requestSendOvertimeRepository: RequestSendOvertimeRepository,
  ) {}
}
