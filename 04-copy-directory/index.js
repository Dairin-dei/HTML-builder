const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const pathToFolder = path.join(__dirname, "/files-copy");
const pathToDir = path.join(__dirname, "/files");

fs.mkdir(pathToFolder, { recursive: true }, (err) => {
  if (err) throw err;
  fs.readdir(pathToFolder, { withFileTypes: true }, (err1, files) => {
    if (err1) throw err1;
    files.forEach((file) => {
      fs.unlink(path.join(pathToFolder, file.name), (err2) => {
        if (err2) throw err2;
      });
    });
    fs.readdir(pathToDir, { withFileTypes: true }, (err3, files) => {
      if (err3) throw err3;
      files.forEach((file) => {
        fsPromises.copyFile(
          path.join(pathToDir, file.name),
          path.join(pathToFolder, file.name)
        );
      });
    });
  });
});
