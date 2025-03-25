const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy requests to the external image URL
app.use(
  '/proxy',
  createProxyMiddleware({
    target: 'https://i.pinimg.com',
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
  })
);

app.listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});