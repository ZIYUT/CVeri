'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  CONTRACT_ADDRESS,
  RESUME_REGISTRY_ABI,
  SUPPORTED_NETWORKS,
} from '../../constants/contractInfo';
import { PinataService } from '../../utils/pinataService';

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
      details: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [experienceHash, setExperienceHash] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);

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
      setMessage(`Wallet connected: ${account}`);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const submitResume = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setExperienceHash(''); // Reset hash on new submission
      if (!contract || !signer) {
        setError('Please connect your wallet first');
        setLoading(false);
        return;
      }
      if (!resume.name) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }
      const { organization, title, time } = resume.experience;
      if (!organization || !title || !time) {
        setError('Please complete all required experience information');
        setLoading(false);
        return;
      }

      setMessage('Preparing resume data...');
      const combinedData = {
        address: account,
        name: resume.name,
        organization: resume.experience.organization,
        title: resume.experience.title,
        time: resume.experience.time,
        details: resume.experience.details
      };

      setMessage('Uploading resume to IPFS...');
      const { ipfsHash: resumeCID } = await PinataService.uploadResumeToIPFS(combinedData);

      const expHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(combinedData)));

      const currentSigner = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, RESUME_REGISTRY_ABI, currentSigner);
      setContract(contractInstance);

      const resumeTx = await contractInstance.uploadResume(resumeCID, { gasLimit: 800000 });
      setMessage('Transaction sent, waiting for confirmation...');
      await resumeTx.wait();

      try {
        setMessage('Adding experience to blockchain...');

        try {
          await contractInstance.callStatic.addExperience(expHash, resumeCID, { gasLimit: 800000 });
        } catch (staticErr) {
          console.warn('Static call warning:', staticErr);
        }

        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice;

        const expTx = await contractInstance.addExperience(expHash, resumeCID, {
          gasLimit: 1200000,
          gasPrice: gasPrice
        });
        await expTx.wait();

        setExperienceHash(expHash);
        setMessage('Resume submitted successfully! Please record your Hash blow(IMPORTANT!!!)');
      } catch (err) {
        console.error('Error adding experience:', err);
        setError(err.message || 'Failed to add experience');
      }
    } catch (err) {
      console.error('Error submitting resume:', err);
      setError(err.message || 'Failed to submit resume');
    } finally {
      setLoading(false);
    }
  };

  const copyHashToClipboard = () => {
    navigator.clipboard.writeText(experienceHash)
      .then(() => {
        const originalMessage = message;
        setMessage('Hash copied to clipboard!');
        setTimeout(() => setMessage(originalMessage), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
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

  useEffect(() => {
    const formatDate = (date) => {
      if (!date) return '';
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    };
    
    let timeString = '';
    if (startDate) {
      timeString = `${formatDate(startDate)} to ${isCurrentPosition ? 'Now' : formatDate(endDate) || ''}`;
    }
    
    setResume(prev => ({
      ...prev, 
      experience: {
        ...prev.experience,
        time: timeString.trim()
      }
    }));
  }, [startDate, endDate, isCurrentPosition]);

  return (
      <>
        <div className="absolute left-[-120px] top-20 h-96 w-96 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse z-0"></div>
        <div className="absolute right-[-120px] bottom-10 h-96 w-96 bg-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-300 dark:via-indigo-200 dark:to-purple-200">
              Submit Resume
            </h1>
            <p className="mt-2 text-lg">
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
                <p className="text-lg">
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
                
                {experienceHash && (
                  <div className="mt-3 flex items-center justify-center">
                    <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-l border border-gray-300 overflow-hidden overflow-ellipsis max-w-[80%] font-mono">
                      {experienceHash}
                    </div>
                    <button 
                      onClick={copyHashToClipboard}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-r border-t border-r border-b border-blue-600"
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                  </div>
                )}
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
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization (Company, School ...) *</label>
                  <input
                      type="text"
                      value={resume.experience.organization}
                      onChange={(e) =>
                          setResume({ ...resume, experience: { ...resume.experience, organization: e.target.value } })
                      }
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
                      placeholder="e.g. Google, MIT"
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Position, Degree...) *</label>
                  <input
                      type="text"
                      value={resume.experience.title}
                      onChange={(e) =>
                          setResume({ ...resume, experience: { ...resume.experience, title: e.target.value } })
                      }
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
                      placeholder="e.g. Software Engineer"
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Period *</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
                        disabled={isCurrentPosition}
                        required={!isCurrentPosition}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={isCurrentPosition}
                        onChange={() => {
                          setIsCurrentPosition(!isCurrentPosition);
                          if (!isCurrentPosition) setEndDate(null);
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">This is my current position</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Details <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <textarea
                      value={resume.experience.details}
                      onChange={(e) =>
                          setResume({ ...resume, experience: { ...resume.experience, details: e.target.value } })
                      }
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white min-h-[120px] resize-y"
                      placeholder="Additional details about your experience..."
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
      </>
  );
}
