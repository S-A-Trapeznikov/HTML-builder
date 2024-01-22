const path = require("path");
const fs = require("fs");

const dirPathDestination = path.join(__dirname, "project-dist", "bundle.css");
const dirPathSrc = path.join(__dirname, "styles");

const writeStream = fs.createWriteStream(dirPathDestination, "utf-8");

fs.readdir(dirPathSrc,
    { withFileTypes: true },
    (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.name.split(".")[1] === "css") {
                    console.log(`Copying styles from ${file.name}`);
                    const src = path.join(dirPathSrc, file.name);
                    const readStream = fs.createReadStream(src, "utf-8");
                    readStream.on("data", (chunk) => writeStream.write(chunk));
                }
            })
        }
    });
