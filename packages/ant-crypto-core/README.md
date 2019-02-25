# ant-crypto-core

Modify from the [Microsoft Research JavaScript Cryptography Library](https://www.microsoft.com/en-us/download/details.aspx?id=52439). I make a little change to make it work on mini program such as [Dingtalk EApp](https://open-doc.dingtalk.com/microapp/ln6dmh/bv006z) and [Alipay miniapp](https://mini.open.alipay.com/channel/miniIndex.htm).Previous features are not affected.

## What's MSR Crypto Library

The Microsoft Research JavaScript Cryptography Library has been developed for use with cloud services in an HTML5 compliant and forward-looking manner.

The algorithms are exposed via the W3C WebCrypto interface, and are tested against the Microsoft Edge implementation of that interface.

The library currently supports RSA encrypt/decrypt (PKCS#1 v1.5, OAEP, and PSS), AES-CBC and GCM encrypt/decrypt, SHA-256/384/512, HMAC with supported hash functions, PRNG (AES-CTR based) as specified by NIST, ECDH, ECDSA, and KDF (Concat mode).

The library is tested on IE8,9,10,11, Microsoft Edge and latest Firefox, Chrome, Opera, and Safari browsers.

This library includes big-number integer arithmetic to support the aforementioned cryptographic algorithms. It supports unsigned big integer arithmetic with addition, subtraction, multiplication, division, reduction, inversion, GCD, extended Euclidean algorithm (EEA), Montgomery multiplication, and modular exponentiation. It provides useful utility functions, such as endianness management and conversion routines. The big integer library is likely to change in future releases. There are also unit tests and some sample code.

This library is under active development. Future updates to this library may change the programming interfaces.

[ant-morse/msrCrypto](https://github.com/ant-morse/msrCrypto) is a mirror on Github.

## Where I modified

`msrcrypto.js`:
- Remove the polyfill of Promise. You can provide by yourself If needed.
- Add `modules.export`.
- Run in async mode if `window` or `global` is undefined.
- Jump what `EventListener` do if `addEventListener` is undefined.
- Jump what `attachEvent` and `detachEvent` do if they are both undefined.

## Thanks

Thanks to [kevlened](https://github.com/kevlened) for his outstanding work. I got the inspiration from his [isomorphic-webcrypto](https://github.com/kevlened/isomorphic-webcrypto).
