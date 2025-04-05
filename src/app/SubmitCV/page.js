'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESS,
  RESUME_REGISTRY_ABI,
  SUPPORTED_NETWORKS,
} from '../../constants/contractInfo';
import { PinataService } from '../../utils/pinataService.js';

export default function UploadResume() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [resume, setResume] = useState({
    name: '',
    experience: {
      organization: '',
      title: '',
      time: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      if (chainId === SUPPORTED_NETWORKS.AMOY.chainId) {
        setNetworkName(SUPPORTED_NETWORKS.AMOY.name);
      } else {
        setError('Please connect to Polygon Amoy testnet');
        return;
      }
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RESUME_REGISTRY_ABI, signer);
      setContract(contract);
      setMessage(`Wallet connected: ${account}`);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  // Submit resume function will be implemented in next commit
  const submitResume = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('This functionality will be implemented in the next update');
    
    // Placeholder for resume submission logic
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === SUPPORTED_NETWORKS.AMOY.chainId) {
          setNetworkName(SUPPORTED_NETWORKS.AMOY.name);
        } else {
          setError('Please connect to Polygon Amoy testnet');
        }
      }
    };

    checkNetwork();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        window.location.reload();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
      <div className="relative isolate overflow-hidden">
        <div className="absolute left-[-120px] top-20 h-96 w-96 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse z-0"></div>
        <div className="absolute right-[-120px] bottom-10 h-96 w-96 bg-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-300 dark:via-indigo-200 dark:to-purple-200">
              Submit Resume
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Upload and register your professional experience on-chain
            </p>
          </div>

          {!account ? (
              <div className="text-center">
                <button
                    onClick={connectWallet}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
                >
                  Connect MetaMask Wallet
                </button>
              </div>
          ) : (
              <div className="mb-6 text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Connected: <span className="font-mono text-purple-600">{account}</span>
                </p>
                {networkName && <p className="text-sm text-gray-500">Network: {networkName}</p>}
              </div>
          )}

          {error && (
              <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4 text-center">{error}</div>
          )}

          {message && (
              <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4 text-center whitespace-pre-wrap">
                {message}
              </div>
          )}

          {account && (
              <form onSubmit={submitResume} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                      type="text"
                      value={resume.name}
                      onChange={(e) => setResume({ ...resume, name: e.target.value })}
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
                      placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization *</label>
                  <input
                      type="text"
                      value={resume.experience.organization}
                      onChange={(e) =>
                          setResume({ ...resume, experience: { ...resume.experience, organization: e.target.value } })
                      }
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
                      placeholder="e.g. Google, MIT"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                          loading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                      }`}
                  >
                    {loading ? 'Processing...' : 'Submit Resume'}
                  </button>
                </div>
              </form>
          )}
        </div>
      </div>
  );
}