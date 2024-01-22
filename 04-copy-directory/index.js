const path = require("path");
const fs = require("fs");

const dirPathDestination = path.join(__dirname, "files-copy");
const dirPathSrc = path.join(__dirname, "files");

fs.rm(dirPathDestination, { recursive: true }, () => {
    fs.mkdir(dirPathDestination, { recursive: true }, (err) => {
        if (err) throw err;
        fs.readdir(dirPathSrc,
            { withFileTypes: true },
            (err, files) => {
                if (err)
                    console.log(err);
                else {
                    files.forEach(file => {
                        const dest = path.join(dirPathDestination, file.name);
                        const src = path.join(dirPathSrc, file.name);
                        fs.copyFile(src, dest, (err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(`File is copied: ${dest}`)
                            }
                        });
                    })
                }
            })
    });
});


