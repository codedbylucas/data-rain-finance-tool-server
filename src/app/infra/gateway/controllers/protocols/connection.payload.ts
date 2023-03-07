export interface ConnectionPayload {
  status: boolean;
  message: string;
}

export interface SendConnectionPayload {
  clientId: string;
  status: boolean;
  message: string;
}
