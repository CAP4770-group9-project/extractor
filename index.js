// const { parse } = require('json2csv');
// var csv = require("fast-csv");
// var fs = require('fs');
const axios = require('axios');
const config = require('./config');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'extract.csv',
  header: [
    { title: 'Symbol', id: 'symbol' },
    { title: 'Date', id: 'date' },
    { title: 'Open', id: 'open' },
    { title: 'Close', id: 'close' },
    { title: 'High', id: 'high' },
    { title: 'Low', id: 'low' },
    { title: 'Volume', id: 'volume' }
  ]
});

const searchStocks = async (query) => {
    response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${config.key}`);
    // console.log (response);
    return response.data;
};

const retrieveStockData = async (symbol) => {
    response = await axios.get(`https://www.alphavantage.co/query?function=${config.data_api}&symbol=${symbol}&outputsize=${config.outputsize}&apikey=${config.key}`);
    return response.data;
};

const initiateSearch = async () => {
    var data = [];
    for (var n = 0; n < config.queries.length; n++) {
        console.log("Sleeping for a minute");
        await sleep(61000);
        var stocks = await searchStocks(config.queries[n]);
        stocks = stocks.bestMatches;
        var stopperCount = 0;
        for (var i = 0; i < stocks.length; i++) {
            console.log(`Pulling data for stock #${i}: ${stocks[i]["1. symbol"]}`);
            console.log(`For query ${config.queries[n]}: ${i+1}/${stocks.length} stocks processed`);
            if (i == 3 || stopperCount == 5) {
                console.log("Sleeping for a minute");
                stopperCount = 0;
                await sleep(61000);
            } 
            stopperCount++;
            var pricesData = await retrieveStockData(stocks[i]["1. symbol"]);
            // console.log(pricesData);
            var tempKeys = Object.keys(pricesData);
            var dateStamps = Object.keys(pricesData[tempKeys[1]]);
            for (var j = 0; j < dateStamps.length; j++) {
                data.push({
                    symbol: stocks[i]["1. symbol"],
                    date: dateStamps[j],
                    open: pricesData[tempKeys[1]][dateStamps[j]]["1. open"],
                    close: pricesData[tempKeys[1]][dateStamps[j]]["4. close"],
                    high: pricesData[tempKeys[1]][dateStamps[j]]["2. high"],
                    low: pricesData[tempKeys[1]][dateStamps[j]]["3. low"],
                    volume: pricesData[tempKeys[1]][dateStamps[j]]["5. volume"]
                });
            }
        }
    }
    // var csvFile = await parse(data, {fields: fields});
    // fs.createWriteStream("extract.csv");
    // csv.write(csvFile, { headers: true }).pipe(ws);
    csvWriter
        .writeRecords(data)
        .then(()=> console.log('The CSV file was written successfully'));
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
} 

initiateSearch();