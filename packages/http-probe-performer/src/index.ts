import { ProbePerformer } from '@rxjs-probe/core';

/*!
 * @rxjs-probe/http-probe-performer
 *
 * The probe performer that send HTTP GET requests to perform the health check.
 *
 * [GitHub]: https://github.com/a179346/rxjs-probe
 * [npm]: https://www.npmjs.com/package/@rxjs-probe/http-probe-performer
 */

/**
 * The configuration for the HTTP probe performer.
 *
 * Check the [Kubernetes documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#http-probes) for more information.
 */
interface HttpProbePerformerConfig {
  host: string;
  scheme?: 'HTTP' | 'HTTPS';
  path?: string;
  httpHeaders?: { [key: string]: string };
  port?: number;
}

export class HttpProbePerformer extends ProbePerformer {
  constructor(config: HttpProbePerformerConfig) {
    _checkHttpProbePerformerConfig(config);

    const _scheme = config.scheme?.toUpperCase();

    const host = config.host;
    const scheme = _scheme === 'HTTPS' ? 'HTTPS' : 'HTTP';
    const path = config.path || '/';
    const httpHeaders = config.httpHeaders ?? {};
    const port = config.port;

    const url = new URL(
      `${scheme.toLowerCase()}://${host}${port ? `:${port}` : ''}${path[0] === '/' ? '' : '/'}${path}`
    ).toString();
    const headers = new Headers();
    for (const key in httpHeaders) {
      if (Object.prototype.hasOwnProperty.call(httpHeaders, key) && httpHeaders[key] !== undefined)
        headers.set(key, httpHeaders[key]);
    }

    super(async (timeoutSeconds: number) => {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        signal: AbortSignal.timeout(timeoutSeconds * 1000),
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        credentials: 'same-origin',
      });

      if (response.status < 200 || response.status >= 400) {
        throw new Error(`HTTP status code: ${response.status}`);
      }
    });
  }
}

function _checkHttpProbePerformerConfig(
  config: unknown
): asserts config is HttpProbePerformerConfig {
  if (typeof config !== 'object' || config === null) {
    throw new Error('config must be an object');
  }

  if (!('host' in config)) {
    throw new Error('host is required');
  }
  if (typeof config.host !== 'string' || config.host === '') {
    throw new Error('host must be a non-empty string');
  }

  if ('scheme' in config && config.scheme !== undefined) {
    if (typeof config.scheme !== 'string') {
      throw new Error('scheme must be "HTTP" or "HTTPS"');
    }
    if (config.scheme.toUpperCase() !== 'HTTP' && config.scheme.toUpperCase() !== 'HTTPS') {
      throw new Error('scheme must be "HTTP" or "HTTPS"');
    }
  }

  if ('path' in config && config.path !== undefined) {
    if (typeof config.path !== 'string') {
      throw new Error('path must be a string');
    }
  }

  if ('httpHeaders' in config && config.httpHeaders !== undefined) {
    if (typeof config.httpHeaders !== 'object' || config.httpHeaders === null) {
      throw new Error('httpHeaders must be an object');
    }
    for (const key in config.httpHeaders) {
      if (
        Object.prototype.hasOwnProperty.call(config.httpHeaders, key) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (config.httpHeaders as any)[key] !== undefined
      ) {
        if (typeof key !== 'string' || key === '') {
          throw new Error('httpHeaders keys must be non-empty strings');
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (config.httpHeaders as any)[key] !== 'string') {
          throw new Error('httpHeaders values must be strings');
        }
      }
    }
  }

  if ('port' in config && config.port !== undefined) {
    if (
      typeof config.port !== 'number' ||
      isNaN(config.port) ||
      !isFinite(config.port) ||
      !Number.isInteger(config.port) ||
      config.port < 1 ||
      config.port > 65535
    ) {
      throw new Error('port must be an integer between 1 and 65535');
    }
  }
}
