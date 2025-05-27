import { useCallback } from 'react';
import { fetchRoadMap } from '../API/RoadMap';

export const useRoadMap = () => {
  const getRoadMap = useCallback(
    async (studyStyle: string, studyField: string): Promise<string> => {
      return await fetchRoadMap(studyStyle, studyField);
    },
    []
  );

  return { getRoadMap };
};