const { encrypt, decrypt } = require('./des');
const { binaryToDecimal, decimalToBinary } = require('./helpers'); 

// adjust them to be 8 bit length
const stringToBits = str => {
  return [...str].map((_, i) => {
    let bin = decimalToBinary(str.charCodeAt(i) , false).toString();
    const length = bin.length;

    if (length < 8) {
      for (let j = 0; j < 8 - length; j++) bin = '0' + bin;
    }

    return bin;
  });
}

const main = (plaintext, key) => {
  const bits = stringToBits(plaintext.toUpperCase());
  let cipherText = '';

  bits.forEach(bit => {
    const res = encrypt(bit, key)

    cipherText += String.fromCharCode(binaryToDecimal(res));
  });

  const cipherBits = stringToBits(cipherText);
  let text = '';

  cipherBits.forEach(bit => {
    const res = decrypt(bit, key)

    text += String.fromCharCode(binaryToDecimal(res));
  });

  console.log(`Plaintext: ${plaintext} encrypts to: ${cipherText}`);
  console.log(`Deciphered: ${text}`);

  if (plaintext.toUpperCase() === text) console.log('They are the same!');
}

main('Hello World', '110100101000100010011');