import { Injectable } from '@nestjs/common';
import { DecodedToken, JwtAdapter } from '../../criptography/jwt/jwt.adapter';
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

  handleConnection(clientId: string, token: string): void {
    const decodedToken = this.decodeToken(token);
    this.saveUser({ clientId, userId: decodedToken.userId });
  }

  decodeToken(token: string): DecodedToken {
    const decodedToken = this.jwtAdapter.verifyToken(token);
    return decodedToken;
  }

  findUserById(userId: string): UserData {
    const userOrNull = this.gatewayRepository.findUserById(userId);
    return userOrNull;
  }

  saveUser(userData: UserData): void {
    this.gatewayRepository.saveUser(userData);
  }

  removeUserDisconnecting(token: string): void {
    const decodedToken = this.decodeToken(token);
    const userOrNull = this.findUserById(decodedToken.userId);
    if (!userOrNull) {
      return null;
    }
    const index = this.gatewayRepository.findUserIndex(decodedToken.userId);
    this.gatewayRepository.removeUserData(index);
  }

  checkNotificationToSend(token: string): void {
    const decodedToken = this.decodeToken(token);
    this.notificationService.checkNotificationToSend(decodedToken.userId);
  }

  userIsConnected(userId: string): boolean {
    const userConnected = this.gatewayRepository.findUserById(userId);
    if (!userConnected) {
      return false;
    }
    return true;
  }
}
