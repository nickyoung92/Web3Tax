# getOpenseaSharedStorefront

This is a javascript program that utilizes node packages web3 and exceljs to capture the sales history of NFT's created through the opensea shared storefront. It will capture and separate both initial sales, and royalties. Each transaction takes 5 seconds to be in line with the coingecko api free plan pricing, but may be increased through code improvements or faster api source. 

## Installation

Download and install the file and move it to a new folder.
Using [VSCode](https://code.visualstudio.com/)(recommended) or something similar, open the new folder and open a terminal to download the following packages.
If you dont have node installed, you can download it [HERE](https://nodejs.org/en/)

```bash
npm init -y
npm i exceljs web3
```

## Usage
Enter your Alchemy API key.
You can get an Alchemy API key [HERE](https://www.alchemy.com/).
sellerAddress should be the creator address
Token IDs can be found by navigating to the specific NFT on opensea, and copying the token ID from the URL. ~~'opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/~~
**99987703356627791248718096200836925898283202222594062307228320089954515419137**'

```javascript
const alchemyAPI = "YOUR_API_KEY" //replace with your own alchemy API key
const sellersAddress = "0xB3A8aa8B47766Da85190203b368ae2311841610B" //original seller. Needed to filter out sales price on secondary
const tokenIDs = [ //replace with token IDs of storefront collection. Can be retrieved from asset URL on opensea.
    "99987703356627791248718096200836925898283202222594062307228320089954515419137",
    "99987703356627791248718096200836925898283202222594062307228320065765259608065",
    "99987703356627791248718096200836925898283202222594062307228320065765259608065",
];
```
Once your variables are set, you can run the program by entering into the terminal,

```bash
node getOpenseaSharedStorefront.js
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
