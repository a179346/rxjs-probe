const { expect, describe, it, beforeAll, afterAll } = require('@jest/globals');
const { firstValueFrom } = require('rxjs');

const { HttpProbePerformer } = require('../dist');

const { startServer, stopServer } = require('./test-server.test');

describe('HTTP Probe Performer', () => {
  it('should be defined', () => {
    expect(HttpProbePerformer).toBeDefined();
  });

  describe('test with dev server', () => {
    beforeAll(async () => {
      await startServer(1000);
    });

    afterAll(() => {
      stopServer();
    });

    it('should return true when the server is healthy', async () => {
      const performer = new HttpProbePerformer({
        host: 'localhost',
        port: 3000,
      });

      const observable = performer.createObservable(2);
      const healthy = await firstValueFrom(observable);
      expect(healthy).toEqual(true);
    }, 2000);

    it('should return false when timeoutd', async () => {
      const performer = new HttpProbePerformer({
        host: 'localhost',
        port: 3000,
      });

      const observable = performer.createObservable(0.5);
      const healthy = await firstValueFrom(observable);
      expect(healthy).toEqual(false);
    }, 2000);
  });
});
