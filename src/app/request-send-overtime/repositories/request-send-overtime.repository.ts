import { Injectable } from '@nestjs/common';
import { ApprovalStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { RequestSendOvertimeEntity } from '../entities/request-send-overtime.entity';
import { DbAskPermissionToSendOvertime } from '../protocols/db-create-request-send-overtime.props';
import { DbRequestSendOvertimeResponse } from '../protocols/db-find-request-send-overtime.response';
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
      dateToSendTime: {
        create: {
          id: props.dateToSendTime.id,
          day: props.dateToSendTime.day,
          month: props.dateToSendTime.month,
          year: props.dateToSendTime.year,
        },
      },
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

  async findRequestSendOvertimeById(id: string) {
    const requestSendOvertimeOrNull = await this.prisma.requestSendOvertime
      .findUnique({
        where: { id },
        include: {
          overtime: true,
          userProject: {
            select: {
              user: true,
            },
          },
        },
      })
      .catch(serverError);
    return requestSendOvertimeOrNull;
  }

  async findAllRequestSendOvertimeByManagerId(
    managerId: string,
  ): Promise<DbRequestSendOvertimeResponse[]> {
    const allRequestsSendOvertimeOrEmpty = await this.prisma.requestSendOvertime
      .findMany({
        where: {
          managerId,
          AND: { approvalSatus: ApprovalStatus.analyze },
          NOT: {
            userProject: {
              user: {
                id: managerId,
              },
            },
          },
        },
        select: this.selectRequestSendOvertime,
      })
      .catch(serverError);
    return allRequestsSendOvertimeOrEmpty;
  }

  async findAllRequestSendOvertimeInAnalyze(): Promise<
    DbRequestSendOvertimeResponse[]
  > {
    const allRequestsSendOvertimeOrEmpty = await this.prisma.requestSendOvertime
      .findMany({
        where: { approvalSatus: ApprovalStatus.analyze },
        select: this.selectRequestSendOvertime,
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

  private selectRequestSendOvertime = {
    id: true,
    requestDescription: true,
    approvalSatus: true,
    dateToSendTime: {
      select: {
        id: true,
        day: true,
        month: true,
        year: true,
      },
    },
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
  };
}
