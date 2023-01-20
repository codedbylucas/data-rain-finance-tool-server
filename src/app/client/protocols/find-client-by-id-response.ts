export interface FindClientByIdResponse {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  budgetRequests: {
    clientsResponses: {
      responseDetails: string;
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
    }[];
  }[];
}
