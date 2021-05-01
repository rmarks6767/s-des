const { generateKeys } = require('./generateKey');
const {
  initPerm, inversePerm, s0, s1, perm4,
} = require('./tables');
const {
  decimalToBinary, binaryToDecimal, permutate, expandPermutation, performXor,
} = require('./helpers.js');

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
  const rExpand = expandPermutation(r1);
  const rXor = performXor(rExpand, key);

  // Apply the S-boxes
  const l2 = rXor.slice(0, 4);
  const r2 = rXor.slice(4, 8);

  // left side
  const sliceRow1 = [l2.slice(0, 1), l2.slice(3, 4)].join('');
  const slideCol1 = l2.slice(1, 3).join('');
  const row1 = binaryToDecimal(sliceRow1);
  const col1 = binaryToDecimal(slideCol1);
  const leftS0 = decimalToBinary(s0[row1][col1]);

  // right side
  const sliceRow2 = [r2.slice(0, 1), r2.slice(3, 4)].join('');
  const slideCol2 = r2.slice(1, 3).join('');
  const row2 = binaryToDecimal(sliceRow2);
  const col2 = binaryToDecimal(slideCol2);
  const rightS1 = decimalToBinary(s1[row2][col2]);

  const sRes = Array.from(`${leftS0}${rightS1}`).map(Number);

  // permutate by 4
  const p4 = permutate(sRes, perm4);

  // perform xor on original left half
  const lXor = performXor(l1, p4);

  const steps = [
    `Split the text into two equal halves of bit length 4, ${l1.join('')} and ${r1.join('')} respectively.`,
    `Perform an expansion on the right half, turning ${r1.join('')} into ${rExpand.join('')}.`,
    `Perform an xor operation using the key, ${key.join('')} and the expanded right half from the previous step, giving ${rXor.join('')}.`,
    `Split the result of the Xor operation into two halves, left: ${l2.join('')} and right: ${r2.join('')}.`,
    `Now comes the calculation of what row and column to use from the S-Boxes. The first and fourth bit will be the row and the second and 
    third bit will be the column. The left side of the above split will use box S0 and the right will use box S1. Bits one and four of 
    the left, ${sliceRow1} are the row ${row1} and bits two and three of left, ${slideCol1} are the column ${col1} in S0. Bits one and four of 
    the right, ${sliceRow2} are the row ${row2} and bits two and three of right, ${slideCol1} are the column ${col2} in S1. This gives the values of 
    ${leftS0} for S0 and ${rightS1} for S1.`,
    `Now combine the result for S0 and S1 into one, ${sRes.join('')}.`,
    `Permutate that result by four, giving ${p4.join('')}.`,
    `Perform an Xor operation on the original left half, ${l1.join('')} from the first split with the four permutation result, ${p4.join('')}, giving ${lXor.join('')}.`,
  ];

  if (reverseResult) {
    const result = [...r1, ...lXor];

    return {
      result,
      steps: [
        ...steps,
        `Finally, recombine the original right half ${r1.join('')} and the result from the left side Xor, reversing the left and right, giving a result of ${result.join('')}.`,
      ],
    };
  }

  const result = [...lXor, ...r1];

  return {
    result,
    steps: [
      ...steps,
      `Finally, recombine the original right half ${r1.join('')} and the result from the left side Xor, giving a result of ${result.join('')}.`,
    ],
  };
};

/**
 * Takes in an 8-bit plaintext and key and returns the ciphertext
 * @param {*} plaintext the plaintext to be encrypted
 * @param {*} key the key to be used to encrypt that plaintext
 * @returns returns the encrypted plaintext
 */
const encrypt = (plaintext, key) => {
  // get the keys
  const { key1, key2, steps: keyGenSteps } = generateKeys(key);

  // perform the initial permutation
  const initialPermutation = permutate([...plaintext], initPerm);

  // perform round 1 encryption
  const { result: round1Result, steps: round1Steps } = cryption(initialPermutation, key1, true);

  // perform round 2 encryption
  const { result: round2Result, steps: round2Steps } = cryption(round1Result, key2, false);

  // perform final inverse permutation
  const inversePermutation = permutate(round2Result, inversePerm);

  // clean so it falls in correct letters
  const result = decimalToBinary((binaryToDecimal(inversePermutation.join('')) % 58) + 32);

  return {
    result,
    steps: {
      'Key Generation': keyGenSteps,
      'Intial Permutation': [`Perform the initial permutation on the plaintext, transforming ${plaintext} into ${initialPermutation.join('')}`],
      'Round 1': round1Steps,
      'Round 2': round2Steps,
      Finish: [`Finally, perform the inverse permutation, turning the round 2 result, ${round2Result.join('')}, into ${inversePermutation.join('')} or ${String.fromCharCode(binaryToDecimal(inversePermutation.join('')))}`],
    },
  };
};

/**
 * Takes in an 8-bit ciphertext and key and returns the plaintext
 * @param {*} cipherText the ciphertext to be decrypted
 * @param {*} key the key that was used to encrypt that ciphertext
 * @returns the plaintext
 */
const decrypt = (cipherText, key) => {
  // get the keys
  const { key1, key2, steps: keyGenSteps } = generateKeys(key);

  // perform the initial permutation
  const initialPermutation = permutate([...cipherText], initPerm);

  // perform round 1 encryption
  const { result: round1Result, steps: round1Steps } = cryption(initialPermutation, key2, true);

  // perform round 2 encryption
  const { result: round2Result, steps: round2Steps } = cryption(round1Result, key1, false);

  // perform final inverse permutation
  const inversePermutation = permutate(round2Result, inversePerm);

  const result = decimalToBinary((binaryToDecimal(inversePermutation.join('')) % 58) + 32);

  return {
    result,
    steps: {
      'Key Generation': keyGenSteps,
      'Intial Permutation': [`Perform the initial permutation on the cipherText, transforming ${cipherText} into ${initialPermutation.join('')}`],
      'Round 1': round1Steps,
      'Round 2': round2Steps,
      Finish: [`Finally, perform the inverse permutation, turning the round 2 result, ${round2Result.join('')}, 
      into ${inversePermutation.join('')} or ${String.fromCharCode(binaryToDecimal(inversePermutation.join('')))}.`],
    },
  };
};

module.exports = {
  encrypt,
  decrypt,
};
