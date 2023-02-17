export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    billable: boolean;
    allocated: boolean;
    role: {
      name: string;
    };
    position: {
      name: string;
    };
  };
}
