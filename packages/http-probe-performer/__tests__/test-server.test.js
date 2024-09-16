const express = require('express');
const { describe, it, expect } = require('@jest/globals');

let server = null;

module.exports = {
  startServer(responseTimeout) {
    return new Promise(resolve => {
      const app = express();

      app.get('/', (req, res) => {
        setTimeout(() => {
          res.send();
        }, responseTimeout);
      });

      server = app.listen(3000, () => {
        resolve();
      });
    });
  },
  stopServer() {
    if (server) server.close();
  },
};

describe('test server', () => {
  it('test server shoud be defined', () => {
    expect(module.exports.startServer).toBeDefined();
    expect(module.exports.stopServer).toBeDefined();
  });
});
