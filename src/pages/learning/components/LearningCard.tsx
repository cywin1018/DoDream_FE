import Like from '@assets/icons/like.svg?react';
import PurpleHeartIcon from '@assets/icons/fullheart.svg?react';
import { AcademyItem } from '@validation/academy/academySchema.ts';

interface LearningCardProps {
  item: AcademyItem;
  isScrap?: boolean;
  onScrapClick?: (e: React.MouseEvent) => void;
}

const LearningCard = ({
  item,
  isScrap = false,
  onScrapClick,
}: LearningCardProps) => {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onScrapClick) {
      onScrapClick(e);
    }
  };

  return (
    <div className="flex h-[330px] w-[388px] flex-col justify-between rounded-[30px] border border-gray-200 bg-white p-6 transition-shadow hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div>
        <div className="flex items-start justify-between">
          <button
            type="button"
            onClick={handleScrapClick}
            aria-label={isLoggedIn ? '관심 교육 과정 담기' : '로그인 필요'}
            className={`ml-auto ${!isLoggedIn ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {isScrap ? (
              <PurpleHeartIcon className="h-6 w-6" />
            ) : (
              <Like className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>

        <div className="mt-[12px] text-gray-500 font-B03-M">
          {item.subTitle}
        </div>

        <h3 className="mt-[12px] text-black font-T04-SB">{item.title}</h3>

        <div className="mt-[16px] flex flex-wrap gap-0.5">
          <span className="whitespace-nowrap px-2 py-1 text-gray-500 font-B03-M">
            # {item.address}
          </span>
          <span className="whitespace-nowrap px-2 py-1 text-gray-500 font-B03-M">
            # {item.traDuration}
          </span>
          <span className="whitespace-nowrap px-2 py-1 text-gray-500 font-B03-M">
            # {item.traStartDate} ~ {item.traEndDate}
          </span>
        </div>
      </div>

      <div className="mt-auto flex justify-end">
        <div className="rounded-[10px] bg-purple-50 px-4 py-2">
          <span className="text-purple-500 font-B01-B">{item.realMan}</span>
        </div>
      </div>
    </div>
  );
};

export default LearningCard;
