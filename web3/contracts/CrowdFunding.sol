// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        bool isDeleted;     // To delete or hide Campaign
        address[] donators;
        uint256[] donations;
    }
    
    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected += amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // function getCampaigns() public view returns (Campaign[] memory) {
    //     Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

    //     for(uint i = 0; i < numberOfCampaigns; i++)
    //     {
    //         Campaign storage item = campaigns[i];

    //         allCampaigns[i] = item;
    //     }

    //     return allCampaigns;
    // }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }


    // function getCampaigns() public view returns (Campaign[] memory) {
    //     uint256 count = 0;
    //     for (uint i = 0; i < numberOfCampaigns; i++) {
    //         if (!campaigns[i].isDeleted) {
    //             count++;
    //         }
    //     }

    //     Campaign[] memory activeCampaigns = new Campaign[](count);
    //     uint256 index = 0;
    //     for (uint i = 0; i < numberOfCampaigns; i++) {
    //         if (!campaigns[i].isDeleted) {
    //             activeCampaigns[index] = campaigns[i];
    //             index++;
    //         }
    //     }

    //     return activeCampaigns;
    // }

    // function deleteCampaign(uint256 _pId) public {
    //     Campaign storage campaign = campaigns[_pId];
    //     require(campaign.owner == msg.sender, "Not campaign owner");
    //     campaign.isDeleted = true;
    // }

    // Get all *active* campaigns (not deleted)
    // function getCampaigns() public view returns (Campaign[] memory) {
    //     uint256 count = 0;
    //     for (uint256 i = 0; i < numberOfCampaigns; i++) {
    //         if (!campaigns[i].isDeleted) {
    //             count++;
    //         }
    //     }

    //     Campaign[] memory activeCampaigns = new Campaign[](count);
    //     uint256 index = 0;

    //     for (uint256 i = 0; i < numberOfCampaigns; i++) {
    //         if (!campaigns[i].isDeleted) {
    //             activeCampaigns[index] = campaigns[i];
    //             index++;
    //         }
    //     }

    //     return activeCampaigns;
    // }

    // Delete campaign (only owner)
    function deleteCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "Not campaign owner");
        require(!campaign.isDeleted, "Already deleted");

        campaign.isDeleted = true;
    }
}