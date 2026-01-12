
export enum SpecialistStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface Specialist {
  id: string;
  name: string;
  email: string;
  specialization: string;
  registrationDate: string;
  status: SpecialistStatus;
  bio: string;
  experienceYears: number;
  notes: string[];
}

export interface DailyStats {
  date: string;
  registrations: number;
  followUps: number;
}
