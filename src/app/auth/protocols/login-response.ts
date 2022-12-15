export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    position: string;
    roleName: string;
  };
}
