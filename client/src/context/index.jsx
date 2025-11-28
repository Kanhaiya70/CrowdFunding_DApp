import React, { useContext, createContext, useEffect, useState } from "react";
import { useAddress, useContract, useContractWrite, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
// import CrowdFundingABI from "../abi/CrowdFunding.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('theme') || 'dark';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const { contract } = useContract('0x05BB988268FB2cAA97ea2DA78A7167671565fd02');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
  if (!contract) {
    console.error("Contract not initialized or network mismatch");
    return;
  }

  try {
    const data = await contract.call("createCampaign", [
      address,                                     // _owner
      form.title,                                  // _title
      form.description,                            // _description
      form.target,
      Math.floor(new Date(form.deadline).getTime() / 1000), // _deadline (seconds)
      form.image                                   
    ]);

    console.log("Contract call success:", data);
    } catch (error) {
      console.error("Contract call failure:", error);
    }
  };

  const getCampaigns = async () => {
    if (!contract) return [];

    try {
      const all = await contract.call("getCampaigns");

      // Keep original contract index as pId so donations map correctly
      const parsedCampaigns = all.reduce((acc, campaign, idx) => {
        if (campaign.isDeleted) return acc;

        //   // Filter out deleted campaigns (done on frontend)
        // const active = all.filter((c) => !c.isDeleted);
        // // Parse campaigns for display
        // const parsedCampaigns = active.map((campaign, i) => ({
        //   owner: campaign.owner,
        //   title: campaign.title,
        //   description: campaign.description,
        //   target: ethers.utils.formatEther(campaign.target.toString()),
        //   deadline: campaign.deadline.toNumber(),
        //   amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString
        //   ()),
        //   image: campaign.image,
        //   pId: i
        // }));
        acc.push({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: ethers.utils.formatEther(campaign.target.toString()),
          deadline: campaign.deadline.toNumber(),
          amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
          image: campaign.image,
          pId: idx,
        });

        return acc;
      }, []);

      console.log("Active campaigns:", parsedCampaigns);
      return parsedCampaigns;
    } catch (error) {
      console.error("getCampaigns failed:", error);
      return [];
    }
  };


  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    // const data = await contract.call('donateToCampaign', [pId], {value: ethers.
    //   utils.parseEther(amount),});
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    const parsedAmount = typeof amount === 'string' ? amount : amount?.toString();
    if (!parsedAmount) {
      throw new Error("Invalid donation amount");
    }

    const data = await contract.call(
      'donateToCampaign',
      [Number(pId)],
      { value: ethers.utils.parseEther(parsedAmount) },
    );

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      });
    }

    return parsedDonations;
  }

  const deleteCampaign = async (pId) => {
    if (!contract) {
      console.error("Contract not initialized or network mismatch");
      return;
    }

    try {
      const data = await contract.call("deleteCampaign", [pId]);
      console.log("Campaign deleted:", data);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        deleteCampaign,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);