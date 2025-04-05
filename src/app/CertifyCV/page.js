'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    CONTRACT_ADDRESS,
    RESUME_REGISTRY_ABI,
    SUPPORTED_NETWORKS,
} from '../../constants/contractInfo';

export default function CertifyResume() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [networkName, setNetworkName] = useState('');
    const [isCertifier, setIsCertifier] = useState(false);
    const [experienceHash, setExperienceHash] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

            const authorized = await contract.authorizedCertifiers(account);
            setIsCertifier(authorized);

            setMessage(`Wallet connected: ${account}`);
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError(err.message || 'Failed to connect wallet');
        }
    };

    const certifyExperience = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setMessage('');

            if (!account || !contract || !provider) {
                setError('Please connect your wallet first');
                setLoading(false);
                return;
            }

            if (!experienceHash.startsWith('0x') || experienceHash.length !== 66) {
                setError('Invalid hash format. It should be a 0x-prefixed 32-byte hex string.');
                setLoading(false);
                return;
            }

            const currentSigner = await provider.getSigner();
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, RESUME_REGISTRY_ABI, currentSigner);
            setContract(contractInstance);

            const experienceData = await contractInstance.experienceCIDs(experienceHash);
            if (!experienceData || experienceData === '') {
                setError('Experience not found. Please verify the hash is correct.');
                setLoading(false);
                return;
            }

            const isCertifierNow = await contractInstance.authorizedCertifiers(account);
            if (!isCertifierNow) {
                setError('Your account is not authorized as a certifier.');
                setLoading(false);
                return;
            }

            const certifierList = await contractInstance.getExperienceInfo(experienceHash);
            if (certifierList && Array.isArray(certifierList[1])) {
                const alreadyCertified = certifierList[1].some(
                    (addr) => addr.toLowerCase() === account.toLowerCase()
                );
                if (alreadyCertified) {
                    setError('You have already certified this experience.');
                    setLoading(false);
                    return;
                }
            }

            try {
                await contractInstance.certifyExperience.staticCall(experienceHash);
            } catch (staticErr) {
                console.error('Static call failed:', staticErr);
                setError(`Transaction would fail: ${staticErr.message}`);
                setLoading(false);
                return;
            }

            const tx = await contractInstance.certifyExperience(experienceHash, { gasLimit: 800000 });
            setMessage('Transaction sent, waiting for confirmation...');
            await tx.wait();
            setMessage(`Experience certified successfully! Certified hash: ${experienceHash}`);
        } catch (err) {
            console.error('Error certifying experience:', err);
            setError(err.message || 'Failed to certify experience');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0]);
                window.location.reload();
            });
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
                window.ethereum.removeListener('chainChanged', () => {});
            }
        };
    }, []);

    return (
        <>
            <div className="absolute left-[-120px] top-20 h-96 w-96 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse z-0" />
            <div className="absolute right-[-120px] bottom-10 h-96 w-96 bg-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse z-0" />

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-300 dark:to-indigo-200">
                        Certify Resume Experience
                    </h1>
                    <p className="mt-2 text-lg">
                        Certify verified experiences with your authorized account.
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
                        <p className="text-sm text-gray-500">Network: {networkName}</p>
                        {!isCertifier && (
                            <p className="text-red-600 mt-2">
                                You are not authorized to certify experiences.
                            </p>
                        )}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4 text-center whitespace-pre-wrap">
                        {message}
                    </div>
                )}

                {account && isCertifier && (
                    <form
                        onSubmit={certifyExperience}
                        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Experience Hash
                            </label>
                            <input
                                type="text"
                                value={experienceHash}
                                onChange={(e) => setExperienceHash(e.target.value)}
                                placeholder="0x..."
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Certify Experience'}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}