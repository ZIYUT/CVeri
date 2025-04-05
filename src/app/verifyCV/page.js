'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    CONTRACT_ADDRESS,
    RESUME_REGISTRY_ABI,
    SUPPORTED_NETWORKS,
} from '../../constants/contractInfo';

export default function VerifyResume() {
    const [account, setAccount] = useState(null);
    const [networkName, setNetworkName] = useState('');
    const [isCertifier, setIsCertifier] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [contract, setContract] = useState(null);

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

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Verify & Certify Experience</h1>
            {!account ? (
                <button onClick={connectWallet} className="px-4 py-2 bg-blue-600 text-white rounded">
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <p>Account: {account}</p>
                    <p>Network: {networkName}</p>
                    {isCertifier && <p className="text-green-600">Authorized Certifier</p>}
                </div>
            )}
            {message && <p className="text-green-600 mt-4">{message}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
}
