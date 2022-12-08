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
        '0x8b737597d6bc9C7e16D23B470D7ec4e42023f0F9',
        walletABI.abi,
        providerData.signer,
      );

      setContract(_contract);
    }
  }, [providerData]);

  
   useEffect(() => {
    if (providerData) {
      const _contract = new ethers.Contract(
        '0x47c7e68b9407ffd609ef56C4Dd1472304c3C6a95',
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

         console.log('', ownerAddress);
         if (ownerAddress == providerData.signerData.userAddress){
         nft.push({
           tokenId: Number(currentNFT.tokenId),
           collectionId: Number(currentNFT.collectionId),
           price: currentNFT.price,
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
