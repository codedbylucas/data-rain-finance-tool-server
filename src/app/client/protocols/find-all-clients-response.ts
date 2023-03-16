export interface FindAllClientsResponse {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  technicalContact?: {
    name: string;
    email: string;
    phone: string;
  };
}
