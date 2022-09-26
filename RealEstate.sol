//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;


contract RealEstate is ERC721URIStorage  {
using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // https://rinkeby.etherscan.io/token/0x47d3d1e853ae4675c6d93e4b559572c2c0752125
    // https://testnets.opensea.io/collection/real-estate-wmlf80cnw9
    constructor() ERC721("Real Estate", "REAL") {
        mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
    }

    function mint(string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
