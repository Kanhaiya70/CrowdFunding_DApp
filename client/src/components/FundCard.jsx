import React from 'react'

import { tagType, thirdweb } from '../assets';
import { daysLeft } from '../utils';
import { useStateContext } from '../context';

// NOTE: We stripped the manual hover classes because Tilt handles the scale/transform now
// We keep the shadow and ring for aesthetics
const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, pId, handleClick }) => {
  const remainingDays = daysLeft(deadline);
  const { address, deleteCampaign } = useStateContext();

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent card click from triggering navigation
    await deleteCampaign(pId);
  };

  const activeScale = parseFloat(amountCollected) >= parseFloat(target);
  const isExpired = remainingDays === 0;

  return (
    <div onClick={handleClick} className='sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#4acd8d]/40 border border-transparent hover:border-[#4acd8d]/50'>
      <div className="relative w-full h-[158px]">
        <img src={image} alt='fund' className='w-full h-full object-cover rounded-[15px]' />

        {/* Status Overlays */}
        {(activeScale || isExpired) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[15px]">
            <p className={`font-epilogue font-bold text-[16px] ${activeScale ? 'text-[#4acd8d]' : 'text-[#b2b3bd]'}`}>
              {activeScale ? 'Successful' : 'Campaign Over'}
            </p>
          </div>
        )}
      </div>

      <div className='flex flex-col p-4'>
        <div className='flex flex-row items-center mb-[18px]'>
          <img src={tagType} alt='tag' className='w-[17px] h-[17px] object-contain' />
          <p className='ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]'>Education</p>
        </div>

        <div className='block'>
          <h3 className='font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate transition-colors group-hover:text-[#4acd8d]'>{title}</h3>
          <p className='mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate group-hover:text-[#b2b3bd] transition-colors'>{description}</p>
        </div>

        <div className='flex justify-between flex-wrap mt-[15px] gap-2'>
          <div className='flex flex-col'>
            <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>{amountCollected}</h4>
            <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>Raised of {target}</p>
          </div>

          <div className='flex flex-col'>
            <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>{remainingDays}</h4>
            <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>Days Left</p>
          </div>

          <div className='flex items-center mt-[20px] gap-[12px]'>
            <div className='w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]'>
              <img src={thirdweb} alt='user' className='w-1/2 h-1/2 object-contain' />
            </div>
            <p className='flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate'>by <span className='text-[#b2b3bd]'>{owner.slice(0, 15)}...{owner.slice(-4)}</span></p>
          </div>
        </div>

        {address === owner && (
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-[12px] px-3 py-2 rounded-md transition-all relative z-10"
          >
            Delete Campaign
          </button>
        )}
      </div>
    </div>
  )
}

export default FundCard
