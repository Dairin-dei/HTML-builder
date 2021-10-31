const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
let pathToFolder = path.join(__dirname, "/files-copy");
let pathToDir = path.join(__dirname, "/files");
fs.mkdir(pathToFolder, { recursive: true }, (err) => {
  if (err) throw err;
  fs.readdir(pathToDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fsPromises
        .copyFile(
          path.join(pathToDir, file.name),
          path.join(pathToFolder, file.name)
        )
        .then(() => {
          console.log("done", file.name);
        })
        .catch((err) => {
          console.log("can't");
        });
    });
  });
});
