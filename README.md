<h3 align="center">
  ANT CRYPTO
</h3>

<p align="center">
  Webcrypto library for node, browser and mini program
</p>

# Packages

This repository is a monorepo that we manage using [Lerna](https://github.com/lerna/lerna). That means that we actually publish [several packages](/packages) to npm from the same codebase, including:

| Package | Version | Docs | Description |
|--|--|--|--|
| [`ant-crypto-core`](/packages/ant-crypto-core) | ![npm](https://img.shields.io/npm/v/ant-crypto-core.svg?style=flat-square)| TBD | The javascript core of ant-crypto|
| [`ant-crypto-utils`](/packages/ant-crypto-utils) | ![npm](https://img.shields.io/npm/v/ant-crypto-utils.svg?style=flat-square)| TBD | The uitls of ant-crypto|
| [`ant-crypto`](/packages/ant-crypto) | ![npm](https://img.shields.io/npm/v/ant-crypto.svg?style=flat-square)| TBD | The core of ant-crypto|| [`ant-crypto`](/packages/ant-crypto) | ![npm](https://img.shields.io/npm/v/ant-crypto.svg?style=flat-square)](https://www.npmjs.com/package/ant-crypto) | TBD | The core of ant-crypto|

# Supported browsers

[webcrypto-shim](https://github.com/vibornoff/webcrypto-shim) will be needed if you want to support these browsers having prefixed and buggy webcrypto api implementations:

- Internet Explorer 11, Mobile Internet Explorer 11,
- Safari 8 - 10, iOS Safari 8 - 10.

Promise polyfill is also needed to be provided .

These browsers have unprefixed and conforming webcrypto api implementations, so no need in shim:

- Chrome 43+, Chrome for Android 44+,
- Opera 24+,
- Firefox 34+,
- Edge 12+.
- Safari 11+.

# Supported mini program
- [Dingtalk EApp](https://open-doc.dingtalk.com/microapp/ln6dmh/bv006z)
- [Alipay miniapp](https://mini.open.alipay.com/channel/miniIndex.htm)