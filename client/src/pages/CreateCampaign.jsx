import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { useStateContext } from '../context'
import { useCurrency } from '../context/CurrencyContext'

import { createCampaign, money } from '../assets'
import { CustomButton, FormField, Loader } from '../components'
import { checkIfImage } from '../utils'

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const { rates } = useCurrency();
  const [inputCurrency, setInputCurrency] = useState('ETH');
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    const oldCurrency = inputCurrency;

    if (form.target && !isNaN(parseFloat(form.target))) {
      const rateNew = rates[newCurrency] || 1;
      const rateOld = rates[oldCurrency] || 1;
      // Convert: Old -> ETH -> New
      // Value * (rateNew / rateOld)
      const val = parseFloat(form.target);
      const newVal = (val * (rateNew / rateOld)).toFixed(6); // Standard fiat precision
      setForm({ ...form, target: newVal });
    }
    setInputCurrency(newCurrency);
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDATION START ---
    if (!form.name || !form.title || !form.description || !form.target || !form.deadline || !form.image) {
      alert("Please fill in all fields.");
      return;
    }

    const targetAmount = parseFloat(form.target);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert("Goal must be a positive number.");
      return;
    }

    const deadlineDate = new Date(form.deadline);
    const currentDate = new Date();
    if (deadlineDate <= currentDate) {
      alert("Deadline must be in the future.");
      return;
    }
    // --- VALIDATION END ---

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true)

        // Convert to ETH if needed
        let targetInEth = form.target;
        if (inputCurrency !== 'ETH') {
          const rate = rates[inputCurrency] || 1;
          // Fix: Use toFixed(18) to avoid "fractional component exceeds decimals" error
          targetInEth = (parseFloat(form.target) / rate).toFixed(18);
        }

        await createCampaign({ ...form, target: ethers.utils.parseUnits(targetInEth, 18) })
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    });
  }

  return (
    <div className='relative bg-[#1c1c24] flex justify-center items-center flex-col rounded-[24px] sm:p-10 p-4 border border-[#3a3a43] overflow-hidden group'>
      {isLoading && <Loader />}

      {/* Background Ambience - CSS Pattern */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8c6dfd]/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Modern Header - "The Setup" */}
      <div className='relative flex flex-col justify-center items-center p-[40px] w-full bg-[#1c1c24] rounded-[20px] border border-[#3a3a43] shadow-[0_0_50px_rgba(140,109,253,0.15)] mb-[40px]'>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#8c6dfd] rounded-b-lg shadow-[0_0_10px_#8c6dfd]"></div>
        <h1 className='font-epilogue font-black sm:text-[45px] text-[30px] leading-[48px] text-white uppercase tracking-widest drop-shadow-md'>
          Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c6dfd] to-[#fa55dd] drop-shadow-none">Hustle</span>
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <div className="h-[1px] w-10 bg-[#808191]"></div>
          <p className="font-epilogue font-bold text-[#808191] uppercase tracking-[0.3em] text-[12px]">New Campaign Protocol</p>
          <div className="h-[1px] w-10 bg-[#808191]"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-[30px] z-10'>
        <div className='flex flex-wrap gap-[40px]'>
          <label className="flex-1 w-full flex flex-col group">
            <span className="font-epilogue font-bold text-[14px] leading-[22px] text-[#808191] mb-[10px] uppercase tracking-wider group-hover:text-[#4acd8d] transition-colors">YOUR IDENTITY *</span>
            <input
              required
              value={form.name}
              onChange={(e) => handleFormFieldChange('name', e)}
              type="text"
              placeholder="John Doe"
              className="py-[18px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[16px] placeholder:text-[#4b5264] rounded-[12px] sm:min-w-[300px] focus:border-[#4acd8d] focus:shadow-[0_0_20px_rgba(74,205,141,0.2)] transition-all duration-300"
            />
          </label>
          <label className="flex-1 w-full flex flex-col group">
            <span className="font-epilogue font-bold text-[14px] leading-[22px] text-[#808191] mb-[10px] uppercase tracking-wider group-hover:text-[#4acd8d] transition-colors">OPERATION TITLE *</span>
            <input
              required
              value={form.title}
              onChange={(e) => handleFormFieldChange('title', e)}
              type="text"
              placeholder="Give it a catchy name"
              className="py-[18px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[16px] placeholder:text-[#4b5264] rounded-[12px] sm:min-w-[300px] focus:border-[#4acd8d] focus:shadow-[0_0_20px_rgba(74,205,141,0.2)] transition-all duration-300"
            />
          </label>
        </div>

        <label className="flex-1 w-full flex flex-col group">
          <span className="font-epilogue font-bold text-[14px] leading-[22px] text-[#808191] mb-[10px] uppercase tracking-wider group-hover:text-[#4acd8d] transition-colors">THE STORY *</span>
          <textarea
            required
            value={form.description}
            onChange={(e) => handleFormFieldChange('description', e)}
            rows={5}
            placeholder="What's the plan? Convince the backers."
            className="py-[18px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[16px] placeholder:text-[#4b5264] rounded-[12px] sm:min-w-[300px] focus:border-[#4acd8d] focus:shadow-[0_0_20px_rgba(74,205,141,0.2)] transition-all duration-300"
          />
        </label>

        {/* The Loot Bag Banner */}
        <div className='w-full flex justify-start items-center p-6 bg-gradient-to-r from-[#8c6dfd] to-[#da4ea2] rounded-[16px] shadow-[0_10px_40px_rgba(140,109,253,0.3)] transform transition-transform hover:scale-[1.01] duration-300 border border-white/10'>
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-md shadow-inner">
            <img src={money} alt='money' className='w-[40px] h-[40px] object-contain' />
          </div>
          <div className="ml-[20px]">
            <h4 className='font-epilogue font-black text-[22px] text-white uppercase tracking-wide'>The Take is Yours</h4>
            <p className="font-epilogue font-medium text-white/80">You get 100% of the raised amount. No cuts.</p>
          </div>
        </div>

        <div className='flex flex-wrap gap-[40px]'>
          <label className="flex-1 w-full flex flex-col group">
            <span className="font-epilogue font-bold text-[14px] leading-[22px] text-[#808191] mb-[10px] uppercase tracking-wider group-hover:text-[#4acd8d] transition-colors">FUNDING GOAL *</span>
            <div className="flex bg-[#1c1c24] border-[2px] border-[#3a3a43] rounded-[12px] focus-within:border-[#4acd8d] focus-within:shadow-[0_0_20px_rgba(74,205,141,0.2)] transition-all duration-300">
              <input
                required
                value={form.target}
                onChange={(e) => handleFormFieldChange('target', e)}
                type="text"
                placeholder={`0.50 ${inputCurrency}`}
                className="flex-1 py-[18px] sm:px-[25px] px-[15px] outline-none bg-transparent font-epilogue text-white text-[16px] placeholder:text-[#4b5264]"
              />
              <select
                value={inputCurrency}
                onChange={handleCurrencyChange}
                className="bg-transparent text-white font-epilogue outline-none border-l border-[#3a3a43] px-3 cursor-pointer mr-2"
              >
                <option value="ETH" className="bg-[#1c1c24]">ETH</option>
                <option value="USD" className="bg-[#1c1c24]">USD</option>
                <option value="INR" className="bg-[#1c1c24]">INR</option>
                <option value="EUR" className="bg-[#1c1c24]">EUR</option>
              </select>
            </div>
          </label>
          <label className="flex-1 w-full flex flex-col group">
            <span className="font-epilogue font-bold text-[14px] leading-[22px] text-[#808191] mb-[10px] uppercase tracking-wider group-hover:text-[#4acd8d] transition-colors">DEADLINE *</span>
            <input
              required
              value={form.deadline}
              onChange={(e) => handleFormFieldChange('deadline', e)}
              type="date"
              className="py-[18px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[16px] placeholder:text-[#4b5264] rounded-[12px] sm:min-w-[300px] focus:border-[#4acd8d] focus:shadow-[0_0_20px_rgba(74,205,141,0.2)] transition-all duration-300"
            />
          </label>
        </div>

        <label className="flex-1 w-full flex flex-col group">
          <span className="font-epilogue font-bold text-[14px] leading-[22px] text-[#808191] mb-[10px] uppercase tracking-wider group-hover:text-[#4acd8d] transition-colors">CAMPAIGN VISUALS *</span>
          <input
            required
            value={form.image}
            onChange={(e) => handleFormFieldChange('image', e)}
            type="url"
            placeholder="Place Image URL of your Campaign"
            className="py-[18px] sm:px-[25px] px-[15px] outline-none border-[2px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[16px] placeholder:text-[#4b5264] rounded-[12px] sm:min-w-[300px] focus:border-[#4acd8d] focus:shadow-[0_0_20px_rgba(74,205,141,0.2)] transition-all duration-300"
          />
        </label>

        <div className='flex justify-center items-center mt-[20px]'>
          <CustomButton
            btnType="submit"
            title="EXECUTE LAUNCH"
            styles="bg-gradient-to-r from-[#1dc071] to-[#0f8a4f] hover:from-[#25d37d] hover:to-[#1dc071] min-w-[300px] py-4 text-[18px] font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(29,192,113,0.4)] transform hover:scale-105 transition-all duration-300"
          />
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign;