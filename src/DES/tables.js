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

module.exports = {
  ep,
  initPerm,
  inversePerm,
  s0,
  s1,
  perm4,
  perm8,
  perm10,
};
