import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { RequestSendOvertimeEntity } from '../entities/request-send-overtime.entity';
import { DbAskPermissionToSendOvertime } from '../protocols/db-create-request-send-overtime.props';

@Injectable()
export class RequestSendOvertimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async askPermissionToSendOvertime(
    props: DbAskPermissionToSendOvertime,
  ): Promise<RequestSendOvertimeEntity> {
    const data: Prisma.RequestSendOvertimeCreateInput = {
      id: props.id,
      requestDescription: props.requestDescription,
      requestDate: props.requestDate,
      userProject: {
        connect: {
          id: props.userProjectId,
        },
      },
      manager: {
        connect: {
          id: props.managerId,
        },
      },
    };

    const askPermissionToSendOvertimeCreated =
      await this.prisma.requestSendOvertime.create({ data }).catch(serverError);

    return askPermissionToSendOvertimeCreated;
  }

  async findRequestSendOvertime(
    userProjectId: string,
    date: string,
  ): Promise<RequestSendOvertimeEntity[]> {
    const requestSendOvertimeOrEmpty = await this.prisma.requestSendOvertime
      .findMany({
        where: { userProjectId, AND: { requestDate: date } },
      })
      .catch(serverError);
    return requestSendOvertimeOrEmpty;
  }
}
