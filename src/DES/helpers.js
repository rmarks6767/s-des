const { ep } = require('./tables');

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

module.exports = {
  permutate,
  performLeftShift,
  binaryToDecimal,
  decimalToBinary,
  performXor,
  expandPermutation,
}