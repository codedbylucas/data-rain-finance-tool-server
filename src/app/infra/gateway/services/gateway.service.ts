import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DecodedToken, JwtAdapter } from '../../criptography/jwt/jwt.adapter';
import { Either, rigth } from '../../shared/either/either';
import { NotificationService } from '../app/notification/service/notification.service';
import { UserData } from '../protocols/user-data';
import { GatewayRepository } from '../repositories/gateway.repository';

@Injectable()
export class GatewayService {
  private notificationService: NotificationService;
  constructor(
    private readonly gatewayRepository: GatewayRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  setNotificationService(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  handleConnection(
    clientId: string,
    token: string,
  ): Either<
    BadGatewayException | NotFoundException | InternalServerErrorException,
    UserData
  > {
    const decodedToken = this.decodeToken(token);
    const userId = decodedToken.userId;
    this.saveUser({ clientId, userId });
    this.notificationService.checkNotificationToSend(userId);
    return rigth({ clientId, userId });
  }

  decodeToken(token: string): DecodedToken {
    const decodedToken = this.jwtAdapter.verifyToken(token);
    return decodedToken;
  }

  findUserById(userId: string): UserData {
    const userOrNull = this.gatewayRepository.findUserById(userId);
    return userOrNull;
  }

  saveUser(userData: UserData) {
    this.gatewayRepository.saveUser(userData);
  }

  removeUserDisconnecting(
    token: string,
  ): Either<BadGatewayException | InternalServerErrorException, null> {
    const decodedToken = this.decodeToken(token);
    const userId = decodedToken.userId;
    const userOrNull = this.findUserById(userId);
    if (!userOrNull) {
      return rigth(null);
    }
    const index = this.gatewayRepository.findUserIndex(userId);
    this.gatewayRepository.removeUserData(index);
    return rigth(null);
  }

  userIsConnected(userId: string): boolean {
    const userConnected = this.gatewayRepository.findUserById(userId);
    if (!userConnected) {
      return false;
    }
    return true;
  }
}
