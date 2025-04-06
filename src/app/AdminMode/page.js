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
  
  // Certifier management state
  const [certifierAddress, setCertifierAddress] = useState('');
  const [certifierTitle, setCertifierTitle] = useState('');
  
  // Admin management state
  const [adminAddress, setAdminAddress] = useState('');

  const switchNetwork = async (chainId) => {
    try {
      console.log('Switching to network with chainId:', chainId);

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });

      console.log('Network switch request sent');
    } catch (error) {
      console.error('Error in switchNetwork:', error);

      if (error.code === 4902) {
        try {
          console.log('Adding network to MetaMask');

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

          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
          });

          console.log('Network added and switched successfully');
        } catch (addError) {
          console.error('Error adding network:', addError);
          setError(`Failed to add network: ${addError.message}`);
        }
      } else {
        setError(`Failed to switch network: ${error.message}`);
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

      const isAdmin = await contract.admins(account);
      setIsAdmin(isAdmin);
      
      setMessage(`Wallet connected: ${account}`);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const addCertifier = async (e) => {
    if (e) e.preventDefault();
    
    if (!certifierAddress) {
      setError('Please enter a certifier address');
      return;
    }

    if (!certifierTitle) {
      setError('Please enter a title for the certifier');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      if (!ethers.isAddress(certifierAddress)) {
        setError('Invalid Ethereum address');
        setLoading(false);
        return;
      }

      setMessage('Adding certifier to blockchain...');
      
      const tx = await contract.addCertifier(certifierAddress, certifierTitle);
      setMessage('Transaction sent! Waiting for confirmation...');
      
      await tx.wait();
      setMessage(`Certifier ${certifierAddress} (${certifierTitle}) added successfully!`);
      setCertifierAddress('');
      setCertifierTitle('');
      
    } catch (err) {
      console.error('Error adding certifier:', err);
      setError(err.message || 'Failed to add certifier');
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (e) => {
    if (e) e.preventDefault();
    
    if (!adminAddress) {
      setError('Please enter an admin address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      if (!ethers.isAddress(adminAddress)) {
        setError('Invalid Ethereum address');
        setLoading(false);
        return;
      }

      const isAlreadyAdmin = await contract.admins(adminAddress);
      if (isAlreadyAdmin) {
        setError('This address is already an admin!');
        setLoading(false);
        return;
      }
      
      setMessage('Adding admin to blockchain...');
      
      const tx = await contract.addAdmin(adminAddress, { 
        gasLimit: 200000
      });
      setMessage('Transaction sent! Waiting for confirmation...');
      
      await tx.wait();
      setMessage(`Admin ${adminAddress} added successfully!`);
      setAdminAddress('');
    } catch (err) {
      console.error('Error adding admin:', err);
      setError(err.message || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId === SUPPORTED_NETWORKS.POLYGON.chainId) {
          setNetworkName(SUPPORTED_NETWORKS.POLYGON.name);
        } else {
          setError('Please connect to Polygon Mainnet');
        }
      }
    };

    checkNetwork();
    
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
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-300 dark:to-indigo-200">
          Resume Verification Admin Panel
        </h1>
        <p className="mt-3 text-lg">
          Manage certifiers and administrators for the resume verification system
        </p>
      </div>

      <div className="flex justify-center mb-8">
        {!account ? (
          <button
            onClick={connectWallet}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-300 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
          >
            Connect MetaMask Wallet
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Wallet Connected
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Account and network information
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                isAdmin ? 
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {isAdmin ? 'Admin' : 'Not Admin'}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium w-24">Address:</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex-1 overflow-hidden text-ellipsis text-black">{account}</span>
              </div>
              
              {networkName && (
                <div className="flex items-center mt-2">
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium w-24">Network:</span>
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm">{networkName}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              {!networkName && (
                <div className="mt-2">
                  <button
                    onClick={() => switchNetwork(SUPPORTED_NETWORKS.POLYGON.chainId)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Switch to Polygon Mainnet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-r-lg animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-sm text-green-700 dark:text-green-200 whitespace-pre-line">{message}</div>
            </div>
          </div>
        </div>
      )}

      {account && isAdmin && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Add Certifier</h2>
              <p className="text-blue-100 text-sm">Add a new authorized certifier to the system</p>
            </div>
            <form onSubmit={addCertifier} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certifier Address</label>
                <input
                  type="text"
                  value={certifierAddress}
                  onChange={(e) => setCertifierAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition duration-150 outline-none text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certifier Name</label>
                <input
                  type="text"
                  value={certifierTitle}
                  onChange={(e) => setCertifierTitle(e.target.value)}
                  placeholder="e.g. University of Melbourne"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition duration-150 outline-none text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !isAdmin}
                className={`w-full px-4 py-3 rounded-lg font-medium text-center transition duration-150 ${
                  loading || !isAdmin
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? 'Processing...' : 'Add Certifier'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Add Admin</h2>
              <p className="text-purple-100 text-sm">Grant administrator privileges to a new address</p>
            </div>
            <form onSubmit={addAdmin} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Address</label>
                <input
                  type="text"
                  value={adminAddress}
                  onChange={(e) => setAdminAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition duration-150 outline-none text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !isAdmin}
                className={`w-full px-4 py-3 rounded-lg font-medium text-center transition duration-150 ${
                  loading || !isAdmin
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? 'Processing...' : 'Add Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {account && !isAdmin && (
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-lg animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-medium text-yellow-800 dark:text-yellow-300">Admin Access Required</h3>
              <p className="mt-2 text-yellow-700 dark:text-yellow-200">
                Only administrators can manage certifiers and add new admins. Please connect with an authorized admin wallet address to access these features.
              </p>
              <div className="mt-4">
                <a href="/" className="text-yellow-800 dark:text-yellow-300 underline hover:text-yellow-900 dark:hover:text-yellow-200 font-medium transition">
                  Return to Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}