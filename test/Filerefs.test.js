"use strict";
/**
 * @file
 * Fileres.test.js
 */

const fs = require("fs");
const path = require("path");
const Util = require("@kpander/nodejs-util");
const Filerefs = require("../src/Filerefs");


const touch = function(path_base, filename) {
  Util.touch(path.join(path_base, filename));
  const stat = fs.statSync(path.join(path_base, filename));
  return stat.mtime.valueOf();
};

const invalidFiles = `
missingfile.css
missingfolder/file.css
./missingfile.css
./missingfolder/file.css
/missingfile.css
/missingfolder/file.css
folder/missingfile.css
./folder/missingfile.css
/folder/missingfile.css
`.trim().split("\n");

const validFiles = `
file.css
./file.css
/file.css
folder/file.css
./folder/file.css
/folder/file.css
`.trim().split("\n");


const createCSSReference = function(filename) {
  return `
<link rel="stylesheet" type="text/css" href="${filename}">
`;
}

// ---------------------------------------------------------------------

describe("External file references are missing or don't exist:", () => {

test(
  `[Missing-001]
  Given
    - html containing references to files/folders that don't exist
  When
    - we get filerefs
  Then
    - we get an object for each referenced file
    - each object's "absolute" property is false (because the files weren't found)
`.trim(), async() => {
  // Given...
  const html = invalidFiles.map(file => {
    return createCSSReference(file);
  }).join("");
//  console.log(html);

  // When...
  const refs = Filerefs.getFilerefs(html);
//  console.log("result:", refs);

  // Then...
  // ... should have an object we each entry in invalidFiles.
  expect(Object.keys(refs).length).toEqual(invalidFiles.length);
  Object.keys(refs).forEach((key, index) => {
    const ref = refs[key];

    // ... each should indicate no file was found.
    expect(ref.absolute).toEqual(false);
    // ... the relative key should match the original invalidFile item.
    expect(ref.relative).toEqual(invalidFiles[index]);
  });
});

test(
  `[Missing-002]
  Given
    - html only containing http or data references that should be ignored
  When
    - we get filerefs
  Then
    - we get no values
`.trim(), async() => {
  // Given...
  const html = `
<link rel="stylesheet" type="text/css" href="http://domain.com/file.css">
<link rel="stylesheet" type="text/css" href="data:text/css;base64,SGVsbG8sIFdvcmxkIQ%3D%3D">
`;

  // When...
  const refs = Filerefs.getFilerefs(html);

  // Then...
  // ... should have an object with no keys.
  expect(Object.keys(refs).length).toEqual(0);
});

});

// ---------------------------------------------------------------------

describe("Data structure elements", () => {

test(
  `[Data-001]
  Given
    - html containing references to a file that doesn't exist
    - a reference with url parameters and a hash
  When
    - we get filerefs
  Then
    - all data properties exist and contain expected values
`.trim(), async() => {
  // Given...
  const pre = '<link rel="stylesheet" type="text/css" href="';
  const params = '?foo=bar';
  const hash = '#hash';
  const relative = "./missingfile.css";
  const post = '">';
  const html = `
${pre}${relative}${params}${hash}${post}
`;

  // When...
  const refs = Filerefs.getFilerefs(html);

  // Then...
  // ... should have an object we each entry in invalidFiles.
  Object.keys(refs).forEach((key, index) => {
    const ref = refs[key];
    expect(key).toEqual(html.trim());

    expect(ref.pre).toEqual(pre);
    expect(ref.relative).toEqual(relative + params + hash);
    expect(ref.post).toEqual(post);

    expect(ref.relativeBase).toEqual(relative);
    expect(ref.relativeParams).toEqual(params);
    expect(ref.relativeHash).toEqual(hash);

    expect(ref.absolute).toEqual(false);
  });
});

// @todo do same as data-001 but with a file that does exist.

test(
  `[Data-002]
  Given
    - html containing references to a file that exists
    - a reference with url parameters and a hash
  When
    - we get filerefs
  Then
    - all data properties exist and contain expected values
`.trim(), async() => {
  // Given...
  const pre = '<script src="';
  const params = '?foo=bar';
  const hash = '#hash';
  const relative = "./" + path.basename(__filename);
  const post = '">';
  const html = `
${pre}${relative}${params}${hash}${post}
`;

  // When...
  const options = { basePath: __dirname };
  const refs = Filerefs.getFilerefs(html, options);

  // Then...
  // ... should have an object we each entry in invalidFiles.
  const key = Object.keys(refs)[0];
  const ref = refs[key];

  expect(key).toEqual(html.trim());

  expect(ref.pre).toEqual(pre);
  expect(ref.relative).toEqual(relative + params + hash);
  expect(ref.post).toEqual(post);

  expect(ref.relativeBase).toEqual(relative);
  expect(ref.relativeParams).toEqual(params);
  expect(ref.relativeHash).toEqual(hash);

  expect(ref.absolute).toEqual(__filename);
});

});

// ---------------------------------------------------------------------

describe("Test all tags", () => {

test(
  `[Tags-001]
  Given
    - html with all the default tags we check for
  When
    - we get filerefs
  Then
    - we get all the tag references
`.trim(), async() => {
  // Given...
  const html = `
<html>
<head>
  <link rel="stylesheet" type="text/css" href="file.css">
  <script src="file.js"></script>
</head>
<body>
<img src="file.png">
<picture>
  <source srcset="file.webp" type="image/webp">
</picture>
<audio src="file.mp3"></audio>
<video src="file.mp4"></video>
<track src="file.vtt"></track>
</body>
</html>
`;
  const tags = [ "link", "script", "img", "source", "audio", "video", "track" ];

  // When...
  const refs = Filerefs.getFilerefs(html);

  // Then...
  expect(Object.keys(refs).length).toEqual(tags.length);
  const str = Object.keys(refs).join(",");
  tags.forEach(tag => {
    expect(str.indexOf(tag)).not.toEqual(-1);
  });
});

});

