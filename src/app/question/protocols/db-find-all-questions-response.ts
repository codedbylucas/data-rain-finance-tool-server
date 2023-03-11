export interface DbFindAllQuestionResponse {
  id: string;
  description: string;
  position: number;
  alternatives: {
    id: string;
    description: string;
    teams: {
      team: {
        id: string;
        name: string;
        valuePerHour: number;
      };
      workHours: number | null;
    }[];
  }[];
}
