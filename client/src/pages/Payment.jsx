import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { useCurrency } from '../context/CurrencyContext';
import { Loader } from '../components';
import { daysLeft } from '../utils';

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [contributions, setContributions] = useState([]);
  const { address, contract, getCampaigns, getDonations, refundToBacker } = useStateContext();
  const { convert } = useCurrency();

  const fetchContributions = async () => {
    setIsLoading(true);
    const allCampaigns = await getCampaigns();
    const userContributions = [];

    for (const campaign of allCampaigns) {
      const donations = await getDonations(campaign.pId);
      const myDonations = donations.filter(d => d.donator.toLowerCase() === address.toLowerCase());

      if (myDonations.length > 0) {
        myDonations.forEach(donation => {
          userContributions.push({
            ...campaign,
            donationAmount: donation.donation,
            donatorAddress: donation.donator
          });
        });
      }
    }

    setContributions(userContributions);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) fetchContributions();
  }, [address, contract]);

  const handleRefund = async (campaign) => {
    setIsLoading(true);
    try {
      await refundToBacker(campaign.pId);
      alert("Refund processed successfully! Check your wallet.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Refund failed. Ensure campaign has ended and goal was NOT met.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[24px] sm:p-10 p-4 border border-[#3a3a43] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>

      <div className="relative w-full text-center mb-10 z-10">
        <h1 className="font-epilogue font-black text-[25px] text-white uppercase tracking-widest">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c6dfd] to-[#fa55dd]">Pledges</span>
        </h1>
        <p className="font-epilogue font-normal text-[14px] text-[#808191] mt-2">
          Track your contributions and refunds
        </p>
      </div>

      {isLoading && <Loader />}

      {!isLoading && (
        <div className="w-full flex flex-col gap-4 z-10 min-h-[300px]">
          {contributions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#3a3a43]">
                    <th className="p-4 font-epilogue font-bold text-[#808191] uppercase text-sm">Campaign</th>
                    <th className="p-4 font-epilogue font-bold text-[#808191] uppercase text-sm">Amount</th>
                    <th className="p-4 font-epilogue font-bold text-[#808191] uppercase text-sm">Status</th>
                    <th className="p-4 font-epilogue font-bold text-[#808191] uppercase text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((item, index) => {
                    const isTargetMet = parseFloat(item.amountCollected) >= parseFloat(item.target);
                    const isExpired = daysLeft(item.deadline) === 0;

                    // Refund Available if: Expired AND Target NOT Met
                    const isRefundAvailable = isExpired && !isTargetMet;

                    return (
                      <tr key={index} className="hover:bg-[#2c2f32] transition-colors border-b border-[#3a3a43]/50 last:border-0">
                        <td className="p-4 font-epilogue text-white font-semibold flex items-center gap-3">
                          <img src={item.image} alt="campaign" className="w-10 h-10 rounded-full object-cover" />
                          <span className="truncate max-w-[150px]">{item.title}</span>
                        </td>
                        <td className="p-4 font-epilogue font-bold text-[#4acd8d]">
                          {convert(item.donationAmount)}
                        </td>
                        <td className="p-4">
                          {isExpired ? (
                            isTargetMet
                              ? <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">SUCCESSFUL</span>
                              : <span className="text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">FAILED</span>
                          ) : (
                            <span className="text-blue-500 text-xs font-bold bg-blue-500/10 px-2 py-1 rounded">ACTIVE</span>
                          )}
                        </td>
                        <td className="p-4">
                          {isRefundAvailable ? (
                            <button
                              onClick={() => handleRefund(item)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-[0_4px_10px_rgba(239,68,68,0.4)]"
                            >
                              Claim Refund
                            </button>
                          ) : (
                            <span className="text-[#808191] text-xs">--</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <p className="font-epilogue font-semibold text-[16px] text-[#818183]">
                No pledges found.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;
