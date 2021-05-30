const http = require('http');
const config = require('./config.json');
const apiUrls = require('./Constants/apiList.json');
const { getAllApisResponse } = require('./Functions/apiFunctions');

const server = http
  .createServer(async (req, res) => {
    const responseToSend = await getAllApisResponse();
    res.writeHead(200);
    res.end(JSON.stringify(responseToSend, null, 2));
    // global.fetch(url).then((res) => console.log("Response", res));
  })
  .listen(config.PORT);

server.on('listening', () => {
  console.warn('Server Started At ', 3002);
});
