import { Injectable } from '@nestjs/common';
import { UserData } from '../protocols/user-data';

@Injectable()
export class GatewayRepository {
  private userData: UserData[] = [];

  saveUser(userData: UserData): void {
    this.userData.push(userData);
    console.log(userData);
  }

  findUserById(userId: string): UserData {
    const userOrNull = this.userData.find((user) => userId === user.userId);
    return userOrNull;
  }
}
