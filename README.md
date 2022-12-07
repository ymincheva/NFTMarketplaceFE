The user can create a collection and create a market item (NFT) from this collection.
The user can list the created market item (NFT) for sale with a specific price and marketplace allowance.
I use nft.storage to store NFTs.
The user can buy a listed NFT.

## ⚙️ Install dependencies

```shell
$ yarn
```

## ⚙️ Config

Copy the example `.env` file and add the needed credentials.

```shell
cp example.env .env
```

Register at [Infura](https://www.infura.io/) ot [Alchemy](https://www.alchemy.com/) to get the `PROVIDER_URL`.

Export your wallet private key to `WALLET_PRIVATE_KEY`.

Register at [Etherscan](https://etherscan.io/) to get `ETHERSCAN_API_KEY`.

Note: The default network is `Sepolia`.

In the project directory, you can run:

```shell
$ yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
