const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const pathToComponents = path.join(__dirname, "/components");
const pathToDist = path.join(__dirname, "/project-dist");

let outputHtml;

const pathToSourceStyles = path.join(__dirname, "/styles");

const pathToDistAssets = path.join(__dirname, "/project-dist/assets");
const pathToSourceAssets = path.join(__dirname, "/assets");

let dataBasic = "";

async function removeDirectory(pathToFolder) {
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
    });
  });
}

async function copyAssets() {
  removeDirectory(pathToDistAssets).then(() => {
    copyFiles(pathToSourceAssets, pathToDistAssets);
  });
}

function main() {
  fs.mkdir(pathToDist, { recursive: true }, (err) => {
    if (err) throw err;
    copyAssets();

    const fileTemplate = path.join(__dirname, "template.html");

    fs.readFile(fileTemplate, "utf8", (err, data) => {
      if (err) throw err;

      const pathToOutput = path.join(pathToDist, "index.html");
      const outputHtml = fs.createWriteStream(pathToOutput);
      if (err) throw err;
      //console.log("make dist");
      fs.writeFile(pathToOutput, data, "utf8", (err1) => {
        if (err1) throw err1;
        const readon = fs.createReadStream(pathToOutput, "utf-8");
        fs.mkdir(pathToDist, { recursive: true }, (err2) => {
          if (err2) throw err2;
          //console.log("create dist");
          readon.on("data", (line) => {
            dataBasic = line;
            changeHtml(outputHtml);
          });
        });
      });
    });

    fs.readdir(pathToSourceStyles, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      const fileOutputCss = fs.createWriteStream(
        path.join(__dirname, "/project-dist/style.css")
      );
      files.forEach((file) => {
        let fileName = path.join(pathToSourceStyles, file.name.toString());
        let ext = path.extname(fileName);
        if (!file.isDirectory()) {
          if (ext == ".css") {
            let readon = fs.createReadStream(fileName, "utf-8");
            readon.on("data", (data) => {
              fileOutputCss.write(data);
            });
          }
        }
      });
    });
  });
}

async function changeHtml(outputHtml) {
  let arrFiles = [];

  const readDir = fsPromises
    .readdir(pathToComponents, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (!file.isDirectory()) {
          arrFiles.push(file.name);
        }
      });
    })
    .catch((err) => {
      throw err;
    });

  await readDir;

  const repeat = repeateAgain(dataBasic, arrFiles);
  await repeat;

  outputHtml.write(dataBasic);
}

async function repeateAgain(dataBasic, arrFiles) {
  for (let i = 0; i < dataBasic.length; i++) {
    if (dataBasic[i] == "{") {
      if (i + 1 < dataBasic.length - 1) {
        if (dataBasic[i + 1] == "{") {
          let indexClose = dataBasic.indexOf("}}", i);
          template = dataBasic.slice(i + 2, indexClose);
          if (template.length > 0) {
            for (const file of arrFiles) {
              let ext = path.extname(file);
              let fullPath = path.join(pathToComponents, file);
              let name = path.basename(fullPath, ext);
              if (name == template && ext == ".html") {
                const iteration = changeTemplate(template, fullPath);
                await iteration;
              }
            }
          }
        }
      }
    }
  }
}

async function changeTemplate(template, fullPath) {
  const stream = fs.createReadStream(fullPath, "utf-8");
  return new Promise(function (resolve) {
    stream.on("data", (partData) => {
      dataBasic = dataBasic.replace("{{" + template + "}}", partData);
      resolve(dataBasic);
    });
  });
}

main();
