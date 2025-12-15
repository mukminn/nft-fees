export function WalletConnect({ account, chainId, isBaseNetwork, isConnecting, error, connect, switchToBase }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-sky-700 mb-4">Wallet Connection</h2>
      
      {!account ? (
        <div>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          {error && (
            <p className="mt-3 text-red-600 text-sm">{error}</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-mono text-sm text-sky-700 break-all">{account}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Chain ID:</span>
            <span className="font-mono text-sm text-sky-700">{chainId?.toString()}</span>
          </div>

          {!isBaseNetwork && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm mb-2">Please switch to Base network</p>
              <button
                onClick={switchToBase}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Switch to Base
              </button>
            </div>
          )}

          {isBaseNetwork && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm text-center">✓ Connected to Base Network</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

