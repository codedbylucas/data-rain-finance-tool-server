export interface DbCreateClientProps {
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
}
