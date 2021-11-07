const fs = require("fs");
const path = require("path");
pathToDir = path.join(__dirname, "/secret-folder");
fs.readdir(pathToDir, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (!file.isDirectory()) {
      let fullName = file.name;
      let ext = path.extname(fullName);
      let fullPath = path.join(pathToDir, fullName);
      let name = path.basename(fullPath, ext);
      fs.stat(fullPath, (err, stats) => {
        if (err) throw err;
        console.log(`${name} - ${ext.slice(1)} - ${stats.size}b`);
      });
    }
  });
});
