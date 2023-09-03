/* https://github.com/kpander/filerefs-js */
/* dist/Filerefs.js v0.0.4 Sun Sep 03 2023 11:50:52 GMT-0400 (Eastern Daylight Saving Time) */

"use strict";const fs=require("fs"),path=require("path");module.exports=class a{static getFilerefs(c,i={}){if("string"!=typeof c)return!1;i.basePath=i.basePath||!1,i.tags=i.tags||a.TAGS;let h={};return Object.keys(i.tags).forEach(e=>{var t=i.tags[e],e=new RegExp(`(<${e}[^>]+${t}=")(?!http)(.*?)("[^>]{0,}>)`,"ig");for(const r of c.matchAll(e)){var s=r[0];h[s]=a._getRef(i.basePath,r[1],r[2],r[3])}}),h}static _getRef(e,t,s,a){e=e||"";var r=new URL("http://test.com"+path.join(e,s));let c;return c=""!==e&&!!fs.existsSync(r.pathname)&&r.pathname,{pre:t,relative:s,post:a,relativeBase:s.replace(r.search,"").replace(r.hash,""),relativeParams:r.search,relativeHash:r.hash,absolute:c}}static get TAGS(){return{link:"href",script:"src",img:"src",source:"srcset",audio:"src",video:"src",track:"src"}}};