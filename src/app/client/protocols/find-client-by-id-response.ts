export interface FindClientByIdResponse {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  clientsResponses: {
    question: {
      id: string;
      description: string;
    };
    alternative: {
      id: string;
      description: string;
      teams: {
        team: {
          id: string;
          name: string;
          valuePerHour: number;
        };
      }[];
    };
    responseDetails: string;
  }[];
}
