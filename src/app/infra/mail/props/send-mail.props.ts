export interface SendMailProps {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}
