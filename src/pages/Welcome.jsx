import React from 'react';
import { useState} from 'react';
import Button from '../components/ui/Button';

function Welcome() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectClick = async () => {
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
        <Button loading={isLoading} onClick={handleConnectClick} type="primary">
           Connect
        </Button>
      </div>   
    </div>
  );
}

export default Welcome;
