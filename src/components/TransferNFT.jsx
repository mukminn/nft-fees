import { useState } from 'react';

export function TransferNFT({ safeTransferFrom, account, isBaseNetwork }) {
  const [toAddress, setToAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState(null);

  const handleTransfer = async () => {
    if (!toAddress || !tokenId) {
      setError('Please fill all fields');
      return;
    }

    if (!isBaseNetwork) {
      setError('Please connect to Base network');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTxHash('');

      const tx = await safeTransferFrom(account, toAddress, tokenId);
      setTxHash(tx.hash);

      await tx.wait();
      
      // Reset form on success
      setToAddress('');
      setTokenId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-sky-700 mb-4">Transfer NFT</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">From (Your Wallet)</label>
          <input
            type="text"
            value={account || ''}
            disabled
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 text-gray-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">To Address</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Token ID</label>
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter token ID"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading || !account || !isBaseNetwork}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Transferring...' : 'Transfer NFT (Safe)'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
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
    </div>
  );
}

