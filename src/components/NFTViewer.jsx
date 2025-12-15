import { useState } from 'react';

export function NFTViewer({ getOwnerOf, getTokenURI, account }) {
  const [tokenId, setTokenId] = useState('');
  const [owner, setOwner] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNFT = async () => {
    if (!tokenId) {
      setError('Please enter a token ID');
      return;
    }

    if (!getOwnerOf || !getTokenURI) {
      setError('Contract not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOwner('');
      setTokenURI('');
      setImageUrl('');

      const [ownerAddress, uri] = await Promise.all([
        getOwnerOf(tokenId),
        getTokenURI(tokenId),
      ]);

      setOwner(ownerAddress);
      setTokenURI(uri);

      // Try to fetch image from tokenURI
      if (uri) {
        try {
          // Handle IPFS URLs
          const ipfsUrl = uri.startsWith('ipfs://')
            ? `https://ipfs.io/ipfs/${uri.replace('ipfs://', '')}`
            : uri;

          const response = await fetch(ipfsUrl);
          const data = await response.json();

          // Handle different metadata formats
          if (data.image) {
            const image = data.image.startsWith('ipfs://')
              ? `https://ipfs.io/ipfs/${data.image.replace('ipfs://', '')}`
              : data.image;
            setImageUrl(image);
          } else if (data.image_url) {
            const image = data.image_url.startsWith('ipfs://')
              ? `https://ipfs.io/ipfs/${data.image_url.replace('ipfs://', '')}`
              : data.image_url;
            setImageUrl(image);
          }
        } catch (err) {
          console.error('Error fetching metadata:', err);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-sky-700 mb-4">NFT Viewer</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Token ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={fetchNFT}
              disabled={loading || !getOwnerOf || !getTokenURI}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'View'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {owner && (
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 font-medium">Owner:</span>
              <p className="font-mono text-sm text-sky-700 break-all mt-1">{owner}</p>
            </div>

            {tokenURI && (
              <div>
                <span className="text-gray-600 font-medium">Token URI:</span>
                <p className="font-mono text-xs text-gray-600 break-all mt-1">{tokenURI}</p>
              </div>
            )}

            {imageUrl && (
              <div>
                <span className="text-gray-600 font-medium mb-2 block">Image Preview:</span>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`NFT #${tokenId}`}
                    className="w-full h-auto max-h-96 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden p-8 text-center text-gray-400">
                    Failed to load image
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

