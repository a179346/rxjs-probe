<div align="center">
<h1 align="center"> ✨ rxjs-probe ✨</h1>

<p>
  <a href="https://github.com/a179346/rxjs-probe/actions/workflows/npm-publish.yml" target="_blank">
    <img alt="Documentation" src="https://github.com/a179346/rxjs-probe/actions/workflows/npm-publish.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@rxjs-probe/core" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/npm/v/@rxjs-probe/core?maxAge=3600)" />
  </a>
  <a href="https://github.com/a179346/rxjs-probe#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/a179346/rxjs-probe/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/a179346/rxjs-probe/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/a179346/rxjs-probe" />
  </a>
</p>
</div>

> rxjs-probe provides an interface similar to [Kubernetes probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) using [RxJS](https://rxjs.dev/) to detect service health.

## 🔗 Link

- [Github](https://github.com/a179346/rxjs-probe)
- [npm](https://www.npmjs.com/package/@rxjs-probe/core)

## 📥 Install

```sh
npm i rxjs @rxjs-probe/core
```

## 🔑 Usage

```ts
import { Probe, ProbePerformer } from '@rxjs-probe/core';
import axios from 'axios';

const probe = new Probe({
  performer: new ProbePerformer(async timeoutSeconds => {
    await axios({
      url: 'https://github.com/a179346/rxjs-probe',
      timeout: timeoutSeconds * 1000,
      validateStatus: status => status === 200,
    });
  }),
  initialDelaySeconds: 3,
  periodSeconds: 2,
  timeoutSeconds: 1,
  successThreshold: 1,
  failureThreshold: 3,
});

const probeObservable = probe.createObservable();
```

probeObservable is an RxJS Observable. You can subscribe to it to get the probe status.

Check the [RxJS documentation - Observable](https://rxjs.dev/guide/observable) for more information.

## 📖 Examples

You can find more examples on how to use rxjs-probe in [rxjs-probe-examples GitHub repository](https://github.com/a179346/rxjs-probe-examples).

## 🔎 Probe Performers

- [Probe Performer](https://github.com/a179346/rxjs-probe-examples/tree/main?tab=readme-ov-file#-custom-probe-performer) - The customizable health check performer
- [Http Probe Performer](https://github.com/a179346/rxjs-probe/tree/main/packages/http-probe-performer#readme) - send HTTP GET requests to perform the health check.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/a179346/rxjs-probe/issues).

## 🌟 Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2024 [a179346](https://github.com/a179346).<br />
This project is [MIT](https://github.com/a179346/rxjs-probe/blob/main/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
