import msrcrypto from 'ant-crypto';
import { toSupportedArray, bytesToHexString } from 'ant-crypto-utils';

// This is an HMAC Sha-256 sample.
// - import HMAC key
// - sign some data
// - verify the signature


// Go ahead and change window.msrCrypto to window.crypto in the line below to
// verify this code against the native browser web crypto api.

const subtle = msrcrypto.subtle;

// To compute the HMAC we need a key
// I generated this using .GenerateKey() then .ExportKey()
const hmckKeyInJwkFormat = {
  // The key type is an Octet sequence (used by symmetric keys)
  kty: "oct",

  // The algorithm. HMAC using SHA-256 in this case.
  alg: "HS256",

  // The actual bytes of the key encoded with Base64Url
  k: "aGUjFzJj_OHygK4VBybLIiwGmM5rgZU8jedDcFXp3xQ",

  // This key is extractable.
  ext: true,
};

// Variable to hold the key
let hmacKeyHandle;

// The algorithm used for the key import
const keyImportAlgorithm = { name: "HMAC", hash: { name: "SHA-256" } };

// Import the hmac key for HMAC SHA-256 using jwk format
subtle.importKey("jwk", hmckKeyInJwkFormat, keyImportAlgorithm, true, ["sign", "verify"])
  .then(
    (importedKeyHandle) => {
      hmacKeyHandle = importedKeyHandle;
    },
  );

export default async function onTap(plainText) {
  const fn = (this && this.setData) || console.log;
  let time1 = +new Date();

  // Make sure key has been imported
  if (!hmacKeyHandle) {
    return;
  }

  // Convert the plain text to a byte array.
  // The library expects data to be arrays of bytes. You'll have to convert
  // data before operating on it.
  // This sample uses a simple ASCII text conversion function. For multi-byte text
  // you will need UTF-8 conversion to bytes.
  const plainTextBytes = toSupportedArray(plainText);

  // The algorithm used for the hmac sign function
  const hmacSignAlgorithm = { name: "HMAC", hash: { name: "SHA-256" } };

  const hmacSignature = await subtle.sign(hmacSignAlgorithm, hmacKeyHandle, plainTextBytes)

  const sig = toSupportedArray(hmacSignature);

  const time2 = +new Date();

  fn({
    hamcHex: bytesToHexString(sig),
    hamcHexTime: time2 - time1,
  });

  time1 = time2;

  const hmacVerifyAlgorithm = { name: "HMAC", hash: { name: "SHA-256" } };

  const hmacVerify = await subtle.verify(
    hmacVerifyAlgorithm,
    hmacKeyHandle,
    sig,
    plainTextBytes);

  const time3 = +new Date();
  fn({
    hmacVerify,
    hmacVerifyTime: time3 - time1,
  });
}

