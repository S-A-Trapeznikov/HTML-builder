const path = require("path");
const fs = require("fs");
const { stdout } = process;

const dirPath = path.join(__dirname, "secret-folder");

console.log(dirPath);

fs.readdir(dirPath,
    { withFileTypes: true },
    (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile()) {
                    const details = file.name.split('.');
                    const filePath = path.join(dirPath, file.name);
                    fs.stat(filePath, (err, stats) => {
                        if (err)
                            console.log(err);
                        else {
                            stdout.write(`${details[0]} - ${details[1]} - ${stats.size}\n`);
                        }
                    })
                }
            })
        }
    })
