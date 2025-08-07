const http = require('http');

module.exports = async function (context, myTimer) {
  const now = new Date().toISOString();
  context.log(`📅 Timer trigger started at ${now}`);
  const API_KEY = 'retailops-secret-7Uj9@zX1';
  const options = {
    hostname: '4.239.122.140',
    port: 5000,
    path: '/stock',
    method: 'GET',
    headers: {
      'x-api-key': API_KEY
    }
  };

  const fetchStock = () => {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(new Error('Failed to parse JSON response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  };

  try {
    const stock = await fetchStock();

    let summary = '📦 Daily Stock Summary:\n';
    for (const [item, qty] of Object.entries(stock)) {
      summary += `- ${item}: ${qty}\n`;
    }

    context.log(summary);
  } catch (error) {
    context.log.error('❌ Failed to fetch stock data:', error.message);
  }
};