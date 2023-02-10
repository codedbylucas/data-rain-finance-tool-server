export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    positionName: string;
    billable: boolean;
    allocated: boolean;
    roleName: string;
  };
}
