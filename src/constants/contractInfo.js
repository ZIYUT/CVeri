export const CONTRACT_ADDRESS = '0xfE990bb4e084D0d263259cF81a98bEB665bDA61a';

export const RESUME_REGISTRY_ABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'address', name: 'newAdmin', type: 'address' }],
    name: 'AdminAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'certifier', type: 'address' },
      { indexed: false, internalType: 'string', name: 'title', type: 'string' },
    ],
    name: 'CertifierAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'experienceHash', type: 'bytes32' },
      { indexed: false, internalType: 'string', name: 'cid', type: 'string' },
    ],
    name: 'ExperienceAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'experienceHash', type: 'bytes32' },
      { indexed: false, internalType: 'address', name: 'certifier', type: 'address' },
    ],
    name: 'ExperienceCertified',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'string', name: 'resumeCID', type: 'string' },
    ],
    name: 'ResumeUploaded',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: 'newAdmin', type: 'address' }],
    name: 'addAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'certifier', type: 'address' },
      { internalType: 'string', name: 'title', type: 'string' },
    ],
    name: 'addCertifier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'experienceHash', type: 'bytes32' },
      { internalType: 'string', name: 'cid', type: 'string' },
    ],
    name: 'addExperience',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'admins',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'authorizedCertifiers',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'certifierTitles',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'experienceHash', type: 'bytes32' }],
    name: 'certifyExperience',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'experienceCIDs',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'experienceHash', type: 'bytes32' }],
    name: 'getExperienceInfo',
    outputs: [
      { internalType: 'string', name: 'cid', type: 'string' },
      { internalType: 'address[]', name: 'certifiers', type: 'address[]' },
      { internalType: 'string[]', name: 'titles', type: 'string[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserResumeCID',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'experienceHash', type: 'bytes32' },
      { internalType: 'address', name: 'certifier', type: 'address' },
    ],
    name: 'isExperienceCertifiedBy',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'resumeCIDs',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'resumeCID', type: 'string' }],
    name: 'uploadResume',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const SUPPORTED_NETWORKS = {
  POLYGON: {
    name: 'Polygon Mainnet',
    chainId: '0x89',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  }
};
