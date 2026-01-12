
import { Specialist, SpecialistStatus, DailyStats } from './types';

export const MOCK_SPECIALISTS: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Al-Farsi',
    email: 'sarah.f@example.com',
    specialization: 'Clinical Psychology',
    registrationDate: '2024-05-15',
    status: SpecialistStatus.PENDING,
    bio: 'Specialist in Cognitive Behavioral Therapy with 10 years experience in anxiety disorders.',
    experienceYears: 10,
    notes: ['Incomplete documents', 'Waiting for verification']
  },
  {
    id: '2',
    name: 'Ahmed Mansour',
    email: 'ahmed.m@example.com',
    specialization: 'Child Psychology',
    registrationDate: '2024-05-18',
    status: SpecialistStatus.CONTACTED,
    bio: 'Dedicated to helping children with developmental disorders and family counseling.',
    experienceYears: 5,
    notes: ['Initial interview done']
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    email: 'elena.r@example.com',
    specialization: 'Neuropsychology',
    registrationDate: '2024-05-20',
    status: SpecialistStatus.VERIFIED,
    bio: 'Research-focused practitioner specializing in brain injury recovery.',
    experienceYears: 15,
    notes: ['Highly recommended', 'Ready for project assignment']
  }
];

export const MOCK_STATS: DailyStats[] = [
  { date: '2024-05-15', registrations: 4, followUps: 2 },
  { date: '2024-05-16', registrations: 2, followUps: 5 },
  { date: '2024-05-17', registrations: 7, followUps: 3 },
  { date: '2024-05-18', registrations: 5, followUps: 8 },
  { date: '2024-05-19', registrations: 8, followUps: 4 },
  { date: '2024-05-20', registrations: 10, followUps: 6 },
];
