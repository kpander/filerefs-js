/* https://github.com/kpander/filerefs-js */
/* dist/Filerefs.js v0.0.6 Wed Sep 06 2023 19:44:16 GMT-0400 (Eastern Daylight Saving Time) */

"use strict";const fs=require("fs"),path=require("path");module.exports=class a{static getFilerefs(c,e={}){if("string"!=typeof c)return!1;let i={...e},h=(i.basePath=i.basePath||!1,i.tags=i.tags||a.TAGS,{});return Object.keys(i.tags).forEach(e=>{var t=i.tags[e],e=new RegExp(`(<${e}[^>]+${t}=")(?!http|data:)(.*?)("[^>]{0,}>)`,"ig");for(const r of c.matchAll(e)){var s=r[0];h[s]=a._getRef(i.basePath,r[1],r[2],r[3])}}),h}static _getRef(e,t,a,s){e=e||"";var r=new URL("http://test.com"+path.join(e,a));let c;return c=""!==e&&!!fs.existsSync(r.pathname)&&r.pathname,{pre:t,relative:a,post:s,relativeBase:a.replace(r.search,"").replace(r.hash,""),relativeParams:r.search,relativeHash:r.hash,absolute:c}}static get TAGS(){return{link:"href",script:"src",img:"src",source:"srcset",audio:"src",video:"src",track:"src"}}};