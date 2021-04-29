/******************************************
 * 
 * The tables used for the below functions
 * 
 *****************************************/

// Expansion permutation
const ep = [3, 0, 1, 2, 1, 2, 3, 0];

// Initial permutation and inverse
const initPerm = [1, 5, 2, 0, 3, 7, 4, 6];
const inversePerm = [3, 0, 2, 4, 6, 1, 7, 5];

// S-boxes
const s0 = [
  [1, 0, 3, 2], 
  [3, 2, 1, 0],
  [0, 2, 1, 3], 
  [3, 1, 3, 2],
];
const s1 = [
  [0, 1, 2, 3], 
  [2, 0, 1, 3],
  [3, 0, 1, 0], 
  [2, 1, 0, 3],
];

// 4-bit permuation
const perm4 = [1, 3, 2, 0];

// 8-bit permuation
const perm8 = [5, 2, 6, 3, 7, 4, 9, 8];

// 10-bit permuation
const perm10 = [2, 4, 1, 6, 3, 9, 0, 8, 7, 5];

/******************************************
 * 
 * The helper functions
 * 
 *****************************************/

/**
 * Takes in an array and shifts it the given amount
 * @param {*} arr the array to be be shifted 
 * @param {*} amount the amount to shift that array
 * @returns the shifted array
 */
const performLeftShift = (arr, amount) => {
  const shifted = [];

  for(let i = 0; i < arr.length; i++) {
    shifted.push(arr[(i + amount) % arr.length])
  }

  return shifted;
}

/**
 * Takes in a binary item and performs the given permutation
 * @param {*} input item to be permutated
 * @param {*} perm  the permuation to be performed
 * @returns the permutated item
 */
const permutate = (input, perm) => {
  const permutation = [...perm];

  for(let i = 0; i < permutation.length; i++) {
    permutation[i] = input[perm[i]];
  }

  return permutation;
}

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

/******************************************
 * 
 * The Key generation function
 * 
 *****************************************/

/**
 * Takes in a key and returns the two generated keys
 * @param {*} key the key used to generate the other two keys
 * @returns the two keys that have been generated (key1 and key2)
 */
const generateKeys = key => {
  // Apply 10 bit permutation
  const p10 = permutate([...key], perm10);

  // Split result into left and right
  const l = performLeftShift(p10.slice(0, 5), 1);
  const r = performLeftShift(p10.slice(5, 10), 1);
  
  // Apply 1 bit shift and permutate using perm8
  const key1 = permutate([...l, ...r], perm8);

  // Do the same except with a 2 bit perm
  const key2 = permutate(
    [
      ...performLeftShift(l, 2),
      ...performLeftShift(r, 2),
    ], 
    perm8
  );

  return {
    key1, 
    key2,
  }
}

/******************************************
 * 
 * The Encryption and Decryption functions
 * 
 *****************************************/
 
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