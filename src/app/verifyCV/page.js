'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import {
    CONTRACT_ADDRESS,
    RESUME_REGISTRY_ABI,
    SUPPORTED_NETWORKS,
} from '../../constants/contractInfo';
import { PinataService } from '../../utils/pinataService';

export default function VerifyResume() {
    const [account, setAccount] = useState(null);
    const [networkName, setNetworkName] = useState('');
    const [isCertifier, setIsCertifier] = useState(false);
    const [contract, setContract] = useState(null);

    const [experienceHash, setExperienceHash] = useState('');
    const [experienceData, setExperienceData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const connectWallet = async () => {
        try {
            setError('');
            setMessage('');

            if (!window.ethereum) {
                setError('Please install MetaMask');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const account = await signer.getAddress();
            const network = await provider.getNetwork();
            const chainId = '0x' + network.chainId.toString(16);

            if (chainId !== SUPPORTED_NETWORKS.POLYGON.chainId) {
                setError('Please connect to Polygon Mainnet');
                return;
            }

            const contract = new ethers.Contract(CONTRACT_ADDRESS, RESUME_REGISTRY_ABI, signer);
            const isCertifier = await contract.authorizedCertifiers(account);

            setAccount(account);
            setNetworkName(SUPPORTED_NETWORKS.POLYGON.name);
            setIsCertifier(isCertifier);
            setContract(contract);

            setMessage(`Wallet connected: ${account}${isCertifier ? ' (Authorized Certifier)' : ''}`);
        } catch (err) {
            setError(err.message || 'Wallet connection failed');
        }
    };

    const verifyExperience = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        setExperienceData(null);

        try {
            if (!contract || !experienceHash) return;

            const [cid] = await contract.getExperienceInfo(experienceHash);

            if (!cid) {
                setError('Experience not found');
                return;
            }

            let parsedData;
            try {
                parsedData = JSON.parse(cid);
            } catch {
                parsedData = await PinataService.getResumeFromIPFS(cid);
            }

            setExperienceData(parsedData);
            setMessage('Experience verified successfully');
        } catch (err) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Verify Experience</h1>

            {!account ? (
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="mb-4 space-y-1">
                    <p><strong>Account:</strong> {account}</p>
                    <p><strong>Network:</strong> {networkName}</p>
                    {isCertifier && <p className="text-green-600">You are an authorized certifier</p>}
                </div>
            )}

            {error && <p className="text-red-600 mt-4">{error}</p>}
            {message && <p className="text-green-600 mt-4">{message}</p>}

            {account && (
                <form onSubmit={verifyExperience} className="mt-6 space-y-4">
                    <label className="block text-sm font-medium">Experience Hash</label>
                    <input
                        value={experienceHash}
                        onChange={(e) => setExperienceHash(e.target.value)}
                        placeholder="0x..."
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                    <button
                        type="submit"
                        disabled={!experienceHash || loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                    >
                        {loading ? 'Verifying...' : 'Verify Experience'}
                    </button>
                </form>
            )}

            {experienceData && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2">Experience Details</h2>
                    {experienceData.organization && <p><strong>Organization:</strong> {experienceData.organization}</p>}
                    {experienceData.title && <p><strong>Title:</strong> {experienceData.title}</p>}
                    {experienceData.time && <p><strong>Time:</strong> {experienceData.time}</p>}
                    {experienceData.name && <p><strong>Name:</strong> {experienceData.name}</p>}
                </div>
            )}
        </div>
    );
}
