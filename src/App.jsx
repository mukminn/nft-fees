import { useWallet } from './hooks/useWallet';
import { useERC721 } from './hooks/useERC721';
import { WalletConnect } from './components/WalletConnect';
import { NFTViewer } from './components/NFTViewer';
import { TransferNFT } from './components/TransferNFT';
import { ApprovalPanel } from './components/ApprovalPanel';
import { CloudBackground } from './components/CloudBackground';

function App() {
  const {
    account,
    provider,
    signer,
    chainId,
    isBaseNetwork,
    isConnecting,
    error: walletError,
    connect,
    switchToBase,
  } = useWallet();

  const {
    name,
    symbol,
    balance,
    loading: contractLoading,
    error: contractError,
    getOwnerOf,
    getTokenURI,
    approve,
    setApprovalForAll,
    safeTransferFrom,
  } = useERC721(provider, signer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-white relative">
      <CloudBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sky-700 mb-2">NFT Fees</h1>
          <p className="text-sky-600">ERC-721 NFT Manager on Base</p>
        </div>

        {/* Collection Info */}
        {(name || symbol) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-sky-700 mb-4">Collection Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-semibold text-sky-700">{name || 'Loading...'}</p>
              </div>
              <div>
                <span className="text-gray-600">Symbol:</span>
                <p className="font-semibold text-sky-700">{symbol || 'Loading...'}</p>
              </div>
              {account && (
                <div>
                  <span className="text-gray-600">Your Balance:</span>
                  <p className="font-semibold text-sky-700">{balance || '0'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wallet Connect */}
        <WalletConnect
          account={account}
          chainId={chainId}
          isBaseNetwork={isBaseNetwork}
          isConnecting={isConnecting}
          error={walletError}
          connect={connect}
          switchToBase={switchToBase}
        />

        {/* Contract Error */}
        {contractError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 text-sm">{contractError}</p>
          </div>
        )}

        {/* NFT Viewer */}
        {provider && (
          <NFTViewer
            getOwnerOf={getOwnerOf}
            getTokenURI={getTokenURI}
            account={account}
          />
        )}

        {/* Transfer NFT */}
        {account && signer && isBaseNetwork && (
          <TransferNFT
            safeTransferFrom={safeTransferFrom}
            account={account}
            isBaseNetwork={isBaseNetwork}
          />
        )}

        {/* Approval Panel */}
        {account && signer && isBaseNetwork && (
          <ApprovalPanel
            approve={approve}
            setApprovalForAll={setApprovalForAll}
            account={account}
            isBaseNetwork={isBaseNetwork}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Make sure to update CONTRACT_ADDRESS in src/config/contract.js</p>
        </div>
      </div>
    </div>
  );
}

export default App;

