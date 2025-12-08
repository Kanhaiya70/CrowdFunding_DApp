import React, { useState, useEffect, useMemo } from 'react'

import { DisplayCampaigns } from '../components'
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns, searchQuery } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (contract)
      fetchCampaigns();
  }, [address, contract]);

  const filteredCampaigns = useMemo(() => {
    // Current time in milliseconds
    const now = Date.now();
    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

    // Filter logic
    const activeCampaigns = campaigns.filter(campaign => {
      const deadlineEnd = campaign.deadline * 1000;
      const disappearTime = deadlineEnd + TWO_DAYS_MS;

      return now < disappearTime;
    });

    if (!searchQuery) return activeCampaigns;

    const lowered = searchQuery.toLowerCase();
    return activeCampaigns.filter((campaign) => {
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
      title="Discover Campaigns"
      isLoading={isLoading}
      campaigns={filteredCampaigns}
      emptyMessage={emptyMessage}
    />
  )
}

export default Home