const path = require("path");
const fs = require("fs");
const readline = require("readline");

let changedHtml = "";

function main() {
  const fileTemplate = path.join(__dirname, "template.html");

  const pathToDist = path.join(__dirname, "/project-dist");

  const readon = fs.createReadStream(fileTemplate, "utf-8");

  const rl = readline.createInterface({
    input: readon,
  });

  rl.on("line", (line) => {
    changeHtml(line);
  });
}

async function changeHtml(data) {
  let template = "";

  for (let i = 0; i < data.length; i++) {
    if (data[i] == "{") {
      if (i + 1 < data.length - 1) {
        if (data[i + 1] == "{") {
          let indexClose = data.indexOf("}}");
          template = data.slice(i + 2, indexClose);
          if (template.length > 0) {
            let changeLine = await new Promise((resolve, reject) => {
              const pathToComponents = path.join(__dirname, "/components");
              fs.readdir(
                pathToComponents,
                { withFileTypes: true },
                (err, files) => {
                  if (err) throw err;
                  files.forEach((file) => {
                    if (!file.isDirectory()) {
                      let ext = path.extname(file.name);
                      let fullPath = path.join(pathToComponents, file.name);
                      let name = path.basename(fullPath, ext);
                      if (name == template && ext == ".html") {
                        const readonT = fs.createReadStream(fullPath, "utf-8");
                        readonT.on("data", (data) => {
                          //console.log("yea");
                          resolve(data);
                        });
                      }
                    }
                  });
                }
              );
            });
            // console.log(changeLine);

            changedHtml =
              changedHtml + data.replace("{{" + template + "}}", changeLine);
          }
        }
      }
    }
  }
  console.log(changedHtml);
}

main();
