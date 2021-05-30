const fs = require('fs');
const path = require('path');

const saveCryptoInFile = (name = '', price = '') => {
  if (!name.length || !price.length) {
    console.error('Both Name and Price are required for saving crypto into file');
  }
  fs.appendFileSync(path.resolve('Utils/crypto.txt'), `${name}: ${price}\n`);
};

const clearCryptoFile = () => fs.writeFileSync(path.resolve('Utils/crypto.txt'), '');

module.exports = {
  saveCryptoInFile,
  clearCryptoFile,
};
