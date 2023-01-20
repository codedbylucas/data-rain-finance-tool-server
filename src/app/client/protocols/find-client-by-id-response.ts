export interface FindClientByIdResponse {
  id: string;
  email: string;
  phone: string;
  mainContact: string;
  companyName: string;
  technicalContact?: string;
  technicalContactPhone?: string;
  technicalContactEmail?: string;
  projectName?: string;
  timeProject?: string;
  applicationDescription?: string;
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
