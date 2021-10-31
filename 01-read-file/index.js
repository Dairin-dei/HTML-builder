const path = require("path");
const fs = require("fs");

const filename = path.join(__dirname, "text.txt");

const readon = fs.createReadStream(filename, "utf-8");
readon.on("data", (info) => console.log(info));
