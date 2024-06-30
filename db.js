const fs = require("fs");
// promise 语法糖支持
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

exports.getDb = async () => {
  let data = await readFile("./db.json", "utf8");
  return JSON.parse(data);
};

exports.saveDb = async (data) => {
  const sdata = JSON.stringify(data);
  return await writeFile("./db.json", sdata);
};
