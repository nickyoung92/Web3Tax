

//To use, update variables and run program. Will capture all sales activity related to the sellersAddress to capture initial sales income and secondary royalty income.

//variables
const alchemyAPI = "YOUR_API_KEY_HERE" //replace with your own alchemy API key
const sellersAddress = "COLLECTION_CREATOR" //original seller. Needed to filter out sales price on secondary
const tokenIDs = [ //replace with token IDs of storefront collection. Can be retrieved from asset URL on opensea.
    "81262007255124884521686184370069523810682153555080426986097573611818704699414",
    "81262007255124884521686184370069523810682153555080426986097573609619681443940",
    "81262007255124884521686184370069523810682153555080426986097573620614797721622",
    "81262007255124884521686184370069523810682153555080426986097573600823588421642",
    "81262007255124884521686184370069523810682153555080426986097573608520169816065",
    "81262007255124884521686184370069523810682153555080426986097573607420658188289",
    "81262007255124884521686184370069523810682153555080426986097573606321146560537",
    "81262007255124884521686184370069523810682153555080426986097573612918216327198",
    "81262007255124884521686184370069523810682153555080426986097573605221634932737",
    "81262007255124884521686184370069523810682153555080426986097573616216751210565"
];

//end of variables


//setup. do not touch.
const contractAddress = "0x495f947276749Ce646f68AC8c248420045cb7b5e"; //opensea shared storefront contract address
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(`https://eth-mainnet.g.alchemy.com/v2/${alchemyAPI}`));
const url = `https://eth-mainnet.g.alchemy.com/nft/v2/${alchemyAPI}/getNFTSales?fromBlock=0&toBlock=latest&order=asc&contractAddress=`
const options = {method: 'GET', headers: {accept: 'application/json'}};
const rateLimit = 5000 //5 seconds, needed for coingecko price API
const Excel = require('exceljs')
const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');
const root = process.cwd()
let totalSales = 0
worksheet.getCell(1, 1).value = 'Date';
worksheet.getCell(1, 2).value = 'Token ID';
worksheet.getCell(1, 3).value = `ETH Proceeds`;
worksheet.getCell(1, 4).value = `USD Proceeds`;
worksheet.getCell(1, 5).value = `ETH Royalties`;
worksheet.getCell(1, 6).value = `USD Royalties`;
//script
async function getOpenseaSharedStorefront(tokenId) {
    const response = await fetch(
        `${url}${contractAddress}&tokenId=${tokenId}`, options
    )
    const data = await response.json()
    const sales = data.nftSales
    const numOfSales = sales.length
    console.log(numOfSales, "sales for", tokenId)
    console.log()

    for (let i = 0; i < sales.length; i++) {
        const sale = sales[i];
        //console.log("Sale #", (i+1))
        const seller = sale.sellerAddress
        const block = sale.blockNumber
        if (seller.toLowerCase() == sellersAddress.toLowerCase()) {
            worksheet.getCell(totalSales+2, 2).value = tokenId;
            const ETHReceived = web3.utils.fromWei(sale.sellerFee.amount, 'ether')
            //console.log(sale)
            if (ETHReceived != 0) {
                const RoyaltiesReceived = web3.utils.fromWei(sale.royaltyFee.amount, 'ether')
                const blockTimestamp = await web3.eth.getBlock(block)
                var d = new Date(blockTimestamp.timestamp * 1000)
                var s = d.toUTCString()
                const month = (new Date(s).getUTCMonth() + 1).toString().padStart(2, '0');
                const dateNum = new Date(s).getUTCDate().toString().padStart(2, '0');
                const year = new Date(s).getUTCFullYear();
                //console.log(month,dateNum,year)
                worksheet.getCell(totalSales+2, 1).value = `${month}/${dateNum}/${year}`;
                const getHistorical = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/history?date=${dateNum}-${month}-${year}`)
                const historicalData = await getHistorical.json()
                const ethPrice = historicalData.market_data.current_price.usd
                //console.log("ETH Price:",ethPrice)
                worksheet.getCell(totalSales+2, 3).value = ethPrice;
                
                //totalEthReceived += parseInt(ETHReceived)
                //console.log(ETHReceived, "ETH")
                const USDValue = (ETHReceived*ethPrice)
                //totalUSDReceived += USDValue
                worksheet.getCell(totalSales+2, 4).value = USDValue;
                //console.log(USDValue, "Dollars")
                //totalRoyaltiesReceived += parseInt(RoyaltiesReceived)
                //console.log(RoyaltiesReceived, "ETH royalties")
                worksheet.getCell(totalSales+2, 5).value = RoyaltiesReceived;

                const USDValueRoyalties = (RoyaltiesReceived*ethPrice)
                //totalUSDRoyaltiesReceived += USDValueRoyalties
                worksheet.getCell(totalSales+2, 6).value = USDValueRoyalties;
                //console.log(USDValueRoyalties, "Dollar royalties")
                //console.log()
                //console.log()
            
            }
            totalSales += 1
          
        } else {
            worksheet.getCell(totalSales+2, 2).value = tokenId;
            const RoyaltiesReceived = web3.utils.fromWei(sale.royaltyFee.amount, 'ether')
            worksheet.getCell(totalSales+2, 5).value = RoyaltiesReceived;
            const blockTimestamp = await web3.eth.getBlock(block)
            var d = new Date(blockTimestamp.timestamp * 1000)
            var s = d.toUTCString()
            const month = (new Date(s).getUTCMonth() + 1).toString().padStart(2, '0');
            const dateNum = new Date(s).getUTCDate().toString().padStart(2, '0');
            const year = new Date(s).getUTCFullYear();
            //console.log(month,dateNum,year)
            worksheet.getCell(totalSales+2, 1).value = `${month}/${dateNum}/${year}`;
            worksheet.getCell(totalSales+2, 3).value = 0;
            worksheet.getCell(totalSales+2, 4).value = 0;
            const getHistorical = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/history?date=${dateNum}-${month}-${year}`)
            const historicalData = await getHistorical.json()
            const ethPrice = historicalData.market_data.current_price.usd
           // console.log("ETH Price:",ethPrice)
            //totalRoyaltiesReceived += parseInt(RoyaltiesReceived)
            //console.log(RoyaltiesReceived, "ETH royalties")
            const USDValueRoyalties = (RoyaltiesReceived*ethPrice)
            worksheet.getCell(totalSales+2, 6).value = USDValueRoyalties;
            //totalUSDRoyaltiesReceived += USDValueRoyalties
            //console.log(USDValueRoyalties, "Dollar royalties")
            //console.log()
            totalSales += 1
            
        }
        await new Promise(resolve => setTimeout(resolve, rateLimit));
    }
}

async function runProgram() {
    console.log(tokenIDs.length, "NFT's in collection.")
    console.log()
    for (let i = 0; i < tokenIDs.length; i++) {
        const tokenId = tokenIDs[i];
        await getOpenseaSharedStorefront(tokenId)
        workbook.xlsx.writeFile(`${root}/OpenseaSharedStorefrontSales.xlsx`)
    }

    
    //console.log("Total ETH in sales:", totalEthReceived)
    //console.log("Total USD in sales:", totalUSDReceived)
    //console.log("Total ETH in royalties:", totalRoyaltiesReceived)
    //console.log("Total USD in royalties:", totalUSDRoyaltiesReceived)
}

runProgram()
