import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';

@Injectable()
export class NormalHourRepository {
  constructor(private readonly prisma: PrismaService) {}
}
