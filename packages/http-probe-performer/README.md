<div align="center">
<h1 align="center"> ✨ rxjs-probe http-probe-performer ✨</h1>

<p>
  <a href="https://github.com/a179346/rxjs-probe/actions/workflows/npm-publish.yml" target="_blank">
    <img alt="Documentation" src="https://github.com/a179346/rxjs-probe/actions/workflows/npm-publish.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@rxjs-probe/http-probe-performer" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/npm/v/@rxjs-probe/http-probe-performer?maxAge=3600)" />
  </a>
  <a href="https://github.com/a179346/rxjs-probe/tree/main/packages/http-probe-performer#readme" target="_blank">
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

> The probe performer that send HTTP GET requests to perform the health check.

## 🔗 Link

- [Github](https://github.com/a179346/rxjs-probe)
- [npm](https://www.npmjs.com/package/@rxjs-probe/http-probe-performer)

## 📥 Install

```sh
npm i @rxjs-probe/core @rxjs-probe/http-probe-performer
```

## 🔑 Usage

```ts
import { HttpProbePerformer } from '@rxjs-probe/http-probe-performer';

const probePerformer = new HttpProbePerformer({
  host: 'github.com',
  path: '/a179346/rxjs-probe',
  scheme: 'HTTPS',
});
```

Probe performer should be used with the Probe from [@rxjs-probe/core](https://github.com/a179346/rxjs-probe/tree/main/packages/core) package.

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
