import { Injectable } from '@nestjs/common';
import { UserData } from '../protocols/user-data';

@Injectable()
export class GatewayRepository {
  private userData: UserData[] = [];

  saveUser(userData: UserData): void {
    this.userData.push(userData);
  }

  findUserById(userId: string): UserData {
    const userOrNull = this.userData.find((user) => user.userId === userId);
    return userOrNull;
  }

  updateClientIdInUserData(newClientId: string, index: number): UserData {
    this.userData[index].clientId = newClientId;
    return this.userData[index];
  }

  findUserIndex(userId: string): number {
    for (let i = 0; i < this.userData.length; i++) {
      if (this.userData[i].userId === userId) {
        return i;
      }
    }
  }

  removeUserData(index: number): void {
    this.userData.splice(index, 1);
  }
}
