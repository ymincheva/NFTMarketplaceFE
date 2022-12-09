import React from 'react';
import { ethers } from 'ethers';
import walletABI from '../sdk/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import walletMarketItemABI from '../sdk/artifacts/contracts/MarketItem.sol/MarketItem.json';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '../components/ui/Button';
import { useEffect, useState, useCallback} from 'react';
import useProvider from '../hooks/useProvider';
import axios from "axios";
import CardActions from '@mui/material/CardActions';

function NFTcard (data) {
    const providerData = useProvider();
    const [isLoading, setIsLoading] = useState(false);
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const [isBuyLoading, setIsBuyLoading] = useState(false);
    const [contract, setContract] = useState();
    const [contractMarketItem, setContractMarketItem] = useState();
    const [collectionName, setCollectionName] = useState('');
    const [description, setDescription] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [isForSale, setIsForSale] = useState(false);
    const [inputPrice, setInputPrice] = useState(false);
    const [priceForSale, setPriceForSale] = useState(2000000000000);
    const [imageUrl, setImageUrl] = useState('');
    const [owner, setOwner] = useState('');
    const emptyPrice = !(priceForSale > 0);

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


   async function getImage(url) {
      let res = await axios.get(url);
      let nImage = res.data.image;   
      setDescription(res.data.description);
      return nImage
   }

    const getOwner = useCallback(async () => {
      setIsLoading(true);
   
      const currentOwner = await contractMarketItem.ownerOf(data.data.tokenId);
      setOwner(currentOwner);
      setIsLoading(false);
     }, [contract, providerData]);

     useEffect(() => {
         contract && getOwner();
     }, [contract, providerData, getOwner]);   

   const getCollectionName = useCallback(async () => {
      setIsLoading(true);
   
      const currentCollection = await contract.collectionLedger(data.data.collectionId);
      setCollectionName(currentCollection);
      setIsLoading(false);
     }, [contract, providerData]);

     useEffect(() => {
         contract && getCollectionName();
     }, [contract, providerData, getCollectionName]);     

     const getImageUrl = useCallback(async () => {
      setIsLoading(true);
   
      //https://dweb.link/ipfs/{ipfs_filename} 

      const imageUrlJson = await contractMarketItem.tokenURI(data.data.tokenId);  
 
      let renderURL = imageUrlJson.replace("ipfs://", "https://ipfs.io/ipfs/");
      
      let imageFromJson = await getImage(renderURL);
      imageFromJson = imageFromJson.replace("ipfs://","");

      const imageUrl = "https://dweb.link/ipfs/" + imageFromJson;
 
      setImageUrl(imageUrl);
      setIsLoading(false);  
  
     }, [contract, providerData]);

     useEffect(() => {
         contract && getImageUrl();
     }, [contract, providerData, getImageUrl]);   

     const getIsApproval = useCallback(async () => {
        setIsLoading(true);
   
        const approvedAddress = await contractMarketItem.getApproved(data.data.tokenId);
     
        setIsApproved((approvedAddress == contract.address));
        setIsLoading(false);
     
     }, [contract, providerData]);

     useEffect(() => {
         contract && getIsApproval();
     }, [contract, providerData, getIsApproval]);    

     const getPrice = useCallback(async () => {      
        setIsForSale((data.data.forSale));
     
     }, [contract, providerData]);

     useEffect(() => {
         contract && getPrice();
     }, [contract, providerData, getPrice]);   

     const handleApproveButtonClick = async () => {
        setIsApproveLoading(true);      
    
        await contractMarketItem.approve(contract.address, data.data.tokenId);       
        setIsApproveLoading(false);      
    }

    const handleBuyButtonClick = async () => {
        setIsBuyLoading(true);
        await contract.buyItem(data.data.tokenId);
        setIsBuyLoading(false);
    }

    const handleSellButtonClick = async () => {
        setInputPrice(true);
    }
    
    const handlePriceInput = e => {
        setPriceForSale(e.target.value);
    };

    const handleSetPriceInput = async () => {
        console.log('priceForSale ===',(priceForSale>0));
        
        if (priceForSale>0){
        await contract.listItem(data.data.tokenId, priceForSale);
        }
    }

     return (             
         <Card sx={{ maxWidth: 300 }} className="nft-card" align="middle">
             
            <CardMedia
                component="img"
                height="300"
                width="290"
                image={imageUrl} 
                alt=""/>

            <h5>{ collectionName} </h5>
            <p align="middle">{ description} </p>
            <p align="middle">Owner: {owner.slice(0, 5) + " .. " + owner.slice(owner.length-3)} </p>

           
            {!isApproved ? 
              <Button loading={isApproveLoading} onClick={handleApproveButtonClick} type="primary">
                      Approve
              </Button> : null}
           
            <CardActions >
               
            <Button loading={isBuyLoading} onClick={handleBuyButtonClick} type="primary" >
               Buy    
            </Button>
            <p className="mx-4 my-2 text-center" style={{ color: `blue` }  } >
            { 
               ethers.utils.formatEther(priceForSale) + " eth"
            }</p>        
           </CardActions>
           <CardActions>
           {!isForSale ? 
           <Button loading={isLoading} onClick={handleSellButtonClick} type="primary">
               Sell
           </Button> : null}  
       
           <div align="middle" >
           {inputPrice ?
           <input
               className="form-control mt-2 mx-4 "
               onChange={handlePriceInput}
               value={priceForSale}
               type="text"      
               style={{ height: '34px', width:'140px', lineHeight: '34px', borderRadius: '2px' }}   
            /> :null } 
           </div>
           {inputPrice ?
           <Button loading={isLoading} onClick={handleSetPriceInput} type="primary">
               Set
           </Button> 
           :null }  
         
        </CardActions> 
          {emptyPrice ? <div style={{ color: `blue` }}>Price is required</div> : null}  
        </Card>      
    );
}

export default NFTcard;