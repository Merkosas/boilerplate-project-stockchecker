'use strict';

const express = require('express');
const crypto = require('crypto');

// In-memory storage for likes
const likes = {};

// Function to anonymize IP addresses
function anonymizeIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

// Mock stock data
const mockStockData = {
  'GOOG': 2000,
  'MSFT': 300,
  'AAPL': 150
};

async function fetchStockPrice(stock) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (mockStockData[stock]) {
    return mockStockData[stock];
  } else {
    throw new Error('Unable to fetch stock price');
  }
}

module.exports = function(app) {
  const router = express.Router();

  router.get('/stock-prices', async (req, res) => {
    const { stock, like } = req.query;
    const ip = req.ip;
    const anonymizedIP = anonymizeIP(ip);

    try {
      const stocks = Array.isArray(stock) ? stock : [stock];
      const results = await Promise.all(stocks.map(async (s) => {
        const price = await fetchStockPrice(s);

        if (like === 'true') {
          if (!likes[s]) {
            likes[s] = [];
          }
          if (!likes[s].includes(anonymizedIP)) {
            likes[s].push(anonymizedIP);
          }
        }

        return {
          stock: s,
          price: price,
          likes: likes[s] ? likes[s].length : 0
        };
      }));

      if (results.length === 1) {
        res.json({ stockData: results[0] });
      } else {
        res.json({
          stockData: results.map(r => ({
            ...r,
            rel_likes: r.likes - (results.find(x => x.stock !== r.stock)?.likes || 0)
          }))
        });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error fetching stock data' });
    }
  });

  app.use('/api', router);
};
