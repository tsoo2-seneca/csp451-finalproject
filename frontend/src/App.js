import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
const appInsights = new ApplicationInsights({
  config: {
    connectionString: 'InstrumentationKey=8b7f47da-038a-4c45-8364-85b43e52b533;IngestionEndpoint=https://canadaeast-0.in.applicationinsights.azure.com/;LiveEndpoint=https://canadaeast.livediagnostics.monitor.azure.com/;ApplicationId=cb18c7ba-2090-44be-a3df-502c3050ef0a',
    enableAutoRouteTracking: true
  }
});
appInsights.loadAppInsights();
const App = () => {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});

  useEffect(() => {
  axios.get('http://4.239.122.140:6100/products')
    .then(response => setProducts(response.data))
    .catch(err => console.error('Error fetching products:', err));

  axios.get('http://4.239.122.140:5000/stock')
    .then(response => setStock(response.data))
    .catch(err => console.error('Error fetching stock:', err));
}, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>RetailOps Dashboard</h1>
      <h2>📦 Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ${p.price.toFixed(2)}</li>
        ))}
      </ul>
      <h2>📊 Stock</h2>
      <ul>
        {Object.entries(stock).map(([item, qty]) => (
          <li key={item}>{item} - {qty} units</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
