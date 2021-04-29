const { perm10, perm8 } = require('./tables');
const { permutate, performLeftShift } = require('./helpers');

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

  // Shift the left and right by now totaling 3
  const l2 = performLeftShift(l, 2);
  const r2 = performLeftShift(r, 2);

  return {
    key1: permutate([...l, ...r], perm8), 
    key2: permutate([...l2, ...r2], perm8),
  }
}

module.exports = {
  generateKeys,
}