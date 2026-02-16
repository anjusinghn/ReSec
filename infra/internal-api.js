const http = require('http');

const flag = process.env.SSRF_FLAG || 'PCTFS{ssrf_internal_service_reached}';

const server = http.createServer((req, res) => {
  if (req.url === '/secret') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      flag: flag,
      message: 'Internal API accessed via SSRF',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
