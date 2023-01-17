export interface DbCreateAlternativeBudgetRequestProps {
  id: string;
  valuePerHour: number;
  workHours?: number;
  alternativeId: string;
  budgetRequestId: string;
}
