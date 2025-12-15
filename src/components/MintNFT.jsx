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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-sky-700 mb-6 text-center">Mint NFT</h2>
      
      <div className="max-w-md mx-auto">
        {/* Mint with ETH */}
        <div className="border-2 border-sky-200 rounded-xl p-6 hover:border-sky-400 transition-colors">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">💎</div>
            <h3 className="text-xl font-bold text-sky-700 mb-2">Mint NFT</h3>
            <p className="text-2xl font-bold text-sky-600">
              {mintPriceETH ? `${mintPriceETH} ETH` : 'Loading...'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Balance: {parseFloat(ethBalance).toFixed(4)} ETH
            </p>
            <div className="mt-3 p-2 bg-sky-50 rounded-lg">
              <p className="text-sm text-sky-700">
                <span className="font-semibold">Minted:</span> {nftBalance} / {nftBalance + remainingMints}
              </p>
              <p className="text-sm text-sky-700">
                <span className="font-semibold">Remaining:</span> {remainingMints} mint{remainingMints !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleMint}
            disabled={loading || minting || !account || !isBaseNetwork || !canMint}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || minting ? 'Minting...' : !canMint ? 'Mint Limit Reached' : 'Mint NFT'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium mb-1">Transaction Submitted!</p>
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-700 text-sm underline break-all"
          >
            View on BaseScan: {txHash}
          </a>
        </div>
      )}
    </div>
  );
}

