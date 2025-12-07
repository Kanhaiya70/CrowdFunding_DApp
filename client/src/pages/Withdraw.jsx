import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';

const Withdraw = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getUserCampaigns, payoutToCreator } = useStateContext();

  const fetchMyCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) fetchMyCampaigns();
  }, [address, contract]);

  const handleWithdraw = async (e, campaign) => {
    e.stopPropagation(); // Prevent navigation when clicking withdraw
    setIsLoading(true);
    try {
      await payoutToCreator(campaign.pId);
      alert(`Payout requested for "${campaign.title}" successfully!`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Payout failed. Ensure target is met.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.pId}`, { state: campaign });
  }

  return (
    <>
      {isLoading && <Loader />}

      <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[24px] sm:p-10 p-4 border border-[#3a3a43] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>

        <div className="relative w-full text-center mb-10 z-10">
          <h1 className="font-epilogue font-black text-[25px] text-white uppercase tracking-widest">
            Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c6dfd] to-[#fa55dd]">Dashboard</span>
          </h1>
          <p className="font-epilogue font-normal text-[14px] text-[#808191] mt-2">
            Manage your project funds
          </p>
        </div>

        <div className="w-full flex flex-col gap-6 z-10 relative">
          {campaigns.length > 0 ? campaigns.map((campaign, index) => {
            const progress = calculateBarPercentage(campaign.target, campaign.amountCollected);
            const isTargetMet = parseFloat(campaign.amountCollected) >= parseFloat(campaign.target);
            // allow withdraw if target is met, AND not already claimed
            const canWithdraw = isTargetMet && !campaign.claimed;
            const remainingDays = daysLeft(campaign.deadline);
            const isExpired = remainingDays === 0;

            return (
              <div
                key={index}
                onClick={() => handleNavigate(campaign)}
                className="w-full p-6 bg-[#13131a] rounded-[20px] border border-[#3a3a43] hover:border-[#8c6dfd] hover:bg-[#1c1c24] hover:shadow-[0_0_20px_rgba(140,109,253,0.1)] hover:scale-[1.01] transition-all duration-300 ease-in-out flex flex-col md:flex-row items-center gap-6 cursor-pointer group"
              >
                <img src={campaign.image} alt="campaign" className="w-[80px] h-[80px] rounded-[10px] object-cover" />

                <div className="flex-1 w-full">
                  <h3 className="font-epilogue font-bold text-[18px] text-white truncate group-hover:text-[#8c6dfd] transition-colors">{campaign.title}</h3>
                  <div className="flex gap-4 mt-2 mb-3">
                    <span className="text-[#808191] text-xs">Target: <span className="text-white">{campaign.target} ETH</span></span>
                    <span className="text-[#808191] text-xs">deadline: <span className={isExpired ? "text-red-500" : "text-green-500"}>{remainingDays} days left</span></span>
                  </div>

                  <div className="w-full bg-[#2c2f32] rounded-full h-[10px] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8c6dfd] to-[#4acd8d]"
                      style={{ width: `${progress}%`, maxWidth: '100%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[#808191] text-xs font-bold">{campaign.amountCollected} ETH Raised</span>
                    <span className="text-[#4acd8d] text-xs font-bold">{progress}%</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => canWithdraw && handleWithdraw(e, campaign)}
                  disabled={!canWithdraw}
                  className={`px-6 py-3 rounded-[10px] font-epilogue font-bold text-sm uppercase tracking-wider border transition-all ${canWithdraw
                    ? 'bg-[#4acd8d] text-white border-[#4acd8d] cursor-pointer hover:bg-[#3fb57a] shadow-[0_0_20px_rgba(74,205,141,0.4)]'
                    : 'bg-[#2c2f32] text-[#808191] border-transparent cursor-not-allowed opacity-50'
                    }`}
                >
                  {campaign.claimed ? 'Funds Withdrawn' : (canWithdraw ? 'Withdraw Funds' : 'Goal Not Met')}
                </button>
              </div>
            );
          }) : (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <p className="font-epilogue font-semibold text-[16px] text-[#818183]">
                You haven't created any campaigns yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Withdraw;
