# S-DES (Simplified DES)
A Simplified DES implementation

## **The Algorithm**

### **Part 1: Key Generation**
In this part, a given 10-bit key will be used to generate 2 8-bit keys that will be used to encrypt our plaintext.

**Step 1:**</b> Begin with a 10 bit key which you will permutate according to:

```
[k1, k2, k3, k4, k5, k6, k7, k8, k9, k10] => [k3, k5, k2, k7, k4, k10, k1, k9, k8, k6]
``` 

**Step 2:** Split the result from step 1 into to 2 5-bit halves, performing a left shift of 1 on both of them. This is defined as:

```
[k1, k2, k3, k4, k5, k6, k7, k8, k9, k10] => [k10, k1, k2, k3, k4, k5, k6, k7, k8, k9]
``` 

**Step 3:** Recombine the result from step 2 into one 10-bit element. Now perform a permutation of 8 which is defined as: 

```
[k1, k2, k3, k4, k5, k6, k7, k8, k9, k10] => [k6, k3, k7, k4, k8, k5, k10, k9]
``` 

This result is the first key.

**Step 4:** Shift the already shifted halves of the left and right by another two bits and apply the same above permutation used for the first key.

The result of this is the second key, which means that both keys have been generated at this point.

### Part 2: Round 1 Encryption



### Part 3: Round 2 Encryption

### Part 4: Decryption