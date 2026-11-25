'use strict';
const http = require('node:http');
const auth = require('http-auth');
const router = require('./lib/router');

const basic = auth.basic({
  realm: 'Enter username and password.',
  file: './users.htpasswd'
});

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/admin')) {
    basic.check((req, res) => {
      router.route(req, res);
    })(req, res);
  } else {
    router.route(req, res);
  }
})
  .on('error', e => {
    console.error('Server Error', e);
  })
  .on('clientError', e => {
    console.error('Client Error', e);
  });

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});
