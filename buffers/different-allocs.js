import { Buffer } from "node:buffer";

const buffer = Buffer.alloc(10000, 0); // Allocating a buffer of 10,000 bytes and initializing it with zeros. This is a safe way to allocate memory as it ensures that the buffer does not contain any old data.


const unsafeBuffer = Buffer.allocUnsafe(10000); // Allocating a buffer of 10,000 bytes without initializing it. The contents of this buffer may contain old data and should be used with caution.

// These two methods use allocUnsafe internally but they are safe because they initialize the buffer with the provided data. They are useful for creating buffers from existing data without the risk of exposing old memory contents.
Buffer.from();
Buffer.concat();

Buffer.poolSize; // The default size of the internal buffer pool used by Buffer.allocUnsafe() and Buffer.allocUnsafeSlow(). This is typically 8 KB (8192 bytes) but can be adjusted based on the application's needs.

for(let i = 0; i < unsafeBuffer.length; i++) {
    if (unsafeBuffer[i] !== 0) {
        console.log(`Unsafe buffer contains non-zero byte at index ${i}: ${unsafeBuffer[i].toString(2)}`);
        break;
    }
}

