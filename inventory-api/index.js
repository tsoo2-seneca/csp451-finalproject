const express = require('express');
const cors = require('cors');
const { QueueClient } = require('@azure/storage-queue');
//const appInsights = require("applicationinsights");
const app = express();
const allowedOrigins = ['http://localhost:3000', 'http://4.239.122.140:3000'];
const API_KEY = process.env.API_KEY || "retailops-secret-7Uj9@zX1";

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

app.use(express.json());

// In-memory stock data
let stock = {
  apple: 30,
  banana: 20,
};

// Azure Queue config
const queueName = "stock-events";
const connectionString = "DefaultEndpointsProtocol=https;AccountName=retailopsstore;AccountKey=KnqW+ZNBF+a5JwJtlRjAC2Jkx9JSATuLEA7m77c2VMOd+Z4eXdrysFZrZ1PMX2f1QsXf2+s1W/5w+ASt/Lz+Cg==;EndpointSuffix=core.windows.net";
const queueClient = new QueueClient(connectionString, queueName);

// API key config
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).send('Unauthorized: Invalid API key');
  }
  next();
});

// Get current stock
app.get('/stock', (req, res) => {
  res.json(stock);
});

// Update stock + trigger reorder if low
app.post('/update', async (req, res) => {
  const { item, quantity } = req.body;

  if (stock[item] === undefined) {
    return res.status(404).send('Item not found');
  }

  stock[item] = quantity;

  if (quantity < 10) {
    try {
      const message = Buffer.from(JSON.stringify({ item, quantity })).toString('base64');
      await queueClient.sendMessage(message);
      console.log(`⚠️ Low stock. Sent reorder message for ${item}`);
    } catch (err) {
      console.error('❌ Failed to send message to queue:', err);
    }
  }

  res.send(`Stock updated: ${item} = ${quantity}`);
});

// Start server
app.listen(5000, () => {
  console.log('✅ Inventory API running on port 5000');
});
