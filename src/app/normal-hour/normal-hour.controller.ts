import { Controller } from '@nestjs/common';
import { NormalHourService } from './service/normal-hour.service';

@Controller('normal-hour')
export class NormalHourController {
  constructor(private readonly normalHourService: NormalHourService) {}
}
