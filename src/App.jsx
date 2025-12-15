import { useWallet } from './hooks/useWallet';
import { useMint } from './hooks/useMint';
import { WalletConnect } from './components/WalletConnect';
import { MintNFT } from './components/MintNFT';
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
    mintPriceETH,
    ethBalance,
    nftBalance,
    remainingMints,
    canMint,
    loading,
    error: mintError,
    mintWithETH,
  } = useMint(provider, signer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-white relative">
      <CloudBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sky-700 mb-2">{name || 'NFT Collection'}</h1>
          <p className="text-sky-600">{symbol || 'Mint your NFT'}</p>
        </div>

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
        {mintError && mintError.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 text-sm">{mintError}</p>
          </div>
        )}

        {/* Mint NFT */}
        {provider && (
          <MintNFT
            mintWithETH={mintWithETH}
            mintPriceETH={mintPriceETH}
            ethBalance={ethBalance}
            nftBalance={nftBalance}
            remainingMints={remainingMints}
            canMint={canMint}
            loading={loading}
            account={account}
            isBaseNetwork={isBaseNetwork}
          />
        )}
      </div>
    </div>
  );
}

export default App;
