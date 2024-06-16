import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const routes = {
    '/api/auth': 'http://localhost:5000/auth',
    '/api/users': 'http://localhost:5000/users',
    '/api/msgs': 'http://localhost:8080/msgs'
}

for(const route in routes) {
    const target = routes[route];
    app.use(route, createProxyMiddleware({target, changeOrigin: true}));
}

const PORT  = 2000;

app.listen(PORT, ()=> {
    console.log(`API Gateway started listening on PORT: ${PORT}`);
})