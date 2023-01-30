export interface DbFindManyUsersByQueryParam {
  usersByNameOrEmpty: FindManyUsers[];
  usersByEmailOrEmpty: FindManyUsers[];
}

export interface FindManyUsers {
  id: string;
  name: string;
  email: string;
}
