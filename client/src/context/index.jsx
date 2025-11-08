import React, { useContext, createContext, children } from "react";
import { useAddress, useContract, useContractWrite, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
// import CrowdFundingABI from "../abi/CrowdFunding.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x05BB988268FB2cAA97ea2DA78A7167671565fd02');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  // const publishCampaign = async (form) => {
  //   console.log("DEBUG: contract =", contract);

  //   if(!contract) {
  //     console.log("Contract not loaded! Check address or network.");
  //     return;
  //   }

  //   try{
  //     const data = await createCampaign([
  //       address,  // owner
  //       form.title, // title
  //       form.description, // description
  //       form.target,  
  //       Math.floor(new Date(form.deadline).getTime() / 1000),  // deadline
  //       form.image
  //     ])
  //     console.log("Contract call success!", data);
  //   }
  //   catch (error) {
  //     console.log("Contract call failure!", error);
  //   }
  // }

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
      // ethers.utils.parseUnits(form.target.toString(), 18), // _target (in wei)
      form.target,
      Math.floor(new Date(form.deadline).getTime() / 1000), // _deadline (seconds)
      form.image                                   // _image
    ]);

    console.log("Contract call success:", data);
    } catch (error) {
      console.error("Contract call failure:", error);
    }
  };

  // const getCampaigns = async () => {
  //   const campaigns = await contract.call('getCampaigns');

  //   const parsedCampaigns = campaigns.map((campaign, i) => ({
  //     owner: campaign.owner,
  //     title: campaign.title,
  //     description: campaign.description,
  //     target: ethers.utils.formatEther(campaign.target.toString()),
  //     deadline: campaign.deadline.toNumber(),
  //     amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
  //     image: campaign.image,
  //     pId: i
  //   }));

  //   console.log(parsedCampaigns);
  //   return parsedCampaigns;
  // };

  const getCampaigns = async () => {
    if (!contract) return [];

    try {
      const all = await contract.call("getCampaigns");

      // Filter out deleted campaigns (done on frontend)
      const active = all.filter((c) => !c.isDeleted);

      // Parse campaigns for display
      const parsedCampaigns = active.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i
      }));

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
        deleteCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);