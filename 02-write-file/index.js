const fs = require("fs");
const { stdin, stdout } = process;
const path = require("path");

stdout.write("Hello! I listen to you:");

const outputFilePath = path.join(__dirname, "output.txt");
const writeStream = fs.createWriteStream(outputFilePath, "utf-8");

stdin.on("data", (data) => {
    if (data.toString().trim() === "exit") {
        process.exit();
    }
    writeStream.write(data)
});

process.on("exit", () => stdout.write("Goodbye!"));
process.on("SIGINT", () => process.exit());
