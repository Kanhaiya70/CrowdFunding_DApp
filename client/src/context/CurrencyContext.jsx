import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');

  // Default fallback rates
  const [rates, setRates] = useState({
    ETH: 1,
    USD: 3500,
    INR: 281000,
    EUR: 3200,
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr,eur');
        const data = await response.json();

        if (data.ethereum) {
          setRates(prev => ({
            ...prev,
            USD: data.ethereum.usd,
            INR: data.ethereum.inr,
            EUR: data.ethereum.eur,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch currency rates:", error);
      }
    };

    fetchRates();
  }, []);

  const convert = (amountInETH) => {
    if (!amountInETH) return '0';
    const rate = rates[selectedCurrency] || 1;
    const converted = parseFloat(amountInETH) * rate;

    // Format based on currency
    if (selectedCurrency === 'ETH') {
      return `${parseFloat(converted).toFixed(6)} ETH`;
    } else {
      // Use locale formatting for fiat
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: selectedCurrency,
        maximumFractionDigits: 6
      }).format(converted);
    }
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, convert, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
