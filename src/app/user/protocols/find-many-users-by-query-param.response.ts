export interface FindaManyUsersByQueryParamResponse {
  users: {
    id: string;
    name: string;
    email: string;
  }[];
}
