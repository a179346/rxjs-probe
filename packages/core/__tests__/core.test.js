const { expect, describe, it } = require('@jest/globals');

const { Probe, ProbePerformer } = require('../dist');

describe('Probe', () => {
  it('should be defined', () => {
    expect(Probe).toBeDefined();
  });

  it('Test probe', done => {
    try {
      let serviceHealthy = false;

      const performFn = () => {
        return new Promise((resolve, reject) => {
          if (serviceHealthy) {
            resolve();
          } else {
            reject(new Error('Service is unhealthy'));
          }
        });
      };

      const probe = new Probe({
        performer: new ProbePerformer(performFn),
        initialDelaySeconds: 1,
        periodSeconds: 1,
        timeoutSeconds: 1,
        successThreshold: 3,
        failureThreshold: 1,
      });

      let expectedStatus = 'unknown';
      const subscription = probe.createObservable().subscribe({
        next: value => {
          const unsubscribe = () => {
            setTimeout(() => {
              subscription.unsubscribe();
            }, 100);
          };
          try {
            expect(value).toEqual(expectedStatus);
            if (expectedStatus === 'unknown') {
              expectedStatus = 'unhealthy';
            } else if (expectedStatus === 'unhealthy') {
              expectedStatus = 'healthy';
              serviceHealthy = true;
            } else {
              unsubscribe();
              done();
            }
          } catch (error) {
            unsubscribe();
            done(error);
          }
        },
      });
    } catch (error) {
      done(error);
    }
  }, 5000);
});
