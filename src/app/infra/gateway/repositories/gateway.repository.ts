import { Injectable } from '@nestjs/common';

export interface UserData {
  clientId: string;
  userId: string;
}

@Injectable()
export class GatewayRepository {
  private userData: UserData[] = [];

  save(userData: UserData): void {
    console.log('save 1', this.userData);
    this.userData.push(userData);
    console.log('save 2', this.userData);
  }

  findUserById(userId: string): UserData {
    console.log('find', this.userData);
    const userOrNull = this.userData.find((user) => userId === user.userId);
    return userOrNull;
  }
}
