'use strict';
const util = require('./handler-util');
const postsHandler = require('./posts-handler');

function route(req, res) {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] === 'http'
  ) {
    util.handleNotFound(req, res);
    return;
  }

  const pathname = req.url.split('?')[0];

  switch (pathname) {
    case '/':
      util.handleTopPage(req, res);
      break;
    case '/api/messages':
      postsHandler.handle(req, res);
      break;
    default:
      util.handleStaticFile(req, res, pathname);
      break;
  }
}

module.exports = {
  route
};
