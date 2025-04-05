'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    CONTRACT_ADDRESS,
    RESUME_REGISTRY_ABI,
    SUPPORTED_NETWORKS,
} from '../../constants/contractInfo';

export default function CertifyResumeStage1() {
    const [account, setAccount] = useState(null);
    const [networkName, setNetworkName] = useState('');
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
            const network = await provider.getNetwork();
            const chainId = '0x' + network.chainId.toString(16);

            if (chainId === SUPPORTED_NETWORKS.POLYGON.chainId) {
                setNetworkName(SUPPORTED_NETWORKS.POLYGON.name);
            } else {
                setError('Please connect to Polygon Mainnet');
                return;
            }

            setMessage(`Wallet connected: ${account}`);
        } catch (err) {
            setError(err.message || 'Failed to connect wallet');
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
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Certify Resume</h1>
            {!account ? (
                <button onClick={connectWallet} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <p>Connected: {account}</p>
                    <p>Network: {networkName}</p>
                </div>
            )}
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {message && <p className="text-green-600 mt-4">{message}</p>}
        </div>
    );
}