"use strict";
/**
 * @file
 */
const fs = require("fs");
const path = require("path");
const filerefs = require("../src/Filerefs.js");


const basePath = fs.realpathSync(path.join(__dirname, "artifacts/html"));
const html = fs.readFileSync(path.join(basePath, "index.html"), "utf8");
const refs = filerefs.getFilerefs(html, { basePath: basePath });
console.log(refs);
