const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000); // Increase timeout to 5 seconds

  test('Viewing one stock: GET request to /api/stock-prices/', async function() {
    const res = await chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG' });
    
    assert.equal(res.status, 200);
    assert.property(res.body, 'stockData');
    assert.property(res.body.stockData, 'stock');
    assert.property(res.body.stockData, 'price');
    assert.property(res.body.stockData, 'likes');
  });

  test('Viewing one stock and liking it: GET request to /api/stock-prices/', async function() {
    const res = await chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: 'true' });
    
    assert.equal(res.status, 200);
    assert.property(res.body, 'stockData');
    assert.property(res.body.stockData, 'stock');
    assert.property(res.body.stockData, 'price');
    assert.property(res.body.stockData, 'likes');
    assert.isAtLeast(res.body.stockData.likes, 1);
  });

  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', async function() {
    const res = await chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: 'true' });
    
    assert.equal(res.status, 200);
    assert.property(res.body, 'stockData');
    assert.property(res.body.stockData, 'stock');
    assert.property(res.body.stockData, 'price');
    assert.property(res.body.stockData, 'likes');
    assert.isAtLeast(res.body.stockData.likes, 1);
  });

  test('Viewing two stocks: GET request to /api/stock-prices/', async function() {
    const res = await chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'] });
    
    assert.equal(res.status, 200);
    assert.isArray(res.body.stockData);
    assert.equal(res.body.stockData.length, 2);
    assert.property(res.body.stockData[0], 'stock');
    assert.property(res.body.stockData[0], 'price');
    assert.property(res.body.stockData[0], 'rel_likes');
    assert.property(res.body.stockData[1], 'stock');
    assert.property(res.body.stockData[1], 'price');
    assert.property(res.body.stockData[1], 'rel_likes');
  });

  test('Viewing two stocks and liking them: GET request to /api/stock-prices/', async function() {
    const res = await chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: ['GOOG', 'MSFT'], like: 'true' });
    
    assert.equal(res.status, 200);
    assert.isArray(res.body.stockData);
    assert.equal(res.body.stockData.length, 2);
    assert.property(res.body.stockData[0], 'stock');
    assert.property(res.body.stockData[0], 'price');
    assert.property(res.body.stockData[0], 'rel_likes');
    assert.property(res.body.stockData[1], 'stock');
    assert.property(res.body.stockData[1], 'price');
    assert.property(res.body.stockData[1], 'rel_likes');
  });
});
