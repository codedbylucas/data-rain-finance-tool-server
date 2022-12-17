export interface FindQuestionResponse {
  id: string;
  description: string;
  alternatives: {
    id: string;
    description: string;
  }[];
}
