'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESS,
  RESUME_REGISTRY_ABI,
  SUPPORTED_NETWORKS,
} from '../../constants/contractInfo.js';

export default function RegisterCV() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [networkName, setNetworkName] = useState('');

  const connectWallet = async () => {
    try {
      setError('');
      setMessage('');

      if (!window.ethereum) {
        setError('Please install MetaMask to use this dApp');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setAccount(account);

      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const signer = await provider.getSigner();
      setSigner(signer);

      const network = await provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);

      if (chainId === SUPPORTED_NETWORKS.POLYGON.chainId) {
        setNetworkName(SUPPORTED_NETWORKS.POLYGON.name);
      } else {
        setError('Please connect to Polygon Mainnet');
        return;
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, RESUME_REGISTRY_ABI, signer);
      setContract(contract);

      setIsAdmin(await contract.admins(account));
      setMessage(`Wallet connected: ${account}`);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  // Wallet connection
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold">
          Resume Verification Admin Panel
        </h1>
      </div>

      <div className="flex justify-center mb-8">
        {!account ? (
          <button onClick={connectWallet} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            Connect MetaMask Wallet
          </button>
        ) : (
          <div>
            <p>Connected: {account}</p>
            <p>Network: {networkName}</p>
            <p>Admin Status: {isAdmin ? 'Admin' : 'Not Admin'}</p>
          </div>
        )}
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {message && <div className="text-green-500">{message}</div>}
    </div>
  );
}
