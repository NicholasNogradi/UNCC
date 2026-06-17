import { Buffer, constants } from "node:buffer"; 

const b = Buffer.alloc(1e9); // Allocating a buffer of 1 GB

console.log(constants.MAX_LENGTH); // Output: 2147483647 (maximum buffer length in bytes)

setInterval(() => {
    for (let i = 0; i < b.length; i++) {
      b[i] = 0x22; // Filling the buffer with double quotes
    }

}, 5000);

console.log("Buffer allocated and filled successfully!");