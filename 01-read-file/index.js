const fs = require("fs");
const { stdout }= process;
const path = require("path");

const txtPath = path.join(__dirname, "text.txt");

const readStream = fs.createReadStream(txtPath, "utf-8");
readStream.on("data", (chunk) => stdout.write(chunk));
