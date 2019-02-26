import msrcrypto from 'ant-crypto';
import { toSupportedArray, bytesToHexString } from 'ant-crypto-utils';

const publicKey = {
  kty: "RSA",
  ext: true,
  n: "uZQSanGzrG9aSPj3-yReDkFj4JDDPQJo5noV_HgntHhqyF6ZZPA3n4z4qmI39Hfjovv1EmWrS0aFofEBF-87EB0PF2Z445KMHFDQmv8kUe6wblf95EKQ0XI2OBadFaiIBIxgCmbG7o-pJQjY74U0KDMQEwe0DfMcfFZ_-y6vxEd-RNeff2Lm-sQlZ7E0HpBlwQGYHJZonv1mVuZuVlF1qDaam7V_8cF8MgrbqQP_xG4eM5odLNqAOTGNrtvo5XV-a5Qzd2gVqAc0VrayOUknjX_2OTndik5YWLspva6L-T07ysnMPqiqD0tTPcR_3hYHqNDKpWujbmtSevBOtLUgVw",
  e: "AQAB",
};

const privateKey = {
  kty: "RSA",
  ext: true,
  n: "uZQSanGzrG9aSPj3-yReDkFj4JDDPQJo5noV_HgntHhqyF6ZZPA3n4z4qmI39Hfjovv1EmWrS0aFofEBF-87EB0PF2Z445KMHFDQmv8kUe6wblf95EKQ0XI2OBadFaiIBIxgCmbG7o-pJQjY74U0KDMQEwe0DfMcfFZ_-y6vxEd-RNeff2Lm-sQlZ7E0HpBlwQGYHJZonv1mVuZuVlF1qDaam7V_8cF8MgrbqQP_xG4eM5odLNqAOTGNrtvo5XV-a5Qzd2gVqAc0VrayOUknjX_2OTndik5YWLspva6L-T07ysnMPqiqD0tTPcR_3hYHqNDKpWujbmtSevBOtLUgVw",
  e: "AQAB",
  d: "KZH2OBrlNRyyfEMtBXhli0rxjRXQbkOybOJvN2FQ_5ezz9OFB_vZceeZsk0THLOYbeODx823e8K934NFi-9-awMfZM4DCXND6Hnf6MB7idDue6FBUdbpaslrRNAn-viIE4DAaMQSDtFmgdHECo9rmg-qK6Efn7pUKLQVshYIsG4ytQ8Om6CJ8MVWR8hwL-65uSCSUElXDHaG-U8CkfivEIesVPfkQ65Cd16zPYlqIReRSaB_w2I7orf_1T5IY1aa0FuzBxEq1q8FPLQnZfIOCG_kMGhUnMJRx8NarQJUILbnKX7kNPMq-eiSvBuHBIFpsJ-VSDHpq9aPqQYskpsYCQ",
  p: "_DYTq5Kr_c-abCL5yZ517mw_k3Hpruh3q9ibQVrjT10nuWlLwR8N_rv6uxs6t9qyfncXGPOjgMOvrSSWW49AzTLJ7DgCWtZvH1TKR4YilR3En2D9cww1f9iYCKBbyxvrT7X5mT9g2yGTxOoVObqq46GdaaNaWd8FuTpX-HEfjA8",
  q: "vF2_J4nJHXFPxdJe_Om1xGJGp0eJVDfMY4YQBx2awW-sijjRUtqS8rH8ckPABvBEzYi95e1FoMwRVKo3XSlxPlBrJZHtsj3lVY83tDnO-Nv4rPCoX_nQFaVSVdmIVpiUF9yFrIjndtACppANAGcfhpZutrYjfru2NM6xOmkU_zk",
  dp: "tT1K_1VkIP0ptCGiLH-hsZa6TQNj8Rv-u0_pqZpdlK-Vl0iSdpIRZYfCEujrViljcTu1LmoOib6VpK-RGPSllY-0yPoqvwovSm2M-r7qZQvCOuHg3-bbHycPgctyi09h1qMnXTfNK0tCvBOW8ygwG2oNC1em2sRIgaXqh48LI4M",
  dq: "G_aKxxLUUVOd9Q8K3N7RBgtU08Zx45e49tlTDcteSvMKGSbgJD2gbPjxMgFOw3jtrdlr33M-z-UbeYcfWuwpDIghr90e_UPlBLOTIGUojZcSLpI3XLAYLO5y752weLKD4ZryGS_ltKSikBl4ZKPqcS9p1iPp1wmEvgglFTe-Tzk",
  qi: "PZuSu0-5MEY0Zgry7_A9ZMN91tqSkcmEpfRVuKnilj8zNmOEAUyEq8lvMji5oFBxFKtx0pbqiK5tuxPecdwJ7Y8iYxu2Wb50IoORJggc4er6Q5NIA3_XKEn3x8GORqdibPuPHZXXjd4sG6dQIZJbWNEyzvzyRDfidrKZxS5yvIU",
};

let encryptedBytes,
  publicKeyHandle,
  privateKeyHandle,
  keyImportAlgorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
  encryptAlgorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
  decryptAlgorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } };

const msubtle = msrcrypto.subtle;
// Import the public key and private keys for RSA-OAEP using jwk format
msubtle.importKey("jwk", publicKey, keyImportAlgorithm, true, ["encrypt"])
  .then(
    (publicKey) => {
      publicKeyHandle = publicKey;
      return msubtle.importKey(
        "jwk",
        privateKey,
        keyImportAlgorithm, true, ["decrypt"]);
    },
    (error) => {
      console.error("Public Key import error ");
      console.error(error);
      return Promise.reject(`Public Key import error ${error}`);
    },
  )
  .then(
    (privateKey) => {
      privateKeyHandle = privateKey;
    },
    (error) => {
      console.error("Private Key import error ");
      console.error(error);
    },
  );

export default async function onTap(plainText) {
  const fn = (this && this.setData) || console.log;
  // Abort if the key isn't imported yet
  if (!publicKeyHandle) {
    return;
  }
  const plainTextBytes = toSupportedArray(plainText);
  let time1 = +new Date();
  // Now that we have a public key, we can encrypt our data
  const encrypted = await msubtle.encrypt(encryptAlgorithm, publicKeyHandle, plainTextBytes)

  // We get our encrypted bytes as an ArrayBuffer (Array for IE8/9)
  encryptedBytes = toSupportedArray(encrypted);
  const time2 = +new Date();

  // Display the encrypted data on the page
  fn({
    encryptedPlainText: bytesToHexString(encryptedBytes),
    encryptTime: time2 - time1,
  });

  time1 = time2;
  // Now we'll decrypt the encrypted data back to its original text
  const decryptedBytes = await msubtle.decrypt(
    decryptAlgorithm,
    privateKeyHandle,
    encryptedBytes);

  // Called when the RSA decrypt operation is completed
  // RSA decryption is very slow.
  // It can take 3-4 seconds with the debugger attached.
  const time3 = +new Date();

  // Convert the bytes back into a string
  const decryptedPlainText = String.fromCharCode.apply(null, toSupportedArray(decryptedBytes));
  fn({
    decryptedPlainText,
    decryptTime: time3 - time1,
  });
}

