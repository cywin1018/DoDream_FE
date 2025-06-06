import { useMutation } from '@tanstack/react-query';
import api from './api';

const addJob = async (jobId: number) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.');
  }
  try {
    const response = await api.post(`/v1/my-dream/job/${jobId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('직업을 담는데 실패했습니다.:', error);
    throw error;
  }
};

export const useAddJobMutation = () => {
  return useMutation({
    mutationFn: addJob,
  });
};
