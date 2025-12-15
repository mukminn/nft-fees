import { useState, useEffect, useMemo } from 'react';
import { Contract } from 'ethers';
import { ERC721_ABI, CONTRACT_ADDRESS } from '../config/contract';

export function useERC721(provider, signer) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contract = useMemo(() => {
    if (!provider || !CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      return null;
    }
    return signer 
      ? new Contract(CONTRACT_ADDRESS, ERC721_ABI, signer)
      : new Contract(CONTRACT_ADDRESS, ERC721_ABI, provider);
  }, [provider, signer]);

  useEffect(() => {
    if (contract && provider) {
      loadContractInfo();
    } else {
      setError(null);
      setName('');
      setSymbol('');
      setBalance(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CONTRACT_ADDRESS, provider, signer]);

  const loadContractInfo = async () => {
    if (!contract || !provider) return;

    try {
      setLoading(true);
      setError(null);

      const [contractName, contractSymbol] = await Promise.all([
        contract.name(),
        contract.symbol(),
      ]);

      setName(contractName);
      setSymbol(contractSymbol);

      if (signer) {
        try {
          const address = await signer.getAddress();
          const userBalance = await contract.balanceOf(address);
          setBalance(userBalance.toString());
        } catch (balanceErr) {
          // Balance error is not critical, just set to 0
          setBalance('0');
        }
      }
    } catch (err) {
      // Only show persistent errors, ignore transient network issues
      const errorMessage = err.reason || err.message || 'Unknown error';
      if (!errorMessage.includes('missing provider') && 
          !errorMessage.includes('network') &&
          !errorMessage.includes('NETWORK_ERROR')) {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getOwnerOf = async (tokenId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const owner = await contract.ownerOf(tokenId);
      return owner;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  const getTokenURI = async (tokenId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const uri = await contract.tokenURI(tokenId);
      return uri;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  const getApproved = async (tokenId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const approved = await contract.getApproved(tokenId);
      return approved;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  const isApprovedForAll = async (owner, operator) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const approved = await contract.isApprovedForAll(owner, operator);
      return approved;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  const approve = async (to, tokenId) => {
    if (!contract || !signer) throw new Error('Signer required');
    try {
      const tx = await contract.approve(to, tokenId);
      return tx;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  const setApprovalForAll = async (operator, approved) => {
    if (!contract || !signer) throw new Error('Signer required');
    try {
      const tx = await contract.setApprovalForAll(operator, approved);
      return tx;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  const transferFrom = async (from, to, tokenId) => {
    if (!contract || !signer) throw new Error('Signer required');
    try {
      const tx = await contract.transferFrom(from, to, tokenId);
      return tx;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  const safeTransferFrom = async (from, to, tokenId) => {
    if (!contract || !signer) throw new Error('Signer required');
    try {
      const tx = await contract.safeTransferFrom(from, to, tokenId);
      return tx;
    } catch (err) {
      throw new Error(err.reason || err.message);
    }
  };

  return {
    contract,
    name,
    symbol,
    balance,
    loading,
    error,
    loadContractInfo,
    getOwnerOf,
    getTokenURI,
    getApproved,
    isApprovedForAll,
    approve,
    setApprovalForAll,
    transferFrom,
    safeTransferFrom,
  };
}

