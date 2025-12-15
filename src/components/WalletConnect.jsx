export function WalletConnect({ account, chainId, isBaseNetwork, isConnecting, error, connect, switchToBase }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-10 mb-6">
      {!account ? (
        <div>
          <div className="rotating-border rotating-border-glow">
            <button
              onClick={connect}
              disabled={isConnecting}
              className="rotating-border-content w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-red-600 text-sm text-center">{error}</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Connected</p>
            <p className="font-mono text-sm text-sky-700 break-all">{account}</p>
          </div>

          {!isBaseNetwork && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-full">
              <p className="text-yellow-800 text-sm mb-2 text-center">Please switch to Base network</p>
              <button
                onClick={switchToBase}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition-colors shadow-lg"
              >
                Switch to Base
              </button>
            </div>
          )}

          {isBaseNetwork && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-full">
              <p className="text-green-800 text-sm text-center">✓ Connected to Base Network</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

