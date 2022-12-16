import React from 'react';
import { ethers } from 'ethers';
import { useEffect, useState, useCallback} from 'react';
import useProvider from '../hooks/useProvider';
import walletABI from '../sdk/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import walletMarketItemABI from '../sdk/artifacts/contracts/MarketItem.sol/MarketItem.json';
import { Grid} from "@mui/material";
import NFTcard from "./NFTcard";

function Profile() {
   const [contract, setContract] = useState();
   const [contractMarketItem, setContractMarketItem] = useState();
   const [isLoading, setIsLoading] = useState(false);
   const providerData = useProvider();
   const [data, setNft] = useState([]);

   useEffect(() => {
    if (providerData) {
      const _contract = new ethers.Contract(
        '0x4bC61D6099CF269ece7d563bF8a103f48e622F6c',
        walletABI.abi,
        providerData.signer,
      );

      setContract(_contract);
    }
  }, [providerData]);

  
   useEffect(() => {
    if (providerData) {
      const _contract = new ethers.Contract(
        '0x21F3D050238693A8DB90973BbEc5C705C6FC793A',
        walletMarketItemABI.abi,
        providerData.signer,
      );

      setContractMarketItem(_contract);
    }
   }, [providerData]);


   const getNFTData = useCallback(async () => {
      setIsLoading(true);
      const result = await contract.getNftIdsCount();  
      const nftCount = Number(result);
      const nft = [];

      for (let i = 0; i < nftCount; i++) {
     
         const currentNFT = await contract.nftLedger(i);
         const ownerAddress = await contractMarketItem.ownerOf( Number(currentNFT.tokenId));
     
         if (ownerAddress == providerData.signerData.userAddress){
          
          nft.push({
            tokenId: Number(currentNFT.tokenId),
            collectionId: Number(currentNFT.collectionId),
            price: ethers.utils.formatEther(currentNFT.price),
            forSale: currentNFT.forSale 
          }); 

        }
      }

     setNft(nft);
     setIsLoading(false);
     }, [contract, providerData]);

     useEffect(() => {
         contract && getNFTData();
     }, [contract, providerData, getNFTData]);
     

   return (
    <div className="container my-5" >
      <h1 align="middle">Profile</h1>

      <Grid  
        className="form-control mt-2" 
        container spacing={{ xs: 2, md: 3 }} 
        columns={{ xs: 4, sm: 8, md: 12 }}>

       {data.map((value, index) => {
          return <NFTcard data={value} key={index}></NFTcard>;
       })}    
       
      </Grid>    

    </div>
  );
}

export default Profile;
