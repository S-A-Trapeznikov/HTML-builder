const path = require("path");
const fs = require("fs");

const dirPathDestination = path.join(__dirname, "project-dist");
const dirAssetsPathDestination = path.join(dirPathDestination, "assets");
const dirStylesPathDestination = path.join(dirPathDestination, "style.css");
const dirIndexPathDestination = path.join(dirPathDestination, "index.html");
const dirStylePathSrc = path.join(__dirname, "styles");
const dirComponentPathSrc = path.join(__dirname, "components");
const dirTemplatePathSrc = path.join(__dirname, "template.html");
const dirAssetsPathSrc = path.join(__dirname, "assets");

const templatePatternRegExp = /\{\{[a-zA-Z]+\}\}/g;

let fileContent = '';

fs.rm(dirPathDestination, { recursive: true }, () => {
    fs.mkdir(dirPathDestination, { recursive: true }, (err) => {
        if (err) throw err;
        copyDirectory(dirAssetsPathSrc, dirAssetsPathDestination);
        buildStyles(dirStylePathSrc, dirStylesPathDestination);
        buildIndexHtml(dirTemplatePathSrc, dirIndexPathDestination);
    });
});

function saveFileContent(chunk) {
    fileContent = chunk.toString();
}

function modifyFileContent(match, chunk) {
    const replacementContent = chunk.toString();
    fileContent = fileContent.replace(match, replacementContent);
}

function buildIndexHtml(templateSrc, dest) {
    const readStream = fs.createReadStream(templateSrc, "utf-8");
    readStream.on("data", async (chunk) => {
        saveFileContent(chunk)
        const matches = [...fileContent.match(templatePatternRegExp)];
        for (const it in matches) {
            const match = matches[it];
            let fileName = match.substring(2, match.length - 2);
            const replacementPath = path.join(dirComponentPathSrc, `${fileName}.html`);
            const readReplacementContentStream = fs.createReadStream(replacementPath, "utf-8");
            readReplacementContentStream.on("data", (chunk) => {
                modifyFileContent(match, chunk);
            });

            readReplacementContentStream.once('end', () => {
                if (parseInt(it) === matches.length - 1) {
                    const writeStream = fs.createWriteStream(dest, "utf-8");
                    writeStream.write(fileContent);
                }
            });
        }
    });
};

function copyDirectory(src, dest) {
    fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) throw err;
        fs.readdir(src,
            { withFileTypes: true },
            (err, files) => {
                if (err)
                    console.log(err);
                else {
                    files.forEach(file => {
                        const destPath = path.join(dest, file.name);
                        const srcPath = path.join(src, file.name);
                        if (file.isFile()) {
                            fs.copyFile(srcPath, destPath, (err) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(`File is copied: ${srcPath}`)
                                }
                            });
                        } else {
                            copyDirectory(srcPath, destPath);
                        }
                    })
                }
            })
    })
}

function buildStyles(src, dest) {
    const writeStream = fs.createWriteStream(dest, "utf-8");

    fs.readdir(src,
        { withFileTypes: true },
        (err, files) => {
            if (err)
                console.log(err);
            else {
                files.forEach(file => {
                    if (file.name.split(".")[1] === "css") {
                        console.log(`Copying css styles from ${file.name}`);
                        const srcPath = path.join(src, file.name);
                        const readStream = fs.createReadStream(srcPath, "utf-8");
                        readStream.on("data", (chunk) => writeStream.write(chunk));
                    }
                })
            }
        });
}
