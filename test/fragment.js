"use strict";
/**
 * show how to use jsdom to take a fragment match from search regex.
 * then use jsdom to add attrs
 * the get outerhtml (and strip the closing tag if needed)
 */

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = '<p><img src="test.jpg"><script src="./hello.jpg"></script></p>';

const dom = new JSDOM(html);
const els = dom.window.document.querySelector("script");
console.log("scr outer:", els.outerHTML);

const eli = dom.window.document.querySelector("img");
eli.setAttribute("width", "100px");
console.log("img outer:", eli.outerHTML);

console.log("serialize:", dom.serialize());

