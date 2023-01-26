export interface AddClientToProjectResponse {
  id: string;
  name: string;
  description: string;
  client: {
    id: string;
    companyName: string;
    email: string;
  };
}
