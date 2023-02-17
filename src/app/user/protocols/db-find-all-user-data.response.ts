export interface FindAllUserDataResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  billable: boolean;
  allocated: boolean;
  validatedEmail: boolean;
  role: {
    name: string;
  };
  position: {
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
