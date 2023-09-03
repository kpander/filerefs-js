# filerefs-js

Utility nodejs script to extract all local file references from HTML content, and determine absolute paths for each file.


# Installation

```bash
$ npm install --save-dev @kpander/filerefs-js
```


# Usage

```js
const html = `
<html>
  <head>
    <script src="js/vendor.js"></script>
    <script src="https://google.com/something.js">
    <link href="../css/global.css?version=2">
    <link href="/absolute/file.css">
    <link rel="icon" href="data:;">
  </head>
  <body>
    <img src="./image.jpg" width="100%">
</html>
`;
// Assume the files referenced in the HTML are relative to
// the same path as this script.
const basePath = __dirname;
const refs = Filerefs.getFilerefs(html, { basePath: basePath });

console.log(refs);
```

```js
{
  '<script src="js/vendor.js">': {
    pre: '<script src="',
    relative: 'js/vendor.js',
    post: '">',
    relativeBase: 'js/vendor.js',
    relativeParams: '',
    relativeHash: '',
    absolute: '/Users/name/path/to/wwww/base/js/vendor.js'
  },
  '<link href="../css/global.css?version=2">': {
    pre: '<link href="',
    relative: '../css/global.css?version=2',
    post: '">',
    relativeBase: '../css/global.css',
    relativeParams: '?version=2',
    relativeHash: '',
    absolute: '/Users/name/path/to/wwww/css/global.css'
  },
  '<link href="/absolute/file.css">': {
    pre: '<link href="',
    relative: '/absolute/file.css',
    post: '">',
    relativeBase: '/absolute/file.css',
    relativeParams: '',
    relativeHash: '',
    absolute: '/Users/name/path/to/wwww/base/file.css'
  },
  '<img src="./image.jpg" width="100%">': {
    pre: '<img src="',
    relative: './image.jpg',
    post: '" width="100%">',
    relativeBase: './image.jpg',
    relativeParams: '',
    relativeHash: '',
    absolute: '/Users/name/path/to/wwww/base/image.jpg'
  }
}
```

Note that `<script src="https://google.com/something.js">` wasn't returned in the results, because it's not a local file. Any reference beginning with `http` will be ignored.

Note that `<link rel="icon" href="data:;">` wasn't returned in the results, because it's a data url.

Note that `<link href="/absolute/file.css">` is returned. It has an absolute path reference (it begins with `/`) and is assumed to be in the same folder as the given `basePath` key.

Each primary key in the resulting object is the matched text with a local file in the source HTML. This is what you should use as the **search** value if you want to search/replace the value in the HTML.

The keys in each resulting object are as follows:

| key              | description |
| :-               | :-          |
| `pre`            | the text matched before the file reference |
| `relative`       | the file reference in the HTML |
| `post`           | the text matched after the file reference |
| `relativeBase`   | the file reference, without any URL arguments |
| `relativeParams` | the URL arguments in the file reference |
| `relativeHash`   | the URL hash (if any) in the file reference |
| `absolute`       | the absolute path to the file on disk (without URL arguments). `boolean false` if the file wasn't found |


## Use case

I want to find all images in an HTML fragment and use a local utility to determine their width, height, and filesize.

I want to find all file references in an HTML fragment and append a URL argument that indicates their last modified time.

In both cases, I need to find all references, get information from the actual file on disk, and then update the reference in the HTML.


### Updating the HTML references

It's a simple search and replace.

The "search" value is the primary object key (e.g., the element `'<script src="js/vendor.js">'`).

The "replace" value is a concatenation of:

  - `pre` + `relativeBase` (modified) + `relativeParams` + (modified) + `relativeHash` + `post`


# API

There's only one method you want. All methods are static.

## `<object> Filerefs.getFilerefs(<string> html, <object> options)`

See the "Usage" example above for details.



# Developers

## Build distribution files

```bash
$ npm run build
```

This will build the distribution files in the `/dist/` folder. Run this before publishing a new release.


## Publishing a new version

This assumes you have an `.npmrc` file in the folder with a valid Github token for creating packages.

```bash
$ npm run build
$ npm publish
```


# TODO

  - Add the Jest test cases (see `test/test.js`)

Yes, we're using regex to parse HTML instead of a parsing engine (like cheerio or jsDOM). Yes, that's brittle and bad. Assume we're using this for our very specific use case and we're not going to encounter things like '>' characters in a data attribute in markup.


# Maintainer

  - Kendall Anderson (kpander@invisiblethreads.com)


