export interface FindAllQuestionsResponse {
  id: string;
  description: string;
  alternatives: {
    id: string;
    description: string;
    teams: {
      id: string;
      name: string;
      valuePerHour: number;
      workHours: number | null;
    }[];
  }[];
}
