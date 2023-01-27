export interface FindAllProjectsResponse {
  id: string;
  name: string;
  description: string;
  client?: {
    id: string;
    companyName: string;
  };
  _count: {
    users: number;
  };
}
