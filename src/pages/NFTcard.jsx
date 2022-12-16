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
    const [pressSellButton, setPressSellButton] = useState(false);
    const [inputPrice, setInputPrice] = useState(0);
    const [priceForSale, setPriceForSale] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [owner, setOwner] = useState('');
  
    const emptyInputPrice = (inputPrice === 0);

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

     /* -------------- getCollectionName ---------------- */
     const getCollectionName = useCallback(async () => {
      setIsLoading(true);
   
      const currentCollection = await contract.collectionLedger(data.data.collectionId);
  
      setCollectionName(currentCollection);
      setIsLoading(false);
     }, [contract, providerData]);

     useEffect(() => {
         contract && getCollectionName();
     }, [contract, providerData, getCollectionName]);     

     /* -------------- getImageUrl ---------------- */
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

     /* -------------- getIsApproval ---------------- */
     const getIsApproval = useCallback(async () => {
        setIsLoading(true);
   
        const approvedAddress = await contractMarketItem.getApproved(data.data.tokenId);
     
        setIsApproved((approvedAddress == contract.address));
        setIsLoading(false);        
     
     }, [contract, providerData]);

     useEffect(() => {
         contract && getIsApproval();
     }, [contract, providerData, getIsApproval]);    

     /* -------------- getIsForSale ---------------- */
     const getIsForSale = useCallback(async () => {  
        
        setIsForSale((data.data.forSale));
     
     }, [contract, providerData]);

     useEffect(() => {
         contract && getIsForSale();
     }, [contract, providerData, getIsForSale]);   

     /* -------------- getPrice ---------------- */
    const getPrice = useCallback(async () => {
      setIsLoading(true);
   
      const currentPrice = (data.data.price);
      console.log('nftcard -----', currentPrice); 

      setPriceForSale(currentPrice);
      setIsLoading(false);
     }, [contract, providerData]);

     useEffect(() => {
         contract && getPrice();
     }, [contract, providerData, getPrice]);  

      /* --------------------------------- */
     const handleApproveButtonClick = async () => {
        setIsApproveLoading(true);      
    
        let transaction = await contractMarketItem.approve(contract.address, data.data.tokenId); 
        await transaction.wait();      
        setIsApproveLoading(false);  
        window.location.reload();    
    }

    const handleBuyButtonClick = async () => {
        setIsBuyLoading(true);
        const salePrice = ethers.utils.parseUnits(priceForSale, 'ether');
        
        var utils = require('ethers').utils;
        var priceWei = utils.parseEther(priceForSale);
        console.log('salePrice  wei ===',priceWei.toString(10));
        // create new account address 0x155A5A4F13bE9e31945b158D98D54F572e18C1d0
       // let transaction = await contract.connect("0x155A5A4F13bE9e31945b158D98D54F572e18C1d0").buyItem(data.data.tokenId, {value:priceWei});       
        let transaction = await contract.buyItem(data.data.tokenId, {value:priceWei});       
      
        await transaction.wait();

       setIsBuyLoading(false);
        window.location.reload();
    }

    const handleSellButtonClick = async () => {
        setPressSellButton(true);
    }
    
    const handlePriceInput = e => {
        setInputPrice(e.target.value);
    };

    const handleSetPriceInput = async () => {   
     
        if (inputPrice > 0){
           setIsLoading(true);
           var utils = require('ethers').utils;
           var wei = utils.parseEther(inputPrice);
           let transaction = await contract.listItem(data.data.tokenId, wei.toString(10));
           await transaction.wait();
      
           setIsLoading(false);   
           window.location.reload();   
        } 
    }

     return (             
         <Card sx={{ maxWidth: 300 }} className="nft-card m-2" align="middle">
             
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
               
           {isForSale? <Button loading={isBuyLoading} onClick={handleBuyButtonClick} type="primary" >
               Buy    
           </Button>:null}
           {isForSale?  <p className="mx-4 my-2 text-center" style={{ color: `blue` }  } >
            { 
              priceForSale
            }</p>:null}    

           </CardActions>
           <CardActions>
           {isApproved && !isForSale ? 
           <Button onClick={handleSellButtonClick} type="primary">
               Sell
           </Button> : null}  
       
           <div align="middle" >
           {isApproved && pressSellButton ?
           <input
               className="form-control mt-2 mx-4 "
               onChange={handlePriceInput}
               value={inputPrice}
               type="text"      
               style={{ height: '34px', width:'140px', lineHeight: '34px', borderRadius: '2px' }}   
            />  :null }  
           </div>
           {isApproved && pressSellButton ?
           <Button loading={isLoading} onClick={handleSetPriceInput} type="primary">
               Set
           </Button> 
         :null }  
         
        </CardActions> 
          {!isForSale && emptyInputPrice && isApproved ? <div style={{ color: `blue` }}>Price is required</div> : null}  
        </Card>      
    );
}

export default NFTcard;