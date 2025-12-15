import { useState } from 'react';

export function MintNFT({ 
  mintWithETH, 
  mintPriceETH, 
  ethBalance,
  nftBalance,
  remainingMints,
  canMint,
  loading,
  account,
  isBaseNetwork 
}) {
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState(null);
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    if (!account || !isBaseNetwork) {
      setError('Please connect wallet to Base network');
      return;
    }

    if (!canMint) {
      setError(`Mint limit reached! You can only mint ${nftBalance + remainingMints} NFT(s) per wallet.`);
      return;
    }

    try {
      setError(null);
      setTxHash('');
      setMinting(true);

      const tx = await mintWithETH();
      setTxHash(tx.hash);
    } catch (err) {
      setError(err.message);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-10">
      <div className="max-w-md mx-auto">
        {/* Mint with ETH */}
        <div className="rotating-border rotating-border-glow">
          <div className="rotating-border-content p-5">
          <div className="text-center mb-3">
            <div className="text-2xl mb-1.5">💎</div>
            <h3 className="text-lg font-bold text-sky-700 mb-1.5">Mint NFT</h3>
            <p className="text-xl font-bold text-sky-600">
              {mintPriceETH ? `${mintPriceETH} ETH` : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Balance: {parseFloat(ethBalance).toFixed(4)} ETH
            </p>
            <div className="mt-2 p-2 bg-sky-50 rounded-full">
              <p className="text-xs text-sky-700">
                <span className="font-semibold">Minted:</span> {nftBalance} / {nftBalance + remainingMints}
              </p>
              <p className="text-xs text-sky-700">
                <span className="font-semibold">Remaining:</span> {remainingMints} mint{remainingMints !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleMint}
            disabled={loading || minting || !account || !isBaseNetwork || !canMint}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading || minting ? 'Minting...' : !canMint ? 'Mint Limit Reached' : 'Mint NFT'}
          </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-full">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-full">
          <p className="text-green-800 text-sm font-medium mb-1 text-center">Transaction Submitted!</p>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-700 text-sm underline break-all block text-center"
          >
            View on BaseScan: {txHash}
          </a>
        </div>
      )}
    </div>
  );
}

