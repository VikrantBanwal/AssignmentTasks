const axios = require('axios');
const apiUrls = require('../Constants/apiList.json');
const config = require('../config.json');

const hitApi = ({
  url, method = 'get', data = {}, params = {},
}) => axios({
  method,
  url,
  data,
  params,
});

const getApiStatus = async (url) => {
  const status = await hitApi({ url })
    .then((res) => res.status)
    .catch((err) => err.response.status);
  return status;
};

const getAllApisResponse = async () => {
  const keys = { SUCCESS: 'success', FAILED: 'failed' };
  const responseToSend = {
    success: true,
    message: 'Nice Message',
    data: {
      [keys.SUCCESS]: [],
      [keys.FAILED]: [],
    },
  };
  const promises = [];
  apiUrls.forEach((url) => promises.push(getApiStatus(url)));
  const promisesResArr = await Promise.all(promises);
  promisesResArr.forEach(
    (res, idx) => responseToSend.data[res === 200 ? keys.SUCCESS : keys.FAILED].push(
      { endpoint: apiUrls[idx], status: res },
    ),
  );
  return responseToSend;
};

const getCryptoInfo = async (txt) => {
  try {
    let res = await hitApi({ url: `${config.CRYPTO_URL_TRADING}/${txt}` });
    if (res.data.length) { return res.data[6]; } // If found in trading api

    res = await hitApi({ url: `${config.CRYPTO_URL_FUNDING}/${txt}` });
    if (res.data.length) { return res.data[9]; } // If found in funding api

    return null; // Not Found anywhere
  } catch (err) {
    console.error('apiFunctions.js -> getCryptoInfo() -> Error: ', err);
    return null;
  }
};

module.exports = {
  getAllApisResponse,
  getCryptoInfo,
};
