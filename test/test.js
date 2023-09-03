"use strict";
/**
 * @file
 */
const fs = require("fs");
const path = require("path");
const filerefs = require("../src/Filerefs.js");


const basePath = fs.realpathSync(path.join(__dirname, "artifacts/html"));
let html = fs.readFileSync(path.join(basePath, "index.html"), "utf8");
const refs = filerefs.getFilerefs(html, { basePath: basePath });
//console.log(refs);


// Rewrite the html to add a query string to all filerefs that were found
let newHTML = html;
Object.keys(refs).forEach(key => {
  if (refs[key].absolute) {
    const ref = refs[key];

    const url = new URL("http://test.com" + ref.relative);
    url.searchParams.set("newparam", "123");
    const newPath = url.pathname + url.search;

    const search = key;
    const replace = ref.pre + newPath + ref.post;
    newHTML = newHTML.replaceAll(search, replace);
  }
});
//console.log("FINAL HTML:\n", newHTML);


// Rewrite the html to add attributes to specific filerefs that were found
let imgHTML = html;
const options = {
  basePath: basePath,
  tags: {
    "img": "src"
  }
};
const refsimg = filerefs.getFilerefs(html, options);
Object.keys(refsimg).forEach(key => {
  if (refsimg[key].absolute) {
    const ref = refsimg[key];
    console.log(key, ref);

    /*
    const url = new URL("http://test.com" + ref.relative);
    url.searchParams.set("newparam", "123");
    const newPath = url.pathname + url.search;

    const search = key;
    const replace = ref.pre + newPath + ref.post;
    imgHTML = imgHTML.replaceAll(search, replace);
    */
  }
});

console.log("FINAL HTML:\n", imgHTML);


