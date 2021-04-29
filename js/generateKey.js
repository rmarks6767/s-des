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

module.exports = {
  generateKeys,
}