const path = require("path");
const fs = require("fs");
const fsProm = require("fs").promises;
const pathToComponents = path.join(__dirname, "/components");
const pathToDist = path.join(__dirname, "/project-dist");
const pathToOutput = path.join(pathToDist, "index.html");
const outputHtml = fs.createWriteStream(pathToOutput);

const pathToSourceStyles = path.join(__dirname, "/styles");
const pathToDestination = path.join(__dirname, "/project-dist/style.css");
const fileOutputCss = fs.createWriteStream(pathToDestination);

const pathToDistAssets = path.join(__dirname, "/project-dist/assets");
const pathToSourceAssets = path.join(__dirname, "/assets");

let dataBasic = "";

function copyAssets() {
  fs.mkdir(pathToDistAssets, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(pathToDistAssets, { withFileTypes: true }, (err1, files) => {
      if (err1) throw err1;
      files.forEach((file) => {
        fs.unlink(path.join(pathToDistAssets, file.name), (err2) => {
          if (err2) throw err2;
        });
      });
      fs.readdir(pathToSourceAssets, { withFileTypes: true }, (err3, files) => {
        if (err3) throw err3;
        files.forEach((file) => {
          fsProm.copyFile(
            path.join(pathToSourceAssets, file.name),
            path.join(pathToDistAssets, file.name)
          );
        });
      });
    });
  });
}

function main() {
  copyAssets();
  /*  const fileTemplate = path.join(__dirname, "template.html");

  fs.readFile(fileTemplate, "utf8", (err, data) => {
    if (err) throw err;
    fs.writeFile(pathToOutput, data, "utf8", (err) => {
      if (err) throw err;
      const readon = fs.createReadStream(pathToOutput, "utf-8");
      fs.mkdir(pathToDist, { recursive: true }, (err) => {
        if (err) throw err;
        readon.on("data", (line) => {
          dataBasic = line;
          changeHtml();
        });
      });
    });
  });
  fs.readdir(pathToSourceStyles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
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
  });*/
}

async function changeHtml() {
  let arrFiles = [];

  const readDir = fsProm
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
