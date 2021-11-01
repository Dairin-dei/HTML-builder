const path = require("path");
const fs = require("fs");
const pathToSource = path.join(__dirname, "/styles");
const pathToDestination = path.join(__dirname, "/project-dist/bundle.css");
const fileOutput = fs.createWriteStream(pathToDestination);
fs.readdir(pathToSource, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    let fileName = path.join(pathToSource, file.name.toString());
    let ext = path.extname(fileName);
    if (!file.isDirectory()) {
      if (ext == ".css") {
        let readon = fs.createReadStream(fileName, "utf-8");
        readon.on("data", (data) => {
          fileOutput.write(data);
        });
      }
    }
  });
});
