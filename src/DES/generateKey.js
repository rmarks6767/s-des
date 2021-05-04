const { perm10, perm8 } = require('./tables');
const { permutate, performLeftShift } = require('./helpers');

/**
 * Takes in a key and returns the two generated keys
 * @param {*} key the key used to generate the other two keys
 * @returns the two keys that have been generated (key1 and key2)
 */
const generateKeys = (key) => {
  // Apply 10 bit permutation
  const p10 = permutate([...key], perm10);

  // Split result into left and right
  const leftHalf = p10.slice(0, 5);
  const rightHalf = p10.slice(5, 10);

  const l1 = performLeftShift(leftHalf, 1);
  const r1 = performLeftShift(rightHalf, 1);

  // Shift the left and right by now totaling 3
  const l2 = performLeftShift(l1, 2);
  const r2 = performLeftShift(r1, 2);

  const combine1 = [...l1, ...r1];
  const combine2 = [...l2, ...r2];

  const key1 = permutate(combine1, perm8);
  const key2 = permutate(combine2, perm8);

  return {
    key1,
    key2,
    steps: [
      `Apply 10 bit permutation to ${key}, turning it into ${p10.join('')}.`,
      `Split the 10 bit value into left, ${leftHalf.join('')}, and right, ${rightHalf.join('')}.`,
      `Perform a 1 bit shift on both of these, giving a new left of ${l1.join('')}, and a new right of ${r1.join('')}.`,
      `Recombine these two halves and perform an eight bit permutation, resulting in key 1: ${key1.join('')}.`,
      `Finally, perform a 2 bit shift on the values that were previously shifted and permutate the result of this by eight, giving key 2: ${key2.join('')}.`,
    ],
  };
};

module.exports = {
  generateKeys,
};
