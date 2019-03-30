// module crypto.js provides cryptography operations using the Web Crypto API

import { utf8ToBuf, bufToB64, b64ToBuf, bufToUtf8 } from './encoding';

const AES_GCM = 'AES-GCM';
const PBKDF2 = 'PBKDF2';
const HKDF = 'HKDF';
const SHA256 = 'SHA-256';
const DEFAULT_KDF_ITERATION = 10000;

// AES_GCM_NONCE_SIZE is the size of the iv, in bytes, of AES in GCM mode
const AES_GCM_NONCE_SIZE = 12;

function mergeBuffers(buf1, buf2) {
  const buf = new ArrayBuffer(buf1.byteLength + buf2.byteLength);
  const bufView = new Uint8Array(buf);

  bufView.set(new Uint8Array(buf1), 0);
  bufView.set(new Uint8Array(buf2), buf1.byteLength);

  return buf;
}

// genRandomBytes returns an ArrayBuffer of random bytes of a given byte length.
function genRandomBytes(len) {
  const arr = new Uint8Array(len);
  return window.crypto.getRandomValues(arr);
}

export async function importAes256GcmKey(keyBuf) {
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyBuf,
    { name: AES_GCM },
    false,
    ['encrypt', 'decrypt']
  );

  return key;
}

export async function aes256GcmEncrypt(keyBuf, dataBuf) {
  const cipherKey = await importAes256GcmKey(keyBuf);
  const iv = genRandomBytes(AES_GCM_NONCE_SIZE);

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: AES_GCM,
      iv
    },
    cipherKey,
    dataBuf
  );

  return mergeBuffers(iv, encrypted);
}

export async function aes256GcmDecrypt(keyBuf, dataBuf) {
  const cipherKey = await importAes256GcmKey(keyBuf);

  // split iv and ciphertext
  const ivBuf = dataBuf.slice(0, AES_GCM_NONCE_SIZE);
  const cipherTextBuf = dataBuf.slice(AES_GCM_NONCE_SIZE);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: AES_GCM,
      iv: ivBuf
    },
    cipherKey,
    cipherTextBuf
  );

  return decrypted;
}

export async function pbkdf2(secretBuf, saltBuf, iterations) {
  const key = await window.crypto.subtle.importKey(
    'raw',
    secretBuf,
    { name: PBKDF2 },
    false,
    ['deriveBits']
  );

  return window.crypto.subtle.deriveBits(
    {
      name: PBKDF2,
      salt: saltBuf,
      iterations,
      hash: { name: SHA256 }
    },
    key,
    256
  );
}

export async function hkdf(secretBuf, saltBuf, infoBuf, algorithm, dkLen) {
  const key = await window.crypto.subtle.importKey(
    'raw',
    secretBuf,
    {
      name: HKDF
    },
    false,
    ['deriveBits']
  );

  return window.crypto.subtle.deriveBits(
    {
      name: HKDF,
      hash: algorithm,
      salt: saltBuf,
      info: infoBuf
    },
    key,
    dkLen
  );
}

export async function loginHelper({ email, password, iteration }) {
  const emailBuf = utf8ToBuf(email);
  const passwordBuf = utf8ToBuf(password);

  const masterKey = await pbkdf2(passwordBuf, emailBuf, iteration);
  const authKey = await hkdf(
    masterKey,
    emailBuf,
    utf8ToBuf('auth'),
    SHA256,
    256
  );

  return {
    masterKey: bufToB64(masterKey),
    authKey: bufToB64(authKey)
  };
}
