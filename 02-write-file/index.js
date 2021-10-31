const path = require("path");
const fs = require("fs");
const readline = require("readline");

const pathToFile = path.join(__dirname, "output.txt");

const outputFile = fs.createWriteStream(pathToFile);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let arr = [];
console.log("write something");
rl.on("line", (line) => {
  if (line == "exit") {
    rl.close();
  } else {
    outputFile.write(line + "\n");
  }
});

rl.on("close", () => {
  console.log("Good bye!");
});
