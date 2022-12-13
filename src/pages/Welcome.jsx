import React from 'react';
import { useState} from 'react';
import Button from '../components/ui/Button';
import useProvider from '../hooks/useProvider';
import { injected } from "../hooks/connectors"
import { useWeb3React } from "@web3-react/core";

function Welcome() {
  const { active, activate, deactivate } = useWeb3React()
  const [isLoading, setIsLoading] = useState(false);
  const provider = useProvider();

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

   async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }
  const handleConnectClick = async () => {
    console.log('----- ', !provider.connected);

// ethereum.request({ method: 'eth_requestAccounts' })
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
        <Button loading={isLoading} onClick={connect} type="primary">
             {!active ? <Button onClick={connect}>Connect</Button> : <Button onClick={connect}>Disconnect</Button>}
        </Button>
   
      </div> 
    
    </div>   
  ); 

}

export default Welcome;
