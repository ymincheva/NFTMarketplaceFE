import React from 'react';
import { useState} from 'react';
import Button from '../components/ui/Button';
import walletConnectModule from "@web3-onboard/walletconnect";
import injectedModule from "@web3-onboard/injected-wallets";
import Onboard from "@web3-onboard/core";

function Welcome() {

  const walletConnect = walletConnectModule();
  const injected = injectedModule();

  const modules = [walletConnect, injected];
  const MAINNET_RPC_URL = `https://sepolia.infura.io/v3/6b899e4d080d4b3e951c5a195baf298b`;

  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();

  const onboard = Onboard({
  wallets: modules, 
  chains: [
    {
      id: "0x1", 
      token: "ETH",
      namespace: "evm",
      label: "Ethereum Mainnet",
      rpcUrl: MAINNET_RPC_URL
    }
  ],
  appMetadata: {
    name: "My App",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    description: "My app using Onboard",
    recommendedInjectedWallets: [ 
      { name: "MetaMask", url: "https://metamask.io" }
    ]
  }
 });

   const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      const { accounts, chains } = wallets[0];
      setAccount(accounts[0].address);
      setChainId(chains[0].id);
    } catch (error) {
      console.error(error);
    }
  };

   const disconnect = async () => {
    const [primaryWallet] = await onboard.state.get().wallets;
    if (primaryWallet) await onboard.disconnectWallet({ label: primaryWallet.label });
    refreshState();
  };

  const refreshState = () => {
    setAccount("");
    setChainId("");
  };
  
   return (
    
    <div className="container my-5" >
      <h1 align="middle">This is NFT Market Place</h1>
      <p className="mt-3" align="middle">
        Opinionated minimal boilerplate for starting React projects with Bootstrap and couple more
        goodies.
      </p>
      <p className="mt-2" align="middle">
        You can use this marketplace to create, buy & sell NFTs
      </p>
      <p className="mt-10 fw-bold fs-2" align="middle">
       Connect Your Wallet
      </p>   

      <div className="button-wrapper mt-3" align="middle">
          <Button onClick={connectWallet}>Connect Wallet</Button>  
      </div> 
      <div className="button-wrapper mt-3" align="middle">
          <Button onClick={disconnect}>Disconnect</Button>
      </div>
      <div>Connection Status: ${!!account}</div>
      <div>Wallet Address: ${account}</div>
      <div>Network Chain ID: ${chainId}</div>
        
    </div>   
  ); 

}

export default Welcome;
