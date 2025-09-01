/* eslint-disable no-misleading-character-class */
/* eslint-disable no-useless-escape */
import {superscriptMap} from './MappiningStrictChar';

const validateEmail = (email: string) => {
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const validatePhonenumber = (phonenumber: string) => {
  const re = /^0[0-9]{8,12}$/;
  return re.test(phonenumber);
};

function funcNameWoTitleDegree(name: string): string {
  const titles = ['DR', 'H.', 'HJ.', 'MR', 'MRS', 'MS', 'IR'];
  return name
    .split(' ')
    .filter(word => !titles.includes(word.toUpperCase()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeEnterAndChageToSpace(str: string): string {
  return str.replace(/[\r\n]+/g, ' ');
}

function toIDRFormat(str: string): string {
  const raw = str;
  const value = Number(raw.replace(/,/g, ''));
  const result = isNaN(value) ? '0' : value.toLocaleString('id-ID');
  return result;
}

function cleanText(input: string): string {
  const normalized = input.normalize('NFD').replace(/\u00A0/g, ' ');

  const replaced = normalized.replace(
    /[\u2070-\u209F\u02B0-\u02FF\u1D2C-\u1D7F]/g,
    c => superscriptMap[c] || '',
  );

  return replaced
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,{}[\]()<>:;"'!?@#$%^&*+=\\|/~`_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getBirthdayFromKtp(nik: string): string {
  if (nik.length >= 12) {
    let day = parseInt(nik.substring(6, 8), 10);
    if (day > 40) {
      day -= 40;
    }
    const month = nik.substring(8, 10);
    const year = nik.substring(10, 12);
    return `19${year}${month}${day.toString().padStart(2, '0')}`;
  }
  return '19000101';
}

function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '';
}

function checkStringLength(value: string, expectedLength: number): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().length === expectedLength;
}

/**
 * Validates a value against a given regex pattern.
 * @param value - The string value to validate.
 * @param pattern - The regex pattern to match.
 * @param options - Optional flags like 'i', 'g', 'm', etc.
 * @returns True if the value matches the pattern, false otherwise.
 */
function validateRegex(
  value: string,
  pattern: string,
  options?: string,
): boolean {
  try {
    const regex = new RegExp(pattern, options);
    return regex.test(value);
  } catch (err) {
    console.error('Invalid regex pattern:', err);
    return false;
  }
}

function hasSpecialCharacter(text: string): boolean {
  const specialCharPattern =
    /[!@#$%^&*()\[\]{}\-+=:;"'\\|,.<>/?~_\u00A0\u2070-\u209F\u02B0-\u02FF\u1D2C-\u1D7F\u0300-\u036f\u00C0-\u00FF]/;
  return specialCharPattern.test(text.normalize('NFD'));
}

const validateSetPassword = (password: string): boolean => {
  //validate new password atleast 8 characters, contain uppercase, lowercase, number and symbol
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]{8,}$/;
  return passwordRegex.test(password);
};

export {
  validateRegex,
  removeEnterAndChageToSpace,
  checkStringLength,
  isEmpty,
  validateEmail,
  validatePhonenumber,
  funcNameWoTitleDegree,
  getBirthdayFromKtp,
  hasSpecialCharacter,
  cleanText,
  toIDRFormat,
  validateSetPassword,
};
