const fs = require('fs');
const shellInterface = require('readline');
const { getCryptoInfo } = require('./Functions/apiFunctions');
const { saveCryptoInFile } = require('./Functions/fileHandlers');

const interactionInstance = shellInterface.createInterface({
  input: process.stdin,
  output: process.stdout,
});

interactionInstance.question(
  'Enter Crypto Name (e.g tBTCUSD): ',
  async (inptTxt) => {
    const res = await getCryptoInfo(inptTxt);
    if (!res) {
      console.log('No crypto was found for', inptTxt);
    } else {
      const price = res.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      saveCryptoInFile(inptTxt, price);
      console.log(`Price of ${inptTxt} is ${price}`);
    }
    interactionInstance.close();
  }
);
