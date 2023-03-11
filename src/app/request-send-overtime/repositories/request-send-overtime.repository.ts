import { Injectable } from '@nestjs/common';
import { ApprovalStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/app/infra/prisma/prisma.service';
import { serverError } from 'src/app/util/server-error';
import { DateToSendTimeEntity } from '../entities/date-to-send-time.entity';
import { RequestSendOvertimeEntity } from '../entities/request-send-overtime.entity';
import { DbAskPermissionToSendOvertime } from '../protocols/db-create-request-send-overtime.props';
import { DbRequestSendOvertimeResponse } from '../protocols/db-find-request-send-overtime.response';
import { ChangeStatusOfRequestSendOvertimeProps } from '../protocols/props/change-stauts-of-request-send-overtime.props';
import { DbFindAllRequestSendOvertimeUserStatusProps } from '../protocols/props/db-find-all-requests-send-overtime-user-status.props';

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
      await this.prisma.requestSendOvertime
        .create({
          data,
          include: {
            dateToSendTime: {
              select: {
                day: true,
                month: true,
                year: true,
              },
            },
          },
        })
        .catch(serverError);

    return askPermissionToSendOvertimeCreated;
  }

  async findRequestSendOvertimeOnDate(
    userProjectId: string,
    date: DateToSendTimeEntity,
  ): Promise<RequestSendOvertimeEntity[]> {
    const requestSendOvertimeOrEmpty = await this.prisma.requestSendOvertime
      .findMany({
        where: {
          userProjectId,
          AND: {
            dateToSendTime: {
              day: date.day,
              month: date.month,
              year: date.year,
            },
          },
        },
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
          dateToSendTime: true,
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

  async findAllRequestsSendOvertimeUserStatus(
    props: DbFindAllRequestSendOvertimeUserStatusProps,
  ) {
    const requestsSendOvertimeOrEmpty = await this.prisma.requestSendOvertime
      .findMany({
        where: {
          userProjectId: props.userProjectId,
          AND: {
            dateToSendTime: {
              day: {
                gte: props.startDate.day,
              },
              month: {
                gte: props.startDate.month,
              },
              year: props.startDate.year,
            },
            AND: {
              dateToSendTime: {
                month: {
                  lte: props.endDate.month,
                },
                year: {
                  lte: props.endDate.year,
                },
              },
            },
          },
        },
        select: {
          id: true,
          dateToSendTime: true,
          approvalSatus: true,
        },
        orderBy: {
          dateToSendTime: {
            month: 'asc',
          },
        },
      })
      .catch(serverError);

    return requestsSendOvertimeOrEmpty;
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
