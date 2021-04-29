const { generateKeys, permutate } = require('./generateKey');
const { ep, initPerm, inversePerm, s0, s1, perm4 } = require('./tables');

/**
 * Takes in a binary number and converts to decimal (base 10)
 * @param {*} bin the binary to be converted
 * @returns the binary number as decimal (base 10) 
 */
const binaryToDecimal = bin => parseInt(bin, 2);

/**
 * Takes in a decimal number and converts to binary
 * @param {*} dec the decimal to be converted
 * @returns the decimal number as binary 
 */
const decimalToBinary = dec => {  
  const d = (dec >>> 0).toString(2);
  
  if (d.length == 1) return `0${d}`;
  return parseInt(d);
}

/**
 * Takes in an item and mask used to xor 
 * @param {*} item n-bit item to be xor-ed
 * @param {*} mask n-bit mask used to xor the above item
 * @returns returns the xor-ed result
 */
const performXor = (item, mask) => {
  const result = [...item];

  for(let i = 0; i < result.length; i++) {
    result[i] = item[i] ^ mask[i];
  }

  return result;
}

/**
 * Takes in a 4-bit array and expands it using the expansion
 * table
 * @param {*} input array to be used to expand
 * @returns an 8-bit expansion of the provided input
 */
const expandPermutation = input => {
  const expanded = [...ep];

  for(let i = 0; i < expanded.length; i++) {
    expanded[i] = input[ep[i]];
  }

  return expanded;
}

/**
 * Takes in some text, either plaintext or ciphertext and computes
 * the result using the given key.
 * @param {*} text the text to be encrypted or decrypted
 * @param {*} key the key used to either encrypt or decrypt
 * @param {*} reverseResult used to specify if the result should be inverted,
 *                          which is not used in the second round
 * @returns 
 */
const cryption = (text, key, reverseResult = false) => {
  const l1 = text.slice(0, 4);
  const r1 = text.slice(4, 8);

  // Find Find EP(R(x)) ^ K1
  const rXor = performXor(expandPermutation(r1), key);

  // Apply the S-boxes
  const l2 = rXor.slice(0, 4);
  const r2 = rXor.slice(4, 8);

  // left side
  const row1 = binaryToDecimal([l2.slice(0, 1), l2.slice(3, 4)].join(''));
  const col1 = binaryToDecimal(l2.slice(1, 3).join(''));
  const leftS0 = decimalToBinary(s0[row1][col1]);

  // right side
  const row2 = binaryToDecimal(r2.slice(0, 2).join(''));
  const col2 = binaryToDecimal(r2.slice(2, 4).join(''));
  const rightS1 = decimalToBinary(s1[row2][col2]);

  const p4 = permutate(Array.from(`${leftS0}${rightS1}`).map(Number), perm4);

  // xor p4 with l1 and set as the right
  if (reverseResult) return [...r1, ...performXor(l1, p4)];
  return [...performXor(l1, p4), ...r1];
}

/**
 * Takes in an 8-bit plaintext and key and returns the ciphertext
 * @param {*} plaintext the plaintext to be encrypted
 * @param {*} key the key to be used to encrypt that plaintext
 * @returns returns the encrypted plaintext
 */
const encrypt = (plaintext, key) => {
  const { key1, key2 } = generateKeys(key);

  return permutate(
    cryption(
      cryption(
        permutate([...plaintext], initPerm), key1, true
      ), 
      key2, false
    ), 
    inversePerm,
  ).join('');
}

/**
 * Takes in an 8-bit ciphertext and key and returns the plaintext
 * @param {*} cipherText the ciphertext to be decrypted
 * @param {*} key the key that was used to encrypt that ciphertext
 * @returns the plaintext
 */
const decrypt = (cipherText, key) => {
  const { key1, key2 } = generateKeys(key);

  return permutate(
    cryption(
      cryption(
        permutate([...cipherText], initPerm), key2, true
      ), 
      key1, false
    ), 
    inversePerm,
  ).join('');
}

module.exports = {
  encrypt, 
  decrypt,
}