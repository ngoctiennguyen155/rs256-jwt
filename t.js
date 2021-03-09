const prvatekey = require("fs").readFileSync("private.key", {
  encoding: "utf-8",
});
console.log(prvatekey);
