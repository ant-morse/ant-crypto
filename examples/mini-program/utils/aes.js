import msrcrypto from 'ant-crypto-core';
import { toSupportedArray, bytesToHexString } from 'ant-crypto-utils';

const msubtle = msrcrypto.subtle;

function getRandomValues(pool) {
  for (let i = 0; i < pool.length; i += 1) {
    pool[i] = Math.floor(Math.random() * 256);
  }
  return pool;
}

export default async function onTap(plainText) {
  const fn = (this && this.setData) || console.log;

  let time = +new Date();

  const genkey = await msubtle.generateKey(
    {
      name: "AES-CBC",
      length: 256, //can be  128, 192, or 256
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"], //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );
  //returns a key object
  console.log(`generateKey`);
  console.log(genkey);

  fn({ genTime: +new Date() - time });
  time = +new Date();

  const keydata = await msubtle.exportKey(
    "jwk", //can be "jwk" or "raw"
    genkey, //extractable must be true
  );
  fn({ exportTime: +new Date() - time });
  time = +new Date();

  //returns the exported key data
  console.log(`exportKey`);
  console.log(keydata);

  const key = await msubtle.importKey(
    "jwk", //can be "jwk" or "raw"
    // {   //this is an example jwk key, "raw" would be an ArrayBuffer
    //   kty: "oct",
    //   k: "Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE",
    //   alg: "A256CTR",
    //   ext: true,
    // },
    keydata,
    {   //this is the algorithm options
      name: "AES-CBC",
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"], //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );
  fn({ importTime: +new Date() - time });
  time = +new Date();
  //returns the symmetric key
  console.log(`importKey`);
  console.log(key);

  const iv = getRandomValues(new Uint8Array(16));
  const encrypted = await msubtle.encrypt(
    {
      name: "AES-CBC",
      //Don't re-use initialization vectors!
      //Always generate a new iv every time your encrypt!
      iv,
    },
    key, //from generateKey or importKey above
    toSupportedArray(plainText), //ArrayBuffer of data you want to encrypt
  );
  //returns an ArrayBuffer containing the encrypted data
  console.log(`encrypt`);
  console.log(new Uint8Array(encrypted));
  fn({
    encryptedTime: +new Date() - time,
    encryptedText: bytesToHexString(toSupportedArray(encrypted)),
  });
  time = +new Date();
  msubtle.decrypt({
    name: "AES-CBC",
    iv, //The initialization vector you used to encrypt
  },
    key, //from generateKey or importKey above
    new Uint8Array(encrypted), //ArrayBuffer of the data
  )
    .then((decrypted) => {
      //returns an ArrayBuffer containing the decrypted data
      console.log(`decrypt`);
      console.log(new Uint8Array(decrypted));
      fn({
        decryptedTime: +new Date() - time,
        decryptedText: bytesToHexString(toSupportedArray(decrypted)),
      });
      time = +new Date();
    })
    .catch((err) => {
      console.error(err);
    });
};
