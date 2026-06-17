const { Buffer } = require("buffer");
const Express = require("express")

const app = Express();

app.get("/", (req, res) => {
    const buff = Buffer.from("Hello, World1", "utf-8"); // Create a buffer from a string using UTF-8 encoding
    res.send(buff.toString()); // Send the buffer as a string in the response
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const memoryContainer = new Buffer.alloc(4); // 4 bytes of memory allocated



memoryContainer[0] = 0xF4; // Assigning a hexadecimal value to the first byte
memoryContainer[1] = 0x34;
memoryContainer[2] = 0x00;
memoryContainer[3] = 0xff;

console.log(memoryContainer); // <Buffer f4 34 b6 ff>
console.log(memoryContainer[0]); // 244
console.log(memoryContainer[1]); // 52
console.log(memoryContainer[2]); // 0
console.log(memoryContainer[3]); // 255

console.log(memoryContainer.toString("hex"))




const buff1 = Buffer.from([0x48, 0x69, 0x21]);
console.log(buff1.toString("utf-8")); // Output: "Hi!"

//Creates a new Buffer containing string. The encoding parameter identifies the character encoding to be used when converting string into bytes.
const buff2 = Buffer.from("486921", "hex");
console.log(buff2.toString("utf-8")); // Output: "Hi!"

const buff = Buffer.from("string", "utf-8"); // Create a buffer from a string using UTF-8 encoding

