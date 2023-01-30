import { Injectable } from '@nestjs/common';
import { NormalHourRepository } from '../repositories/normal-hour.repository';

@Injectable()
export class NormalHourService {
  constructor(private readonly normalHourRepository: NormalHourRepository) {}
}
