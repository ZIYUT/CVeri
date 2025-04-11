// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResumeRegistry {
    // 多管理员集合，只有管理员才能添加认证者
    mapping(address => bool) public admins;

    // 存储用户的简历哈希（指向 IPFS）
    mapping(address => string) public resumeCIDs;
    
    // 存储每个经历的认证者
    mapping(bytes32 => address[]) private experienceCertifications;
    
    // 授权的认证者
    mapping(address => bool) public authorizedCertifiers;
    
    // 存储认证者的标题/组织
    mapping(address => string) public certifierTitles;
    
    // 存储经历哈希到 IPFS CID 的映射
    mapping(bytes32 => string) public experienceCIDs;
    
    // 事件
    event ResumeUploaded(address indexed user, string resumeCID);
    event ExperienceCertified(bytes32 indexed experienceHash, address certifier);
    event CertifierAdded(address indexed certifier, string title);
    event ExperienceAdded(bytes32 indexed experienceHash, string cid);
    event AdminAdded(address indexed newAdmin);
    
    constructor() {
        // 构造函数中将合约部署者设置为管理员
        admins[msg.sender] = true;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not authorized");
        _;
    }
    
    // 添加新的管理员，只允许现有管理员调用
    function addAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }
    
    // 添加认证者及其标题，只允许管理员调用
    function addCertifier(address certifier, string calldata title) external onlyAdmin {
        authorizedCertifiers[certifier] = true;
        certifierTitles[certifier] = title;
        emit CertifierAdded(certifier, title);
    }
    
    // 用户上传经历，传入经历哈希和IPFS CID
    function addExperience(bytes32 experienceHash, string calldata cid) external {
        experienceCIDs[experienceHash] = cid;
        emit ExperienceAdded(experienceHash, cid);
    }
    
    // 用户上传简历CID（IPFS哈希）
    function uploadResume(string calldata resumeCID) external {
        resumeCIDs[msg.sender] = resumeCID;
        emit ResumeUploaded(msg.sender, resumeCID);
    }
    
    // 认证简历中的经历
    function certifyExperience(bytes32 experienceHash) external {
        require(authorizedCertifiers[msg.sender], "Not an authorized certifier");
        experienceCertifications[experienceHash].push(msg.sender);
        emit ExperienceCertified(experienceHash, msg.sender);
    }
    
    // 获取某个经历的所有信息
    function getExperienceInfo(bytes32 experienceHash) external view returns (
        string memory cid,
        address[] memory certifiers,
        string[] memory titles
    ) {
        cid = experienceCIDs[experienceHash];
        certifiers = experienceCertifications[experienceHash];
        titles = new string[](certifiers.length);
        
        for (uint i = 0; i < certifiers.length; i++) {
            titles[i] = certifierTitles[certifiers[i]];
        }
        
        return (cid, certifiers, titles);
    }
    
    // 获取用户简历CID
    function getUserResumeCID(address user) external view returns (string memory) {
        return resumeCIDs[user];
    }
    
    // 检查经历是否已被特定认证者认证
    function isExperienceCertifiedBy(bytes32 experienceHash, address certifier) external view returns (bool) {
        address[] memory certifiers = experienceCertifications[experienceHash];
        for (uint i = 0; i < certifiers.length; i++) {
            if (certifiers[i] == certifier) {
                return true;
            }
        }
        return false;
    }
}