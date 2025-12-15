import { useState, useEffect, useMemo } from 'react';
import { Contract, parseUnits, formatUnits } from 'ethers';
import { ERC721_ABI, CONTRACT_ADDRESS, NFT_PRICE_ETH, MINT_LIMIT_PER_WALLET } from '../config/contract';

export function useMint(provider, signer) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [mintPriceETH, setMintPriceETH] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [nftBalance, setNftBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nftContract = useMemo(() => {
    if (!provider || !CONTRACT_ADDRESS) return null;
    return signer 
      ? new Contract(CONTRACT_ADDRESS, ERC721_ABI, signer)
      : new Contract(CONTRACT_ADDRESS, ERC721_ABI, provider);
  }, [provider, signer]);

  useEffect(() => {
    if (nftContract && provider) {
      loadContractInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftContract, provider, signer]);

  const loadContractInfo = async () => {
    if (!nftContract || !provider) return;

    try {
      setError(null);

      const [contractName, contractSymbol] = await Promise.all([
        nftContract.name().catch(() => 'NFT Collection'),
        nftContract.symbol().catch(() => 'NFT'),
      ]);

      setName(contractName);
      setSymbol(contractSymbol);

      // Try to get mint price from contract, fallback to hardcoded
      try {
        const priceETH = await nftContract.NftPriceEth().catch(() => null);
        if (priceETH !== null) {
          setMintPriceETH(formatUnits(priceETH, 18));
        } else {
          // Use hardcoded price as fallback
          setMintPriceETH(formatUnits(NFT_PRICE_ETH, 18));
        }
      } catch (err) {
        // Use hardcoded price as fallback
        setMintPriceETH(formatUnits(NFT_PRICE_ETH, 18));
      }

      // Load balances if signer available
      if (signer) {
        try {
          const address = await signer.getAddress();
          
          // ETH balance
          const ethBal = await provider.getBalance(address);
          setEthBalance(formatUnits(ethBal, 18));
          
          // NFT balance (how many NFTs this wallet owns)
          const nftBal = await nftContract.balanceOf(address);
          setNftBalance(Number(nftBal.toString()));
        } catch (err) {
          console.error('Error loading balance:', err);
        }
      }
    } catch (err) {
      const errorMessage = err.reason || err.message || 'Unknown error';
      if (!errorMessage.includes('missing provider') && 
          !errorMessage.includes('network')) {
        setError(errorMessage);
      }
    }
  };

  const mintWithETH = async () => {
    if (!nftContract || !signer) throw new Error('Signer required');
    
    try {
      setLoading(true);
      setError(null);

      // Use price from contract or fallback to hardcoded
      let price;
      try {
        const contractPrice = await nftContract.NftPriceEth();
        price = contractPrice;
        console.log('Using contract price:', price.toString(), 'wei');
      } catch {
        price = NFT_PRICE_ETH;
        console.log('Using hardcoded price:', price.toString(), 'wei');
      }

      // Validate balance
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      console.log('ETH Balance:', balance.toString(), 'wei');
      console.log('Required price:', price.toString(), 'wei');
      
      if (balance < price) {
        throw new Error('Insufficient ETH balance');
      }

      // Check mint limit
      const currentBalance = await nftContract.balanceOf(address);
      const currentMintCount = Number(currentBalance.toString());
      
      if (currentMintCount >= MINT_LIMIT_PER_WALLET) {
        throw new Error(`Mint limit reached! You can only mint ${MINT_LIMIT_PER_WALLET} NFT(s) per wallet. You already have ${currentMintCount} NFT(s).`);
      }

      // Check contract conditions (if available)
      try {
        // Check if sale is active
        const saleActive = await nftContract.saleActive?.().catch(() => null);
        if (saleActive === false) {
          throw new Error('Sale is not active');
        }

        // Check if paused
        const paused = await nftContract.paused?.().catch(() => null);
        if (paused === true) {
          throw new Error('Contract is paused');
        }

        // Check max supply
        try {
          const totalSupply = await nftContract.totalSupply?.().catch(() => null);
          const maxSupply = await nftContract.maxSupply?.().catch(() => null);
          if (totalSupply !== null && maxSupply !== null && totalSupply >= maxSupply) {
            throw new Error('Max supply reached');
          }
        } catch (supplyError) {
          // Ignore if functions don't exist
        }
      } catch (conditionError) {
        if (conditionError.message !== 'Sale is not active' && 
            conditionError.message !== 'Contract is paused' &&
            conditionError.message !== 'Max supply reached') {
          // Ignore errors from functions that don't exist
        } else {
          throw conditionError;
        }
      }
      
      // Try to estimate gas first
      try {
        await nftContract.mint.estimateGas({ value: price });
      } catch (estimateError) {
        let errorMessage = 'Transaction will fail';
        
        if (estimateError.reason) {
          errorMessage = estimateError.reason;
        } else if (estimateError.data) {
          try {
            const errorData = estimateError.data;
            if (typeof errorData === 'string' && errorData.includes('revert')) {
              errorMessage = errorData;
            } else {
              errorMessage = estimateError.message || 'Transaction will fail';
            }
          } catch {
            errorMessage = estimateError.message || 'Transaction will fail';
          }
        } else {
          errorMessage = estimateError.message || 'Transaction will fail';
        }
        
        throw new Error(`Mint failed: ${errorMessage}`);
      }
      
      // Execute mint
      const tx = await nftContract.mint({ value: price });
      
      await tx.wait();
      
      // Reload balances
      await loadContractInfo();
      
      return tx;
    } catch (err) {
      // Better error extraction
      let errorMessage = 'Transaction failed';
      
      console.error('Mint ETH error:', err);
      
      // Try to extract detailed error information
      if (err.reason) {
        errorMessage = err.reason;
      } else if (err.data) {
        if (err.data.message) {
          errorMessage = err.data.message;
        } else if (typeof err.data === 'string') {
          errorMessage = err.data;
        }
      }
      
      if (err.message) {
        if (err.message.includes('require(false)')) {
          errorMessage = 'Mint condition failed. Possible reasons: 1) Sale is not active, 2) Max supply reached, 3) Mint limit exceeded, 4) Contract conditions not met';
        } else if (err.message.includes('revert')) {
          const revertMatch = err.message.match(/revert\s+(.+)/i);
          if (revertMatch) {
            errorMessage = revertMatch[1];
          } else {
            errorMessage = err.message;
          }
        } else {
          errorMessage = err.message;
        }
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const remainingMints = MINT_LIMIT_PER_WALLET - nftBalance;
  const canMint = remainingMints > 0;

  return {
    name,
    symbol,
    mintPriceETH,
    ethBalance,
    nftBalance,
    remainingMints,
    canMint,
    loading,
    error,
    mintWithETH,
    loadContractInfo,
  };
}

