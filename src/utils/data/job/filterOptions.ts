export const jobOptions = [
  '요양보호사',
  '간호조무사',
  '보육교사',
  '사회복지사',
  '직업상담사',
  '심리상담사',
  '급식 도우미',
  '사무보조원',
  '회계사무원',
  '수의테크니션',
  '웨딩 헬퍼',
  '미용사 (일반)',
  '미용사 (피부)',
  '미용사 (네일)',
  '미용사 (메이크업)',
  '반려동물미용사',
  '레크리에이션 지도사',
  '바리스타',
  '공인중개사',
  '산후조리사',
];

export const cityOptions = [
  '서울',
  '부산',
  '인천',
  '대구',
  '광주',
  '대전',
  '울산',
];

export const districtMap: Record<string, string[]> = {
  서울: [
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '중구',
    '중랑구',
  ],
  부산: [
    '강서구',
    '금정구',
    '기장군',
    '남구',
    '동구',
    '동래구',
    '부산진구',
    '북구',
    '사상구',
    '사하구',
    '서구',
    '수영구',
    '연제구',
    '영도구',
    '중구',
    '해운대구',
  ],
  인천: [
    '강화군',
    '계양구',
    '남동구',
    '동구',
    '미추홀구',
    '부평구',
    '서구',
    '연수구',
    '옹진군',
    '중구',
  ],
  대구: [
    '군위군',
    '남구',
    '달서구',
    '달성군',
    '동구',
    '북구',
    '서구',
    '수성구',
    '중구',
  ],
  광주: ['광산구', '남구', '동구', '북구', '서구'],
  대전: ['대덕구', '동구', '서구', '유성구', '중구'],
  울산: ['남구', '동구', '북구', '울주군', '중구'],
};

export const trainingOptions = ['이론 위주', '실습 위주'];

import api from '@hook/api';

export interface Region {
  regionCode: string | null;
  regionName: string;
}

export interface ParsedRegionData {
  cityOptions: string[];
  districtMap: Record<string, string[]>;
  regionList: Region[];
}

export const fetchRegions = async (): Promise<ParsedRegionData> => {
  try {
    const response = await api.get<{ data: Region[] }>('/v1/region/all');
    const regions = response.data.data;

    const map: Record<string, string[]> = {};
    const cities: string[] = [];

    regions.forEach(({ regionName }) => {
      const parsing = regionName.trim().split(/\s+/);

      if (parsing.length < 2) return;

      const city = parsing[0];
      const district = parsing.slice(1).join(' ');

      if (!cities.includes(city)) {
        cities.push(city);
      }

      if (map[city]) {
        if (!map[city].includes(district)) {
          map[city].push(district);
        }
      } else {
        map[city] = [district];
      }
    });

    return {
      cityOptions: cities,
      districtMap: map,
      regionList: regions,
    };
  } catch (error) {
    console.error('지역 데이터를 가져오는 중 오류가 발생했습니다:', error);

    return {
      cityOptions,
      districtMap,
      regionList: [],
    };
  }
};
