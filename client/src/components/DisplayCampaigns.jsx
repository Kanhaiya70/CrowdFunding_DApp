import React from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from './Loader';
import FundCard from './FundCard';

const DisplayCampaigns = ({ title, isLoading, campaigns = [], emptyMessage = 'You have not created any campaigns yet.' }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.pId}`, { state: campaign });
  };

  return (
    <div className='relative bg-[#1c1c24] flex justify-center items-center flex-col rounded-[24px] sm:p-10 p-4 border border-[#3a3a43] overflow-hidden group'>
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8c6dfd]/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Modern Header */}
      <div className='relative flex flex-col justify-center items-center p-[20px] w-full bg-[#1c1c24] rounded-[20px] border border-[#3a3a43] shadow-[0_0_50px_rgba(140,109,253,0.15)] mb-[30px]'>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#8c6dfd] rounded-b-lg shadow-[0_0_10px_#8c6dfd]"></div>
        <h1 className="font-epilogue font-black sm:text-[25px] text-[18px] leading-[30px] text-white uppercase tracking-widest drop-shadow-md text-center">
          {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c6dfd] to-[#fa55dd]">({campaigns?.length || 0})</span>
        </h1>
      </div>

      <div className="flex flex-wrap mt-[20px] gap-[26px] z-10 w-full justify-center sm:justify-start">
        {isLoading && (
          <Loader />
        )}

        {!isLoading && campaigns?.length === 0 && (
          <div className="w-full flex justify-center items-center p-10 bg-[#13131a] rounded-[20px] border border-dashed border-[#3a3a43]">
            <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
              {emptyMessage}
            </p>
          </div>
        )}

        {!isLoading &&
          campaigns?.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={campaign.id || campaign.pId}
              {...campaign}
              pId={campaign.pId}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
