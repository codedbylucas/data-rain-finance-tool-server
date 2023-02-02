import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';

@Injectable()
export class RequestSendOvertimeRepository {
  constructor(private readonly prisma: PrismaService) {}
}
