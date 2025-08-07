const http = require('http');

module.exports = async function (context, req) {
  // Support GET via query params
  const item = req.query.item;
  const quantity = parseInt(req.query.quantity);
  const API_KEY = 'retailops-secret-7Uj9@zX1';

  if (!item || isNaN(quantity)) {
    context.res = {
      status: 400,
      body: '❌ Missing or invalid parameters: item and quantity are required.'
    };
    return;
  }

  const data = JSON.stringify({ item, quantity });

  const options = {
    hostname: '4.239.122.140',
    port: 5000,
    path: '/update',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-api-key': API_KEY
    }
  };

  const promise = new Promise((resolve, reject) => {
    const request = http.request(options, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: responseData
        });
      });
    });

    request.on('error', error => {
      reject(error);
    });

    request.write(data);
    request.end();
  });

  try {
    const response = await promise;
    context.res = response;
  } catch (err) {
    context.res = {
      status: 500,
      body: `❌ Request failed: ${err.message}`
    };
  }
};
