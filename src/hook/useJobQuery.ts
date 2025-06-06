import { useQuery } from '@tanstack/react-query';
import api from './api';

export interface JobRequest {
  jobId: number;
  jobName: string;
  jobDescription: string;
  requiredCertification: string;
  workTimeInfo: string;
  physicalInfo: string;
  imageUrl: string;
  todoGroupNum: number;
}

export interface JobDetailRequest {
  jobId: number;
  jobName: string;
  jobDescription: string;
  certification: string;
  certificationPeriod: string;
  salaryType: string;
  salaryCost: string;
  strong: {
    physical: string;
    stress: string;
    relationship: string;
  };
}

export interface JobViewRequest {
  id: number;
  url: string;
  active: number;
  title: string;
  companyName: string;
  locationName: string;
  jobTypeName: string;
  experienceLevel: string;
  requiredEducationLevel: string;
  closeType: string;
  salary: string;
  deadline: string;
  'expiration-timestamp': string;
  'expiration-date': string;
  count: number;
}

const jobFoundList = async (
  pageNum: number,
  require: string,
  workTime: string,
  bodyActivity: string
) => {
  try {
    const response = await api.get(`/v1/job/list`, {
      params: {
        pageNum: pageNum - 1,
        require: require || undefined,
        workTime: workTime || undefined,
        physical: bodyActivity || undefined,
      },
    });
    return {
      content: response.data.data.content,
      totalPages: response.data.data.totalPages,
    };
  } catch (error) {
    console.error('직업 목록 API 호출 실패:', error);
    throw new Error('직업 목록을 불러오는데 실패했습니다');
  }
};
export const useJobQuery = (
  pageNum: number,
  require: string,
  workTime: string,
  bodyActivity: string
) => {
  return useQuery({
    queryKey: ['jobList', pageNum, require, workTime, bodyActivity],
    queryFn: () => jobFoundList(pageNum, require, workTime, bodyActivity),
  });
};

//직업 상세
const jobDetail = async (id: number): Promise<JobDetailRequest> => {
  try {
    const response = await api.get(`/v1/job/detail/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('직업 상세 정보 API 호출 실패:', error);
    throw error;
  }
};

export const useJobDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ['jobDetail', id],
    queryFn: () => jobDetail(id),
  });
};

//직업탐색-일자리 둘러보기
const jobView = async (keyWord: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.get(`/v1/recruit/list`, {
      params: {
        pageNum: 0,
        keyWord,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.job;
  } catch (error) {
    console.error('직업 상세 정보를 불러오는데 실패했습니다', error);
    throw error;
  }
};

export const useJobViewQuery = (keyWord: string) => {
  return useQuery<JobViewRequest[]>({
    queryKey: ['jobView', keyWord],
    queryFn: () => jobView(keyWord),
  });
};

//로그인 안했을때 일자리 둘러보기
const NoLoginjobView = async (keyWord: string) => {
  try {
    const response = await api.get(`/v1/recruit/list`, {
      params: {
        pageNum: 0,
        keyWord,
      },
    });
    return response.data.data.job;
  } catch (error) {
    console.error('직업 상세 정보를 불러오는데 실패했습니다', error);
    throw error;
  }
};

export const useNoJobViewQuery = (keyWord: string) => {
  return useQuery<JobViewRequest[]>({
    queryKey: ['NoLoginjobView', keyWord],
    queryFn: () => NoLoginjobView(keyWord),
  });
};

//직업상세 다른 드리머 투두
export interface JobOtherList {
  todoGroupId: number;
  memberNickname: string;
  profileImage: string;
  regionName: string;
  daysAgo: number;
  jobName: string;
  todoCount: number;
  todos: [
    {
      todoId: number;
      title: string;
      completed: boolean;
    },
  ];
}

const jobOtherDreamer = async (jobId: number) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.get(`/v1/todo/other/simple/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('다른 드리머를 불러오는 것에 실패했습니다', error);
    throw error;
  }
};

export const useJobOtherQuery = (jobId: number) => {
  return useQuery<JobOtherList[]>({
    queryKey: ['jobOtherDreamer', jobId],
    queryFn: () => jobOtherDreamer(jobId),
  });
};

//todogroupId 각각 todos
export interface EachTodos {
  todoGroupId: number;
  memberNickname: string;
  daysAgo: number;
  jobName: string;
  totalView: number;
  profileImage: string;
  todos: [
    {
      todoId: number;
      title: string;
      completed: boolean;
      isMemoExist: boolean;
      isPublic: boolean;
    },
  ];
}

const EachTodos = async (todoGroupId: number) => {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('인증 토큰이 없습니다');
    }

    const response = await api.get(`/v1/todo/${todoGroupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('개인 투두를 불러오는 것에 실패했습니다.', error);
    throw error;
  }
};

export const useEachTodosQuery = (todoGroupId: number) => {
  return useQuery<EachTodos>({
    queryKey: ['EachTodos', todoGroupId],
    queryFn: () => EachTodos(todoGroupId),
  });
};
