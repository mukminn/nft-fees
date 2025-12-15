import { useState } from 'react';

export function ApprovalPanel({ approve, setApprovalForAll, account, isBaseNetwork }) {
  const [approveTokenId, setApproveTokenId] = useState('');
  const [approveTo, setApproveTo] = useState('');
  const [approveAllOperator, setApproveAllOperator] = useState('');
  const [approveAllStatus, setApproveAllStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState(null);

  const handleApprove = async () => {
    if (!approveTokenId || !approveTo) {
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

      const tx = await approve(approveTo, approveTokenId);
      setTxHash(tx.hash);

      await tx.wait();
      
      setApproveTokenId('');
      setApproveTo('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAll = async () => {
    if (!approveAllOperator) {
      setError('Please enter operator address');
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

      const tx = await setApprovalForAll(approveAllOperator, approveAllStatus);
      setTxHash(tx.hash);

      await tx.wait();
      
      setApproveAllOperator('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-sky-700 mb-4">Approval</h2>
      
      <div className="space-y-6">
        {/* Approve Single Token */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-sky-600 mb-4">Approve Token</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Token ID</label>
              <input
                type="text"
                value={approveTokenId}
                onChange={(e) => setApproveTokenId(e.target.value)}
                placeholder="Enter token ID"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Approve To</label>
              <input
                type="text"
                value={approveTo}
                onChange={(e) => setApproveTo(e.target.value)}
                placeholder="0x..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={handleApprove}
              disabled={loading || !account || !isBaseNetwork}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Approving...' : 'Approve Token'}
            </button>
          </div>
        </div>

        {/* Approve All */}
        <div>
          <h3 className="text-lg font-semibold text-sky-600 mb-4">Approve All</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Operator Address</label>
              <input
                type="text"
                value={approveAllOperator}
                onChange={(e) => setApproveAllOperator(e.target.value)}
                placeholder="0x..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={approveAllStatus}
                  onChange={(e) => setApproveAllStatus(e.target.checked)}
                  className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
                />
                <span className="text-gray-700">Approve (uncheck to revoke)</span>
              </label>
            </div>

            <button
              onClick={handleApproveAll}
              disabled={loading || !account || !isBaseNetwork}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : approveAllStatus ? 'Approve All' : 'Revoke Approval'}
            </button>
          </div>
        </div>

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

