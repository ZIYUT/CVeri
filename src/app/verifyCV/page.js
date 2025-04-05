'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    CONTRACT_ADDRESS,
    RESUME_REGISTRY_ABI,
    SUPPORTED_NETWORKS,
} from '../../constants/contractInfo';
import { PinataService } from '../../utils/pinataService';

export default function VerifyResume() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [networkName, setNetworkName] = useState('');
    const [experienceHash, setExperienceHash] = useState('');
    const [isCertifier, setIsCertifier] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [experienceData, setExperienceData] = useState(null);
    const [certifiers, setCertifiers] = useState([]);
    const [certifierTitles, setCertifierTitles] = useState([]);

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

            const certifierStatus = await contract.authorizedCertifiers(account);
            setIsCertifier(certifierStatus);

            setMessage(`Wallet connected: ${account}` + (certifierStatus ? ' (Authorized Certifier)' : ''));
        } catch (err) {
            console.error('Error connecting wallet:', err);
            setError(err.message || 'Failed to connect wallet');
        }
    };

    const verifyExperience = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            setMessage('');

            if (!experienceHash) {
                setError('Please enter an experience hash');
                setLoading(false);
                return;
            }

            setExperienceData(null);
            setCertifiers([]);
            setCertifierTitles([]);

            setMessage('Retrieving experience details...');

            const [cid, certifierList, titleList] = await contract.getExperienceInfo(experienceHash);

            if (!cid) {
                setError('Experience not found');
                setLoading(false);
                return;
            }

            let parsedData;
            try {
                parsedData = JSON.parse(cid);
            } catch {
                const data = await PinataService.getResumeFromIPFS(cid);
                parsedData = data;
            }

            setExperienceData(parsedData);
            setCertifiers(certifierList);
            setCertifierTitles(titleList);
            setMessage('Resume experience found');
        } catch (err) {
            console.error('Error verifying experience:', err);
            setError(err.message || 'Failed to find the experience');
        } finally {
            setLoading(false);
        }
    };

    const certifyExperience = async () => {
        try {
            setLoading(true);
            setError('');
            setMessage('Certifying experience...');

            if (!isCertifier) {
                setError('You are not an authorized certifier');
                setLoading(false);
                return;
            }

            const tx = await contract.certifyExperience(experienceHash);
            setMessage('Transaction sent, waiting for confirmation...');

            await tx.wait();

            setMessage('Experience certified successfully!');
            verifyExperience({ preventDefault: () => {} });
        } catch (err) {
            console.error('Error certifying experience:', err);
            setError(err.message || 'Failed to certify experience');
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
            <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-300 dark:to-indigo-200">
                        Verify Resume
                    </h1>
                    <p className="mt-2 text-lg">
                        Retrieve and verify professional experience securely
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
                        {isCertifier && <p className="text-green-600">✅ You are a certifier</p>}
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

                {account && (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <form onSubmit={verifyExperience} className="space-y-4">
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
                                disabled={loading || !experienceHash}
                                className={`w-full px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                                    loading || !experienceHash
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {loading ? 'Processing...' : 'Verify Experience'}
                            </button>
                        </form>

                        {experienceData && (
                            <div className="mt-8 space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-2">Experience Details</h3>
                                    <div className="bg-gray-900 text-white p-4 rounded border border-gray-700 space-y-1">
                                        {experienceData.name && <p><strong>Name:</strong> {experienceData.name}</p>}
                                        {experienceData.organization && <p><strong>Organization:</strong> {experienceData.organization}</p>}
                                        {experienceData.title && <p><strong>Title:</strong> {experienceData.title}</p>}
                                        {experienceData.time && <p><strong>Time Period:</strong> {experienceData.time}</p>}
                                        {experienceData.details && (
                                            <div className="mt-2">
                                                <p><strong>Details:</strong></p>
                                                <p className="text-gray-300 whitespace-pre-wrap pl-2 border-l-2 border-gray-700">
                                                    {experienceData.details}
                                                </p>
                                            </div>
                                        )}
                                        {experienceData.address && (
                                            <p className="text-xs text-gray-400 mt-3 text-right italic border-t border-gray-700 pt-2">
                                                Submitted by: {experienceData.address}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-2">Certifier List</h3>
                                    {certifiers.length > 0 ? (
                                        <div className="overflow-x-auto rounded border border-gray-700">
                                            <table className="w-full text-sm text-left text-white">
                                                <thead className="bg-gray-800 text-gray-300">
                                                <tr>
                                                    <th className="px-4 py-2">Certifier Address</th>
                                                    <th className="px-4 py-2">Organization/Title</th>
                                                </tr>
                                                </thead>
                                                <tbody className="bg-gray-900">
                                                {certifiers.map((addr, idx) => (
                                                    <tr key={idx} className="border-t border-gray-800">
                                                        <td className="px-4 py-2 font-mono">{addr}</td>
                                                        <td className="px-4 py-2">{certifierTitles[idx]}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="italic text-gray-400">No certifications found yet.</p>
                                    )}
                                </div>

                                {isCertifier && (
                                    <div>
                                        <button
                                            onClick={certifyExperience}
                                            disabled={loading}
                                            className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Processing...' : 'Certify This Experience'}
                                        </button>
                                        <p className="text-xs text-gray-300 mt-1">
                                            As an authorized certifier, your endorsement will be recorded on-chain.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
    );
}

