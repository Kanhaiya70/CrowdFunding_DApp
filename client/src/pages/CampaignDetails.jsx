import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { useCurrency } from '../context/CurrencyContext';
import { CustomButton, CountBox, Loader } from '../components';
import PaymentSuccessCard from '../components/PaymentSuccessCard';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { donate, getDonations, getCampaigns, contract, address, connect } = useStateContext();
  const { convert, rates } = useCurrency();
  const [paymentCurrency, setPaymentCurrency] = useState('ETH');

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [campaign, setCampaign] = useState(state ?? null);

  const handlePaymentCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    const oldCurrency = paymentCurrency;

    if (amount && !isNaN(parseFloat(amount))) {
      const rateNew = rates[newCurrency] || 1;
      const rateOld = rates[oldCurrency] || 1;
      // Convert: Old -> ETH -> New
      // Value * (rateNew / rateOld)
      const val = parseFloat(amount);
      const newVal = (val * (rateNew / rateOld)).toFixed(6);
      setAmount(newVal);
    }
    setPaymentCurrency(newCurrency);
  };

  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [lastDonation, setLastDonation] = useState('');
  const hideTimer = useRef(null);

  const remainingDays = campaign ? daysLeft(campaign.deadline) : 0;
  const isExpired = remainingDays === 0;
  const isComplete = campaign ? parseFloat(campaign.amountCollected) >= parseFloat(campaign.target) : false;
  const canDonate = !isExpired && !isComplete;

  const fetchDonators = async () => {
    const data = await getDonations(id);
    setDonators(data);
  }

  const fetchCampaignDetails = async () => {
    const campaigns = await getCampaigns();
    const found = campaigns.find((item) => item.pId === Number(id));
    setCampaign(found ?? null);
  };

  useEffect(() => {
    if (contract) {
      fetchDonators();
      fetchCampaignDetails();
    }
  }, [contract, address, id]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const [errorMessage, setErrorMessage] = useState('');

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      setErrorMessage('Please enter a valid amount greater than zero.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (!address) {
      connect?.();
      return;
    }

    if (address === campaign.owner) {
      setErrorMessage("You cannot donate to your own campaign.");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    try {
      let donationAmount = amount;
      if (paymentCurrency !== 'ETH') {
        const rate = rates[paymentCurrency] || 1;
        // Convert input to ETH: amount / rate
        // Fix: Use toFixed(18) to avoid "fractional component exceeds decimals" error
        donationAmount = (parseFloat(amount) / rate).toFixed(18);
      }

      await donate(id, donationAmount);
      await fetchDonators();

      await fetchCampaignDetails();

      setLastDonation(amount);
      setShowPaymentCard(true);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      hideTimer.current = setTimeout(() => setShowPaymentCard(false), 4000);
      setAmount('');
    } catch (error) {
      console.error('Donation failed:', error);
      setErrorMessage("Transaction failed. Please try again.");
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  }

  if (!campaign) {
    return (
      <div className="text-white">
        {isLoading ? "Loading..." : "Campaign not found"}
      </div>
    );
  }

  return (
    <div>
      {isLoading && <Loader />}
      {showPaymentCard && <PaymentSuccessCard amount={lastDonation} />}

      {/* Error Overlay */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1c1c24] p-8 rounded-[20px] shadow-2xl border border-red-500/50 max-w-sm w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-epilogue font-bold text-[22px] text-white mb-2">Oops!</h3>
            <p className="font-epilogue font-normal text-gray-400 mb-6">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage('')}
              className="bg-[#2c2f32] hover:bg-[#3a3a43] text-white font-bold py-3 px-8 rounded-xl transition-all w-full"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* GTA-Style Hero Section (Theme-Compatible) */}
      <div className="relative w-full h-[500px] rounded-[24px] overflow-hidden group">
        <img src={campaign.image} alt="campaign" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        {/* Hero Text */}
        <div className="absolute bottom-10 left-10 max-w-[800px]">
          <h1 style={{ color: '#ffffff' }} className="font-epilogue font-black text-[42px] uppercase tracking-wide drop-shadow-lg leading-tight">
            {campaign.title}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-[#4acd8d]/20 backdrop-blur-md border border-[#4acd8d]/50 px-4 py-1 rounded-full">
              <p className="text-[#4acd8d] font-bold text-[14px] uppercase tracking-wider">Verified Campaign</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <p style={{ color: 'rgba(255,255,255,0.8)' }} className="text-sm font-bold uppercase">Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar (Floating) */}
      <div className="relative -mt-8 px-10 z-10 w-full">
        <div className="bg-[#1c1c24] border border-[#3a3a43] p-6 rounded-[20px] shadow-2xl">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-4xl font-black text-white">{calculateBarPercentage(campaign.target, campaign.amountCollected)}%</span>
              <span className="text-[#808191] ml-2 text-lg font-bold uppercase">Funded</span>
            </div>
            <p className="text-[#808191] font-medium">{convert(campaign.amountCollected)} raised of {convert(campaign.target)}</p>
          </div>
          <div className='relative w-full h-[16px] bg-[#2c2f32] rounded-full overflow-hidden mb-2'>
            <div
              className='absolute h-full bg-gradient-to-r from-[#8c6dfd] via-[#da4ea2] to-[#4acd8d] rounded-full shadow-[0_0_20px_rgba(74,205,141,0.5)] transition-all duration-1000 ease-out'
              style={{ width: `${calculateBarPercentage(campaign.target, campaign.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px] px-2'>
        <div className='flex-1 flex-col'>
          {/* Stats Grid - Floating Glass Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-[30px] mb-10'>
            <div className="bg-[#1c1c24] border border-[#3a3a43] p-6 rounded-[20px] hover:border-[#8c6dfd]/50 transition-colors group">
              <h4 className="font-epilogue font-bold text-[32px] text-white group-hover:text-[#8c6dfd] transition-colors">{remainingDays}</h4>
              <p className="font-epilogue font-normal text-[14px] text-[#808191] uppercase tracking-wider mt-2">Days Left</p>
            </div>
            <div className="bg-[#1c1c24] border border-[#3a3a43] p-6 rounded-[20px] hover:border-[#8c6dfd]/50 transition-colors group">
              <h4 className="font-epilogue font-bold text-[32px] text-white group-hover:text-[#8c6dfd] transition-colors">{convert(campaign.amountCollected)}</h4>
              <p className="font-epilogue font-normal text-[14px] text-[#808191] uppercase tracking-wider mt-2">Raised</p>
            </div>
            <div className="bg-[#1c1c24] border border-[#3a3a43] p-6 rounded-[20px] hover:border-[#8c6dfd]/50 transition-colors group">
              <h4 className="font-epilogue font-bold text-[32px] text-white group-hover:text-[#8c6dfd] transition-colors">{donators.length}</h4>
              <p className="font-epilogue font-normal text-[14px] text-[#808191] uppercase tracking-wider mt-2">Total Backers</p>
            </div>
          </div>

          <div className='flex flex-col gap-[40px]'>
            {/* Creator Section */}
            <div>
              <h4 className='font-epilogue font-bold text-[22px] text-white uppercase tracking-wide mb-6 border-l-4 border-[#8c6dfd] pl-4'>Creator</h4>
              <div className='flex items-center gap-[20px] bg-[#1c1c24] p-6 rounded-[20px] border border-[#3a3a43]'>
                <div className='w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[#2c2f32] border-2 border-[#8c6dfd]'>
                  <img src={thirdweb} alt='user' className='w-[60%] h-[60%] object-contain' />
                </div>
                <div>
                  <h4 className='font-epilogue font-bold text-[18px] text-white break-all'>{campaign.owner}</h4>
                  <p className='mt-[4px] font-epilogue font-medium text-[14px] text-[#808191]'>Verified Creator • 10 Campaigns</p>
                </div>
              </div>
            </div>

            {/* Story Section */}
            <div>
              <h4 className='font-epilogue font-bold text-[22px] text-white uppercase tracking-wide mb-6 border-l-4 border-[#8c6dfd] pl-4'>The Story</h4>
              <div className='mt-[20px] bg-[#1c1c24]/50 p-6 rounded-[20px] border border-[#3a3a43]'>
                <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[30px] text-justify tracking-wide'>
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Donators Section */}
            <div>
              <h4 className='font-epilogue font-bold text-[22px] text-white uppercase tracking-wide mb-6 border-l-4 border-[#8c6dfd] pl-4'>Recent Backers</h4>
              <div className='mt-[20px] flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar p-2'>
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center p-4 bg-[#1c1c24] rounded-[14px] border border-[#3a3a43] hover:border-[#4acd8d]/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#2c2f32] flex items-center justify-center font-bold text-[#4acd8d]">
                        {index + 1}
                      </div>
                      <p className="font-epilogue font-medium text-[16px] text-[#b2b3bd] truncate max-w-[200px] sm:max-w-none">
                        {item.donator}
                      </p>
                    </div>
                    <p className="font-epilogue font-bold text-[16px] text-[#4acd8d]">
                      {convert(item.donation)}
                    </p>
                  </div>
                )) : (
                  <div className="bg-[#1c1c24] p-6 rounded-[14px] text-center border border-dashed border-[#808191]/30">
                    <p className='font-epilogue font-normal text-[16px] text-[#808191]'>No backers yet. Be the first to join the movement!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Funding Terminal */}
        <div className='flex-1 md:max-w-[380px] w-full'>
          <div className='sticky top-24 flex flex-col p-8 bg-[#1c1c24] rounded-[24px] border border-[#8c6dfd]/20 shadow-[0_0_30px_rgba(140,109,253,0.1)]'>
            <h4 className='font-epilogue font-bold text-[24px] text-white uppercase tracking-wide mb-6'>Select Funding</h4>

            <div className='w-full'>
              <div className="relative mb-6">
                <input
                  type='number'
                  placeholder={`0.1 ${paymentCurrency}`}
                  step='0.01'
                  className='w-full py-[16px] pl-[60px] pr-[100px] outline-none border-[2px] border-[#2c2f32] focus:border-[#8c6dfd] bg-[#13131a] font-epilogue text-white text-[24px] font-bold placeholder:text-[#4b5264] rounded-[12px] transition-all'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!canDonate}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-4">
                  <select
                    value={paymentCurrency}
                    onChange={handlePaymentCurrencyChange}
                    className="bg-[#2c2f32] text-white font-epilogue text-[14px] outline-none border border-[#3a3a43] rounded-[8px] px-2 py-1 cursor-pointer"
                  >
                    <option value="ETH">ETH</option>
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className='p-5 bg-[#13131a] rounded-[16px] border border-[#3a3a43] mb-6'>
                <h4 className='font-epilogue font-bold text-[14px] leading-[22px] text-white uppercase mb-2'>Why Support?</h4>
                <p className='font-epilogue font-normal text-[13px] leading-[20px] text-[#808191]'>
                  "Back it because you believe in it. Support the project for no reward, just because it speaks to you."
                </p>
              </div>

              {canDonate ? (
                <CustomButton
                  btnType='button'
                  title='FUND CAMPAIGN'
                  styles='w-full bg-gradient-to-r from-[#8c6dfd] to-[#7f5ad5] hover:from-[#9d84fd] hover:to-[#8c6dfd] shadow-lg shadow-[#8c6dfd]/30 font-bold text-[16px] py-4 rounded-[12px] uppercase tracking-wider transform hover:scale-[1.02] transition-all duration-300'
                  handleClick={handleDonate}
                />
              ) : (
                <div className="w-full py-4 bg-[#2c2f32] rounded-[12px] text-center">
                  <p className="font-epilogue font-bold text-[#808191] uppercase tracking-wide">
                    {isComplete ? 'Campaign Funded' : 'Campaign Expired'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails