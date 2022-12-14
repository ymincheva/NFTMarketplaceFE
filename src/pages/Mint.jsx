import React from 'react';
import { ethers } from 'ethers';
import { useEffect, useState, useCallback} from 'react';
import useProvider from '../hooks/useProvider';
import walletABI from '../sdk/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import Button from '../components/ui/Button';

function Mint() {
  const providerData = useProvider();
  const [contract, setContract] = useState();

  const [nameItem, setName]  =  useState('Name');
  const [description, setDescription]  =  useState('Description');
  const [collection, setCollection] = useState([]);
  const [collectionSelection, setCollectionSelection] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [imageNFT, setImageNFT] = useState('');
  const [nftStorageUrl, setNftStorageUrl] = useState('');

  const { NFTStorage } = require('nft.storage')
  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJBNkU0MjBiMTZmNEEzOTRjNjk1OTRBNWZBMTUwNzIzQzk2RUMxZjgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODE1NTcxNTI4NSwibmFtZSI6IllhbmthIE1pbmNoZXZhIn0.ITH3LE5Guopkl7CL4chTk70OM85geV_aGxhLKOxHlAw'
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })
  const emptyNftUrl = (nftStorageUrl.length == 0);

  const handleNameInput = e => {
    setName(e.target.value);
  };

  const handleDescriptionInput = e => {
    setDescription(e.target.value);
  };

  const handleCollectionInput = e => {  
    setCollectionSelection((Number(e.target.value)+1));
  };

  const handleMintButtonClick = async () => {
   setIsLoading(true);

   try {
      if (!emptyNftUrl) {        
        const tx = await contract.createMarketItem(collectionSelection, nftStorageUrl);
        await tx.wait();
        resetForm();
      }
    } catch (e) {
      console.log('e', e);
    } finally {
      setIsLoading(false);
    } 
  };

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

    const getCollectionData = useCallback(async () => {
      setIsLoading(true);
      const result = await contract.getCollectionIdsCount();  
      const collectionCount = Number(result);
      const collection = [];

     for (let i = 0; i < collectionCount; i++) {
         const collectionId = await contract.collectionIds(i);
         const currentCollection = await contract.collectionLedger(collectionId);
         collection.push({
           id: i,
           name: currentCollection
         }); 
      }
    setCollection(collection);
    setIsLoading(false);
    }, [contract, providerData]);

    useEffect(() => {
         contract && getCollectionData();
     }, [contract, providerData, getCollectionData]);
    
    const handleClick  = async () => {
      const metadata = await client.store({
            name: nameItem,
            description: description,
            image: imageNFT
             })   
       console.log('metadata.url ==== ',metadata.url);

       setNftStorageUrl(metadata.url);
    }

    const handleFileInput = (e) => {   
       setImageNFT(e.target.files[0]);   
    } 

    const resetForm = async () => {
      setName('Name');
      setDescription('Description');
      setNftStorageUrl(''); 
      setCollectionSelection(0);
      document.getElementById('nftImage').value = "";
    };

    return (
    <div className="container my-5">
      <h1  align="middle">Mint</h1>   
     
      <div align="middle">
         <input
            className="form-control mt-2"
            onChange={handleNameInput}           
            value={nameItem}
            type="text" 
            align="middle"       
            style={{ height: '34px', width:'400px', lineHeight: '34px', borderRadius: '2px' }}    
          />
      </div>
     
      <div align="middle">
         <input
            className="form-control mt-2"
            onChange={handleDescriptionInput}
            value={description}
            type="text" 
            align="middle"       
            style={{ height: '34px', width:'400px', lineHeight: '34px', borderRadius: '2px' }}      
          />   
      </div>   
      
      <div align="middle">
         <select
            id ="collectionType"
            className="form-control mt-2"
            onChange={handleCollectionInput}       
            type="text" 
            align="middle"       
            style={{ height: '40px', width:'400px', lineHeight: '34px', borderRadius: '2px' }}      
          > 
          {
            collection.map(option=>{
             return <option value={option.id}>{option.name}</option>
            })
          }
          </select>  
      </div>
   
      <div className="button-wrapper mt-3" align="middle">        
          <input type="file" id="nftImage" name="nftImage" align="middle" onChange={handleFileInput}  accept=".jpg, .jpeg, .png" />
          <button onClick={handleClick}>Upload to nft.storage</button>
      </div>

     <div className="button-wrapper mt-3" align="middle">
         <Button loading={isLoading} onClick={handleMintButtonClick} type="primary">
             Mint
         </Button>
         {emptyNftUrl ? <div style={{ color: `blue` }}>Please select a file and wait to upload</div> : null}  
      </div> 
    </div>
  );
}

export default Mint;
