"use strict";
/*global require, module, __dirname*/
/**
 * @file
 * Filerefs.js
 */
const fs = require("fs");
const path = require("path");

module.exports = class Filerefs {

  /**
   * Get all file references from the given HTML and return details about
   * each found local file.
   *
   * @param object options with properties:
   *   basePath: string to path where the HTML file is located
   *   tags: <optional> object with tag/attribute pairs to process. If provided,
   *     is used instead of the defaults from Filerefs.TAGS.
   *
   * @return object where
   *   key = original file reference
   *   value = path reference from _getRef()
   */
  static getFilerefs(html, options = {}) {
    if (typeof html !== "string") return false;

    options.basePath = options.basePath || false;
    options.tags = options.tags || Filerefs.TAGS;

    let refs = {};

    Object.keys(options.tags).forEach(tag => {
      const attr = options.tags[tag];
      const regex = new RegExp(`(<${tag}[^>]+${attr}=")(?!http)(.*?)("[^>]{0,}>)`, "ig");
      const matches = html.matchAll(regex);

      for (const match of matches) {
        const context = match[0];
        refs[context] = Filerefs._getRef(options.basePath, match[1], match[2], match[3]);
      }
    });

    return refs;
  }

  /**
   * Get the file reference parts.
   *
   * @param string pre: the text before the matched path
   *   e.g., '<img alt src="'
   * @param string relativeRef: the matched path
   *   e.g., './path/to/file.jpg?v=123'
   * @param string post: the text after the matched path
   *   e.g., '"'
   *
   * @return object with
   *   pre: as above (pre argument)
   *   relative: as above (relativeRef argument)
   *   post: as above (post argument)
   *   relativeBase: the relativeRef argument without url search params
   *     e.g., './path/to/file.jpg'
   *   relativeParams: the search params from relativeRef
   *     e.g., '?v=123'
   *   absolute: the absolute local filesystem path for the given file
   *     e.g., "/Users/name/www/local/path/to/file.jpg"
   *     If the file doesn't exist, this will be boolean false
   */
  static _getRef(basePath, pre, relativeRef, post) {
    if (!basePath) basePath = "";
    const url = new URL("http://test.com" + path.join(basePath, relativeRef));
    
    let absolute;
    if (basePath === "") {
      absolute = false;
    } else {
      absolute = fs.existsSync(url.pathname) ? url.pathname : false;
    }

    return {
      pre: pre,
      relative: relativeRef,
      post: post,
      relativeBase: relativeRef.replace(url.search, "").replace(url.hash, ""),
      relativeParams: url.search,
      relativeHash: url.hash,
      absolute: absolute,
    };
  }

  /**
   * Return the default tag/attribute pairs to process.
   *
   * Each pair defines the HTML tag and attribute to search for.
   */
  static get TAGS() {
    return {
      "link": "href",
      "script": "src",
      "img": "src",
      "source": "srcset",
      "audio": "src",
      "video": "src",
      "track": "src",
    };
  }
}

