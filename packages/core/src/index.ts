import { forkJoin, Observable, race, repeat, switchMap, tap, timer } from 'rxjs';

/*!
 * @rxjs-probe/core
 *
 * rxjs-probe provides an interface similar to Kubernetes probes using RxJS to detect service health.
 *
 * [GitHub]: https://github.com/a179346/rxjs-probe
 * [npm]: https://www.npmjs.com/package/@rxjs-probe/core
 */

/**
 * ProbePerformer is a class that defines how to perform a health check.
 *
 * Use this class to create a custom health check performer.
 *
 * Or leverage our predefined health check performers:
 * - [HttpProbePerformer](https://www.npmjs.com/package/@rxjs-probe/http-probe-performer)
 */
export class ProbePerformer {
  /**
   * A function that performs the health check. Throw an error if the health check fails.
   */
  protected readonly _runHealthCheck: (timeoutSeconds: number) => Promise<void> | void;

  constructor(runHealthCheck: (timeoutSeconds: number) => Promise<void> | void) {
    this._runHealthCheck = runHealthCheck;
  }

  // @internal
  createObservable(timeoutSeconds: number) {
    return new Observable<boolean>(subscriber => {
      Promise.resolve()
        .then(() => {
          return this._runHealthCheck(timeoutSeconds);
        })
        .then(() => {
          subscriber.next(true);
          subscriber.complete();
          return;
        })
        .catch(() => {
          subscriber.next(false);
          subscriber.complete();
        });
    });
  }
}

export type ProbeStatus = 'unknown' | 'healthy' | 'unhealthy';

/**
 * ProbeConfig is the configuration for a probe.
 *
 * Check the [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for more information.
 */
export interface ProbeConfig {
  performer: ProbePerformer;
  initialDelaySeconds?: number;
  periodSeconds?: number;
  timeoutSeconds?: number;
  successThreshold?: number;
  failureThreshold?: number;
}

export class Probe {
  protected readonly _performer: ProbePerformer;
  protected readonly _initialDelaySeconds: number;
  protected readonly _periodSeconds: number;
  protected readonly _timeoutSeconds: number;
  protected readonly _successThreshold: number;
  protected readonly _failureThreshold: number;

  constructor(config: ProbeConfig) {
    _checkProbeConfig(config);
    this._performer = config.performer;
    this._initialDelaySeconds = config.initialDelaySeconds ?? 0;
    this._periodSeconds = config.periodSeconds ?? 10;
    this._timeoutSeconds = config.timeoutSeconds ?? 1;
    this._successThreshold = config.successThreshold ?? 1;
    this._failureThreshold = config.failureThreshold ?? 3;
  }

  /**
   * Create a [cold observable](https://rxjs.dev/guide/glossary-and-semantics#cold) that emits the status of the probe.
   *
   * If you want to share the observable among multiple subscribers, the [shareReplay
](https://rxjs.dev/api/index/function/shareReplay) operator is recommended.
   */
  createObservable() {
    return new Observable<ProbeStatus>(subscriber => {
      subscriber.next('unknown');

      let consecutiveSuccessCount = 0;
      let consecutiveFailureCount = 0;

      const onHealthCheckResult = (success: boolean | 0) => {
        if (success === true) {
          consecutiveSuccessCount = Math.min(
            consecutiveSuccessCount + 1,
            this._successThreshold + 1
          );
          consecutiveFailureCount = 0;

          if (consecutiveSuccessCount === this._successThreshold) subscriber.next('healthy');
        } else {
          consecutiveSuccessCount = 0;
          consecutiveFailureCount = Math.min(
            consecutiveFailureCount + 1,
            this._failureThreshold + 1
          );

          if (consecutiveFailureCount === this._failureThreshold) subscriber.next('unhealthy');
        }
      };

      const subscription = timer(this._initialDelaySeconds * 1000)
        .pipe(
          switchMap(() =>
            forkJoin([
              timer(this._periodSeconds * 1000),
              race([
                this._performer.createObservable(this._timeoutSeconds),
                timer(this._timeoutSeconds * 1000 + 50),
              ]).pipe(tap(onHealthCheckResult)),
            ]).pipe(repeat())
          )
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}

function _checkProbeConfig(config: unknown): asserts config is ProbeConfig {
  if (typeof config !== 'object' || config === null) {
    throw new Error('config must be an object');
  }

  if (!('performer' in config)) {
    throw new Error('performer is required');
  }
  if (!(config.performer instanceof ProbePerformer)) {
    throw new Error('performer must be an instance of ProbePerformer');
  }

  if ('initialDelaySeconds' in config && config.initialDelaySeconds !== undefined) {
    if (
      typeof config.initialDelaySeconds !== 'number' ||
      isNaN(config.initialDelaySeconds) ||
      !isFinite(config.initialDelaySeconds) ||
      config.initialDelaySeconds < 0
    )
      throw new Error('initialDelaySeconds must be a non-negative number');
  }

  if ('periodSeconds' in config && config.periodSeconds !== undefined) {
    if (
      typeof config.periodSeconds !== 'number' ||
      isNaN(config.periodSeconds) ||
      !isFinite(config.periodSeconds) ||
      config.periodSeconds <= 0
    )
      throw new Error('periodSeconds must be a positive number');
  }

  if ('timeoutSeconds' in config && config.timeoutSeconds !== undefined) {
    if (
      typeof config.timeoutSeconds !== 'number' ||
      isNaN(config.timeoutSeconds) ||
      !isFinite(config.timeoutSeconds) ||
      config.timeoutSeconds <= 0
    )
      throw new Error('timeoutSeconds must be a positive number');
  }

  if ('successThreshold' in config && config.successThreshold !== undefined) {
    if (
      typeof config.successThreshold !== 'number' ||
      isNaN(config.successThreshold) ||
      !isFinite(config.successThreshold) ||
      config.successThreshold <= 0 ||
      !Number.isInteger(config.successThreshold)
    )
      throw new Error('successThreshold must be a positive integer');
  }

  if ('failureThreshold' in config && config.failureThreshold !== undefined) {
    if (
      typeof config.failureThreshold !== 'number' ||
      isNaN(config.failureThreshold) ||
      !isFinite(config.failureThreshold) ||
      config.failureThreshold <= 0 ||
      !Number.isInteger(config.failureThreshold)
    )
      throw new Error('failureThreshold must be a positive integer');
  }
}
