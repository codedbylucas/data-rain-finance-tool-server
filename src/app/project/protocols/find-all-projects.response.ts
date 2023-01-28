export interface FindAllProjectsResponse {
  id: string;
  name: string;
  description: string;
  containsManager: boolean;
  client?: {
    id: string;
    companyName: string;
  };
  _count: {
    users: number;
  };
}
