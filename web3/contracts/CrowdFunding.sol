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
        address[] donators;
        uint256[] donations;
        bool isActive;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    modifier onlyOwner(uint256 _id) {
        require(campaigns[_id].owner == msg.sender, unicode"Только владелец может выполнить это действие.");
        _;
    }

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, unicode"Крайний срок должен быть датой в будущем.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.isActive = true;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function editCampaign(uint256 _id, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public onlyOwner(_id) {
        require(campaigns[_id].isActive, "The campaign has been deleted.");

        Campaign storage campaign = campaigns[_id];

        if (bytes(_title).length > 0) {
            campaign.title = _title;
        }

        if (bytes(_description).length > 0) {
            campaign.description = _description;
        }

        if (_target > 0) {
            campaign.target = _target;
        }

        if (_deadline > 0) {
            campaign.deadline = _deadline;
        }

        if (bytes(_image).length > 0) {
            campaign.image = _image;
        }
    }


    function deleteCampaign(uint256 _id) public onlyOwner(_id) {
        campaigns[_id].isActive = false;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(campaigns[_id].isActive, unicode"Кампания удалена.");

        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns(bool _isActive) public view returns (uint256[] memory, Campaign[] memory) {
    uint256[] memory campaignIds;
    Campaign[] memory filteredCampaigns;
    uint256 count = 0;

    // Подсчет количества компаний с указанным статусом
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].isActive == _isActive) {
            count++;
        }
    }

    // Создание массива идентификаторов кампаний и массива компаний
    campaignIds = new uint256[](count);
    filteredCampaigns = new Campaign[](count);
    uint256 currentIndex = 0;

    // Заполнение массивов с указанным статусом компаний
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].isActive == _isActive) {
            campaignIds[currentIndex] = i;
            filteredCampaigns[currentIndex] = campaigns[i];
            currentIndex++;
        }
    }

    return (campaignIds, filteredCampaigns);
    }


    function userCampaigns() public view returns (Campaign[] memory) {
    uint256 count = 0;

    // Подсчет количества компаний с указанным пользователем
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].owner == msg.sender) {
            count++;
        }
    }

    // Создание массива компаний с указанным пользователем
    Campaign[] memory filteredCampaigns = new Campaign[](count);
    uint256 currentIndex = 0;

    // Заполнение массива компаний с указанным пользователем
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].owner == msg.sender) {
            filteredCampaigns[currentIndex] = campaigns[i];
            currentIndex++;
        }
    }

    return filteredCampaigns;
}
}
