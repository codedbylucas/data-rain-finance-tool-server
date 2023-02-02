import { Injectable } from '@nestjs/common';
import { ApprovalStatus, Prisma, RequestSendOvertime } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { RequestSendOvertimeEntity } from '../entities/request-send-overtime.entity';
import { DbAskPermissionToSendOvertime } from '../protocols/db-create-request-send-overtime.props';
import { ChangeStatusOfRequestSendOvertimeProps } from '../protocols/props/change-stauts-of-request-send-overtime.props';

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

  async findRequestSendOvertimeById(
    id: string,
  ): Promise<RequestSendOvertimeEntity> {
    const requestSendOvertimeOrNull = await this.prisma.requestSendOvertime
      .findUnique({
        where: { id },
      })
      .catch(serverError);
    return requestSendOvertimeOrNull;
  }

  async findAllRequestSendOvertimeByManagerId(managerId: string) {
    const allRequestsSendOvertimeOrEmpty = await this.prisma.requestSendOvertime
      .findMany({
        where: { managerId, AND: { approvalSatus: ApprovalStatus.analyze } },
        select: {
          id: true,
          requestDescription: true,
          approvalSatus: true,
          userProject: {
            select: {
              project: {
                select: {
                  name: true,
                  description: true,
                  client: {
                    select: {
                      companyName: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })
      .catch(serverError);
    return allRequestsSendOvertimeOrEmpty;
  }

  async changeStatusOfRequestSendOvertime(
    id: string,
    props: ChangeStatusOfRequestSendOvertimeProps,
  ): Promise<void> {
    const data: Prisma.RequestSendOvertimeUpdateInput = {
      ...props,
    };
    await this.prisma.requestSendOvertime
      .update({
        where: {
          id,
        },
        data,
      })
      .catch(serverError);
  }
}
