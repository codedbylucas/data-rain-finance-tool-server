import { Injectable } from '@nestjs/common';
import { ApprovalStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { DateToSendTimeEntity } from 'src/app/request-send-overtime/entities/date-to-send-time.entity';
import { RequestSendOvertimeEntity } from 'src/app/request-send-overtime/entities/request-send-overtime.entity';
import { serverError } from 'src/app/util/server-error';
import { OvertimeEntity } from '../entities/overtime.entity';
import { DbCreateOvertimeProps } from '../protocols/props/db-create-overtime.props';
import { DbUpdateOvertimeProps } from '../protocols/props/db-update-overtime.props';

@Injectable()
export class OvertimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOvertime(props: DbCreateOvertimeProps): Promise<OvertimeEntity> {
    const data: Prisma.OvertimesCreateInput = {
      id: props.id,
      date: props.date,
      entry: props.entry,
      requestSendOvertime: {
        connect: {
          id: props.requestSendOvertimeId,
        },
      },
    };

    const overtimeCreated = await this.prisma.overtimes
      .create({
        data,
      })
      .catch(serverError);
    return overtimeCreated;
  }

  async findOvertimeById(id: string): Promise<OvertimeEntity> {
    const overtimeOrNull = await this.prisma.overtimes
      .findUnique({ where: { id } })
      .catch(serverError);
    return overtimeOrNull;
  }

  async updateOvertime(props: DbUpdateOvertimeProps): Promise<void> {
    await this.prisma.overtimes
      .update({
        where: { id: props.id },
        data: { exit: props.exit },
      })
      .catch(serverError);
  }

  async findOvertimeByRequestSendOvertimeId(
    requestSendOvertimeId: string,
  ): Promise<OvertimeEntity> {
    const overtimeOrNull = await this.prisma.overtimes
      .findUnique({
        where: {
          requestSendOvertimeId,
        },
      })
      .catch(serverError);
    return overtimeOrNull;
  }

  async findRequestSendOvertimeByUserProjectsId(
    userProjectId: string,
    date: DateToSendTimeEntity,
  ): Promise<RequestSendOvertimeEntity[]> {
    const requestSendOvertime = await this.prisma.requestSendOvertime
      .findMany({
        where: {
          userProjectId,
          AND: {
            approvalSatus: ApprovalStatus.approved,
            dateToSendTime: {
              day: date.day,
              month: date.month,
              year: date.year,
            },
          },
        },
      })
      .catch(serverError);
    return requestSendOvertime;
  }
}
