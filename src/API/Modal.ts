// src/api/modal.ts
import { apiClient } from './Clinet';

export interface ProjectPayload {
  title: string;
  content: string;
  people: string;
  stacks: string[];
  openDate: string;
  closeDate: string;
  status: 'RECRUITING' | 'CLOSED';
  type: 'PROJECT';
}
export interface ClubPayload {
  name: string;
  description: string;
  location: string;
  target: string;
  openDate: string;
  closeDate: string;
  type: string;
}

export interface MentoringPayload {
  title: string;
  content: string;
  people: string;
  stacks: string[];
  openDate: string;
  closeDate: string;
  status: 'RECRUITING' | 'CLOSED';
  type: 'MENTORING';
  categoryId: number;
}

export const createProject = (payload: ProjectPayload) =>
  apiClient.post('/api/project', payload);

export const createClub = (payload: ClubPayload) =>
  apiClient.post('/api/club', payload);

export const createMentoring = (payload: MentoringPayload) =>
  apiClient.post('/api/mentoring', payload);
