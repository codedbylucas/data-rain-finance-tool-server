import { Injectable } from '@nestjs/common';

export interface UserData {
  clientId: string;
  userId: string;
}

@Injectable()
export class GatewayRepository {
  private userData: UserData[] = [];

  save(userData: UserData): void {
    this.userData.push(userData);
  }
}
