export interface ConnectionPayload {
  connected: boolean;
  message: string;
}

export interface SendConnectionPayload {
  clientId: string;
  connected: boolean;
  message: string;
}
