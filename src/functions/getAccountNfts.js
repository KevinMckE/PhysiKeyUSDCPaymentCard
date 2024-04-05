import Web3 from 'web3';
const web3 = new Web3('https://sepolia.optimism.io');

export const getAccountNfts = async (publicKey, contractAddress) => {
  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const nfts = [];
    const balance = await contract.methods.balanceOf(publicKey).call();

    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(publicKey, i).call();
      const nftInfo = await contract.methods.getNFTInfo(tokenId).call();
      nfts.push(nftInfo);
    }
    return nfts;
  } catch (error) {
    console.error('Cannot complete getAccountNfts: ', error);
    throw error;
  }
}

export const getImageUri = async (item) => {
  const originalUrl = item.metadataURI;
  if (originalUrl.startsWith('https://')) {
    const response = await fetch(originalUrl);
    const responseBodyText = await response.text();
    const responseData = JSON.parse(responseBodyText);
    const uri = responseData.image;
    return uri;
  } else {
    const convertedUrl = originalUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const response = await fetch(convertedUrl);
    const responseBodyText = await response.text();
    const responseData = JSON.parse(responseBodyText);
    const uri = responseData.image;
    const convertedUri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    return convertedUri;
  }
};