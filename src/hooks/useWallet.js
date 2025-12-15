import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { BASE_CHAIN_ID } from '../config/contract';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      checkConnection();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask not installed');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0].address);
        setChainId(network.chainId);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setChainId(network.chainId);

      // Check if on Base network
      if (network.chainId !== BASE_CHAIN_ID) {
        setError(`Please switch to Base network (Chain ID: ${BASE_CHAIN_ID})`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToBase = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        // Chain not added, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
            chainName: 'Base',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
      } else {
        throw switchError;
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setSigner(null);
    } else {
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    checkConnection();
  };

  const isBaseNetwork = chainId === BASE_CHAIN_ID;

  return {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    connect,
    switchToBase,
    isBaseNetwork,
    isConnected: !!account && !!signer,
  };
}

