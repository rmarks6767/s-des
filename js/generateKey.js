const { perm10, perm8 } = require('./tables');

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
  permutate,
}