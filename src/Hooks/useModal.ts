// src/hooks/useModal.ts
import { useCallback } from 'react';
import {
  createProject,
  createClub,
  createMentoring,
  ProjectPayload,
  ClubPayload,
  MentoringPayload,
} from '../API/Modal';

export const useModal = () => {
  const submit = useCallback(
    async (
      type: '프로젝트' | '동아리' | '멘토멘티',
      payload: ProjectPayload | ClubPayload | MentoringPayload
    ) => {
      if (type === '프로젝트') {
        return await createProject(payload as ProjectPayload);
      }
      if (type === '동아리') {
        return await createClub(payload as ClubPayload);
      }
      // type === '멘토멘티'
      return await createMentoring(payload as MentoringPayload);
    },
    []
  );

  return { submit };
};
