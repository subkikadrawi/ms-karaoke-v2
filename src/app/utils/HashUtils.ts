import CryptoJS from 'crypto-js';
import {config} from '../configs/AppConfig';

const encryptWithPrivateKey = (
  inputString: string,
  privateKey: string,
): string => {
  const encrypted = CryptoJS.AES.encrypt(inputString, privateKey).toString();
  return encrypted;
};

const decryptWithPrivateKey = (
  encryptedString: string,
  privateKey: string,
): string => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, privateKey);
  const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
};

const encryptMd5 = (encryptedString: string): string => {
  const encrypt = CryptoJS.MD5(encryptedString).toString();
  return encrypt;
};

const encryptSha256 = (encryptedString: string): string => {
  const encrypt = CryptoJS.SHA256(encryptedString).toString();
  return encrypt;
};

const encryptSha256WithPrivateKey = (encryptedString: string): string => {
  const encrypt = CryptoJS.HmacSHA256(
    encryptedString,
    config.PASSWORD_SECRET,
  ).toString();
  return encrypt;
};

export {
  encryptWithPrivateKey,
  decryptWithPrivateKey,
  encryptMd5,
  encryptSha256,
  encryptSha256WithPrivateKey,
};
