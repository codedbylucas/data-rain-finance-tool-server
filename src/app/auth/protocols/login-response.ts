export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    position: string;
    billable: boolean;
    allocated: boolean;
    roleName: string;
  };
}
