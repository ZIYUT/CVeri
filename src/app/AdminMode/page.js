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
  
  const [verifierAddress, setVerifierAddress] = useState('');

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SUPPORTED_NETWORKS.POLYGON.chainId,
                chainName: SUPPORTED_NETWORKS.POLYGON.name,
                rpcUrls: ['https://polygon-rpc.com'],
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://polygonscan.com'],
              },
            ],
          });
        } catch (addError) {
          setError('Failed to add network to MetaMask');
        }
      } else {
        setError('Failed to switch network');
      }
    }
  };

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

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };

    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          setAccount(null);
          setContract(null);
          setIsAdmin(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const addVerifier = async () => {
    if (!verifierAddress) {
      setError('Please enter a verifier address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      if (!ethers.isAddress(verifierAddress)) {
        setError('Invalid Ethereum address');
        setLoading(false);
        return;
      }
      
      const tx = await contract.addVerifier(verifierAddress);
      setMessage('Adding verifier. Please wait for confirmation...');
      
      await tx.wait();
      setMessage(`Verifier ${verifierAddress} added successfully!`);
      setVerifierAddress('');
    } catch (err) {
      console.error('Error adding verifier:', err);
      setError(err.message || 'Failed to add verifier');
    } finally {
      setLoading(false);
    }
  };

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

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {message && <div className="text-green-500 mb-4">{message}</div>}
      
      {isAdmin && (
        <div className="mt-8 border p-6 rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-6">Admin Controls</h2>
          
          <div className="grid gap-6 mb-8">
            <div className="p-4 border rounded bg-white">
              <h3 className="text-xl font-semibold mb-4">Add Verifier</h3>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Verifier Address (0x...)"
                  value={verifierAddress}
                  onChange={(e) => setVerifierAddress(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  disabled={loading}
                />
                <button
                  onClick={addVerifier}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Add Verifier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
