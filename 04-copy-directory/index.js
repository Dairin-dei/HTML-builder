const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const pathToFolder = path.join(__dirname, "/files-copy");
const pathToDir = path.join(__dirname, "/files");

async function removeDirectory() {
  await fsPromises.rmdir(pathToFolder, { recursive: true });
}

async function copyFiles(pathCurrent, pathFuture) {
  fsPromises
    .mkdir(pathFuture, { recursive: true })
    .then(() => {})
    .catch((err) => {
      throw err;
    });

  fs.readdir(pathCurrent, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      if (!file.isDirectory()) {
        fsPromises
          .copyFile(
            path.join(pathCurrent, file.name),
            path.join(pathFuture, file.name)
          )
          .then(() => {})
          .catch((err) => {
            throw err;
          });
      } else {
        return copyFiles(
          path.join(pathCurrent, file.name),
          path.join(pathFuture, file.name)
        );
      }
      //    }
    });
  });
}

async function main() {
  removeDirectory().then(() => {
    copyFiles(pathToDir, pathToFolder);
  });
}

main();
