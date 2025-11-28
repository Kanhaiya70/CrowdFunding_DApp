import React, { useState, useEffect, useMemo } from 'react'

import { DisplayCampaigns } from '../components'
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns, searchQuery } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract)
      fetchCampaigns();
  }, [address, contract]);

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;

    const lowered = searchQuery.toLowerCase();
    return campaigns.filter((campaign) => {
      const titleMatch = campaign.title?.toLowerCase().includes(lowered);
      const descMatch = campaign.description?.toLowerCase().includes(lowered);
      const ownerMatch = campaign.owner?.toLowerCase().includes(lowered);
      return titleMatch || descMatch || ownerMatch;
    });
  }, [campaigns, searchQuery]);

  const emptyMessage = searchQuery
    ? `No campaigns found for "${searchQuery}".`
    : 'You have not created any campaigns yet.';

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={filteredCampaigns}
      emptyMessage={emptyMessage}
    />
  )
}

export default Profile