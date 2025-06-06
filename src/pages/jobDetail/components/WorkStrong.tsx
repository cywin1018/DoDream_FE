import Info from '@assets/icons/info.svg?react';
import Divider from '@common/Divider';
import ToolTip from '@common/ToolTip';
import { useState } from 'react';

interface JobIntensityProps {
  physical: string;
  stress: string;
  relationship: string;
}

const WorkStrong = ({ physical, stress, relationship }: JobIntensityProps) => {
  const [visibleTooltip, setVisibleTooltip] = useState<
    null | 'physical' | 'stress' | 'relationship'
  >(null);

  const toggleTooltip = (key: 'physical' | 'stress' | 'relationship') => {
    setVisibleTooltip((prev) => (prev === key ? null : key));
  };
  return (
    <div className="mt-5 flex w-[712px] flex-col items-start rounded-[30px] border border-gray-300 bg-white px-[30px] pb-[30px] pt-10">
      <div className="text-gray-900 font-T03-B"> 업무 강도 </div>
      <Divider className="my-[30px]" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center gap-[56px]">
          <div className="text-gray-500 font-B01-M"> 직무 활동량</div>
          <div className="relative flex flex-row items-center gap-[10px]">
            <div className="text-gray-900 font-B01-M">{physical}</div>
            <div className="relative">
              <button onClick={() => toggleTooltip('physical')}>
                <Info className="text-[#A1A6B5]" />
              </button>
              {visibleTooltip === 'physical' && (
                <ToolTip
                  text="하루 동안 얼마나 몸을 움직여야 하는지를 나타내요"
                  onClose={() => setVisibleTooltip(null)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-[26px]">
          <div className="text-gray-500 font-B01-M"> 정신적 스트레스</div>
          <div className="relative flex flex-row gap-[10px]">
            <div className="text-gray-900 font-B01-M">{stress}</div>
            <div className="relative">
              <button onClick={() => toggleTooltip('stress')}>
                <Info className="text-[#A1A6B5]" />
              </button>
              {visibleTooltip === 'stress' && (
                <ToolTip
                  text="일을 하면서 느끼게 될 감정적 부담 정도를 나타내요"
                  onClose={() => setVisibleTooltip(null)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-[42px]">
          <div className="text-gray-500 font-B01-M"> 대인관계 빈도</div>
          <div className="relative flex flex-row gap-[10px]">
            <div className="text-gray-900 font-B01-M">{relationship}</div>
            <div className="relative">
              <button onClick={() => toggleTooltip('relationship')}>
                <Info className="text-[#A1A6B5]" />
              </button>
              {visibleTooltip === 'relationship' && (
                <ToolTip
                  text="업무 과정에서 타인과 소통하는 정도를 나타내요"
                  onClose={() => setVisibleTooltip(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkStrong;
