const express = require('express');
const cors = require('cors');
const app = express();
const allowedOrigins = ['http://localhost:3000', 'http://4.239.122.140:3000'];
//const appInsights = require("applicationinsights");
const products = [
  { id: 1, name: 'Apple', price: 1.5 },
  { id: 2, name: 'Banana', price: 1.0 },
];

//appInsights.setup("8b7f47da-038a-4c45-8364-85b43e52b533").start();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(6000, () => console.log('Product API running on port 6000'));
