/*!
	Papa Parse
	v4.1.1
	https://github.com/mholt/PapaParse
*/
!function(e){"use strict";function t(t,r){if(r=r||{},r.worker&&w.WORKERS_SUPPORTED){var n=h();return n.userStep=r.step,n.userChunk=r.chunk,n.userComplete=r.complete,n.userError=r.error,r.step=m(r.step),r.chunk=m(r.chunk),r.complete=m(r.complete),r.error=m(r.error),delete r.worker,void n.postMessage({input:t,config:r,workerId:n.id})}var o=null;return"string"==typeof t?o=r.download?new i(r):new a(r):(e.File&&t instanceof File||t instanceof Object)&&(o=new s(r)),o.stream(t)}function r(e,t){function r(){"object"==typeof t&&("string"==typeof t.delimiter&&1==t.delimiter.length&&-1==w.BAD_DELIMITERS.indexOf(t.delimiter)&&(u=t.delimiter),("boolean"==typeof t.quotes||t.quotes instanceof Array)&&(o=t.quotes),"string"==typeof t.newline&&(f=t.newline))}function n(e){if("object"!=typeof e)return[];var t=[];for(var r in e)t.push(r);return t}function i(e,t){var r="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=e instanceof Array&&e.length>0,i=!(t[0]instanceof Array);if(n){for(var a=0;a<e.length;a++)a>0&&(r+=u),r+=s(e[a],a);t.length>0&&(r+=f)}for(var o=0;o<t.length;o++){for(var h=n?e.length:t[o].length,d=0;h>d;d++){d>0&&(r+=u);var c=n&&i?e[d]:d;r+=s(t[o][c],d)}o<t.length-1&&(r+=f)}return r}function s(e,t){if("undefined"==typeof e||null===e)return"";e=e.toString().replace(/"/g,'""');var r="boolean"==typeof o&&o||o instanceof Array&&o[t]||a(e,w.BAD_DELIMITERS)||e.indexOf(u)>-1||" "==e.charAt(0)||" "==e.charAt(e.length-1);return r?'"'+e+'"':e}function a(e,t){for(var r=0;r<t.length;r++)if(e.indexOf(t[r])>-1)return!0;return!1}var o=!1,u=",",f="\r\n";if(r(),"string"==typeof e&&(e=JSON.parse(e)),e instanceof Array){if(!e.length||e[0]instanceof Array)return i(null,e);if("object"==typeof e[0])return i(n(e[0]),e)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),e.data instanceof Array&&(e.fields||(e.fields=e.data[0]instanceof Array?e.fields:n(e.data[0])),e.data[0]instanceof Array||"object"==typeof e.data[0]||(e.data=[e.data])),i(e.fields||[],e.data||[]);throw"exception: Unable to serialize unrecognized input"}function n(t){function r(e){var t=_(e);t.chunkSize=parseInt(t.chunkSize),this._handle=new o(t),this._handle.streamer=this,this._config=t}this._handle=null,this._paused=!1,this._finished=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this._completeResults={data:[],errors:[],meta:{}},r.call(this,t),this.parseChunk=function(t){var r=this._partialLine+t;this._partialLine="";var n=this._handle.parse(r,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var i=n.meta.cursor;this._finished||(this._partialLine=r.substring(i-this._baseIndex),this._baseIndex=i),n&&n.data&&(this._rowCount+=n.data.length);var s=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(k)e.postMessage({results:n,workerId:w.WORKER_ID,finished:s});else if(m(this._config.chunk)){if(this._config.chunk(n,this._handle),this._paused)return;n=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),!s||!m(this._config.complete)||n&&n.meta.aborted||this._config.complete(this._completeResults),s||n&&n.meta.paused||this._nextChunk(),n}},this._sendError=function(t){m(this._config.error)?this._config.error(t):k&&this._config.error&&e.postMessage({workerId:w.WORKER_ID,error:t,finished:!1})}}function i(e){function t(e){var t=e.getResponseHeader("Content-Range");return parseInt(t.substr(t.lastIndexOf("/")+1))}e=e||{},e.chunkSize||(e.chunkSize=w.RemoteChunkSize),n.call(this,e);var r;this._nextChunk=k?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)return void this._chunkLoaded();if(r=new XMLHttpRequest,k||(r.onload=g(this._chunkLoaded,this),r.onerror=g(this._chunkError,this)),r.open("GET",this._input,!k),this._config.chunkSize){var e=this._start+this._config.chunkSize-1;r.setRequestHeader("Range","bytes="+this._start+"-"+e),r.setRequestHeader("If-None-Match","webkit-no-cache")}try{r.send()}catch(t){this._chunkError(t.message)}k&&0==r.status?this._chunkError():this._start+=this._config.chunkSize},this._chunkLoaded=function(){if(4==r.readyState){if(r.status<200||r.status>=400)return void this._chunkError();this._finished=!this._config.chunkSize||this._start>t(r),this.parseChunk(r.responseText)}},this._chunkError=function(e){var t=r.statusText||e;this._sendError(t)}}function s(e){e=e||{},e.chunkSize||(e.chunkSize=w.LocalChunkSize),n.call(this,e);var t,r,i="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,r=e.slice||e.webkitSlice||e.mozSlice,i?(t=new FileReader,t.onload=g(this._chunkLoaded,this),t.onerror=g(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var n=Math.min(this._start+this._config.chunkSize,this._input.size);e=r.call(e,this._start,n)}var s=t.readAsText(e,this._config.encoding);i||this._chunkLoaded({target:{result:s}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function a(e){e=e||{},n.call(this,e);var t,r;this.stream=function(e){return t=e,r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}}}function o(e){function t(){if(b&&c&&(f("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+w.DefaultDelimiter+"'"),c=!1),e.skipEmptyLines)for(var t=0;t<b.data.length;t++)1==b.data[t].length&&""==b.data[t][0]&&b.data.splice(t--,1);return r()&&n(),i()}function r(){return e.header&&0==y.length}function n(){if(b){for(var e=0;r()&&e<b.data.length;e++)for(var t=0;t<b.data[e].length;t++)y.push(b.data[e][t]);b.data.splice(0,1)}}function i(){if(!b||!e.header&&!e.dynamicTyping)return b;for(var t=0;t<b.data.length;t++){for(var r={},n=0;n<b.data[t].length;n++){if(e.dynamicTyping){var i=b.data[t][n];b.data[t][n]="true"==i||"TRUE"==i?!0:"false"==i||"FALSE"==i?!1:o(i)}e.header&&(n>=y.length?(r.__parsed_extra||(r.__parsed_extra=[]),r.__parsed_extra.push(b.data[t][n])):r[y[n]]=b.data[t][n])}e.header&&(b.data[t]=r,n>y.length?f("FieldMismatch","TooManyFields","Too many fields: expected "+y.length+" fields but parsed "+n,t):n<y.length&&f("FieldMismatch","TooFewFields","Too few fields: expected "+y.length+" fields but parsed "+n,t))}return e.header&&b.meta&&(b.meta.fields=y),b}function s(t){for(var r,n,i,s=[",","	","|",";",w.RECORD_SEP,w.UNIT_SEP],a=0;a<s.length;a++){var o=s[a],f=0,h=0;i=void 0;for(var d=new u({delimiter:o,preview:10}).parse(t),c=0;c<d.data.length;c++){var l=d.data[c].length;h+=l,"undefined"!=typeof i?l>1&&(f+=Math.abs(l-i),i=l):i=l}h/=d.data.length,("undefined"==typeof n||n>f)&&h>1.99&&(n=f,r=o)}return e.delimiter=r,{successful:!!r,bestDelimiter:r}}function a(e){e=e.substr(0,1048576);var t=e.split("\r");if(1==t.length)return"\n";for(var r=0,n=0;n<t.length;n++)"\n"==t[n][0]&&r++;return r>=t.length/2?"\r\n":"\r"}function o(e){var t=l.test(e);return t?parseFloat(e):e}function f(e,t,r,n){b.errors.push({type:e,code:t,message:r,row:n})}var h,d,c,l=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,p=this,g=0,v=!1,k=!1,y=[],b={data:[],errors:[],meta:{}};if(m(e.step)){var R=e.step;e.step=function(n){if(b=n,r())t();else{if(t(),0==b.data.length)return;g+=n.data.length,e.preview&&g>e.preview?d.abort():R(b,p)}}}this.parse=function(r,n,i){if(e.newline||(e.newline=a(r)),c=!1,!e.delimiter){var o=s(r);o.successful?e.delimiter=o.bestDelimiter:(c=!0,e.delimiter=w.DefaultDelimiter),b.meta.delimiter=e.delimiter}var f=_(e);return e.preview&&e.header&&f.preview++,h=r,d=new u(f),b=d.parse(h,n,i),t(),v?{meta:{paused:!0}}:b||{meta:{paused:!1}}},this.paused=function(){return v},this.pause=function(){v=!0,d.abort(),h=h.substr(d.getCharIndex())},this.resume=function(){v=!1,p.streamer.parseChunk(h)},this.aborted=function(){return k},this.abort=function(){k=!0,d.abort(),b.meta.aborted=!0,m(e.complete)&&e.complete(b),h=""}}function u(e){e=e||{};var t=e.delimiter,r=e.newline,n=e.comments,i=e.step,s=e.preview,a=e.fastMode;if(("string"!=typeof t||w.BAD_DELIMITERS.indexOf(t)>-1)&&(t=","),n===t)throw"Comment character same as delimiter";n===!0?n="#":("string"!=typeof n||w.BAD_DELIMITERS.indexOf(n)>-1)&&(n=!1),"\n"!=r&&"\r"!=r&&"\r\n"!=r&&(r="\n");var o=0,u=!1;this.parse=function(e,f,h){function d(e){b.push(e),S=o}function c(t){return h?p():(t||(t=e.substr(o)),w.push(t),o=g,d(w),y&&_(),p())}function l(t){o=t,d(w),w=[],O=e.indexOf(r,o)}function p(e){return{data:b,errors:R,meta:{delimiter:t,linebreak:r,aborted:u,truncated:!!e,cursor:S+(f||0)}}}function _(){i(p()),b=[],R=[]}if("string"!=typeof e)throw"Input must be a string";var g=e.length,m=t.length,v=r.length,k=n.length,y="function"==typeof i;o=0;var b=[],R=[],w=[],S=0;if(!e)return p();if(a||a!==!1&&-1===e.indexOf('"')){for(var E=e.split(r),C=0;C<E.length;C++){var w=E[C];if(o+=w.length,C!==E.length-1)o+=r.length;else if(h)return p();if(!n||w.substr(0,k)!=n){if(y){if(b=[],d(w.split(t)),_(),u)return p()}else d(w.split(t));if(s&&C>=s)return b=b.slice(0,s),p(!0)}}return p()}for(var x=e.indexOf(t,o),O=e.indexOf(r,o);;)if('"'!=e[o])if(n&&0===w.length&&e.substr(o,k)===n){if(-1==O)return p();o=O+v,O=e.indexOf(r,o),x=e.indexOf(t,o)}else if(-1!==x&&(O>x||-1===O))w.push(e.substring(o,x)),o=x+m,x=e.indexOf(t,o);else{if(-1===O)break;if(w.push(e.substring(o,O)),l(O+v),y&&(_(),u))return p();if(s&&b.length>=s)return p(!0)}else{var I=o;for(o++;;){var I=e.indexOf('"',I+1);if(-1===I)return h||R.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:b.length,index:o}),c();if(I===g-1){var D=e.substring(o,I).replace(/""/g,'"');return c(D)}if('"'!=e[I+1]){if(e[I+1]==t){w.push(e.substring(o,I).replace(/""/g,'"')),o=I+1+m,x=e.indexOf(t,o),O=e.indexOf(r,o);break}if(e.substr(I+1,v)===r){if(w.push(e.substring(o,I).replace(/""/g,'"')),l(I+1+v),x=e.indexOf(t,o),y&&(_(),u))return p();if(s&&b.length>=s)return p(!0);break}}else I++}}return c()},this.abort=function(){u=!0},this.getCharIndex=function(){return o}}function f(){var e=document.getElementsByTagName("script");return e.length?e[e.length-1].src:""}function h(){if(!w.WORKERS_SUPPORTED)return!1;if(!y&&null===w.SCRIPT_PATH)throw new Error("Script path cannot be determined automatically when Papa Parse is loaded asynchronously. You need to set Papa.SCRIPT_PATH manually.");var t=new e.Worker(w.SCRIPT_PATH||v);return t.onmessage=d,t.id=R++,b[t.id]=t,t}function d(e){var t=e.data,r=b[t.workerId],n=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var i=function(){n=!0,c(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},s={abort:i,pause:l,resume:l};if(m(r.userStep)){for(var a=0;a<t.results.data.length&&(r.userStep({data:[t.results.data[a]],errors:t.results.errors,meta:t.results.meta},s),!n);a++);delete t.results}else m(r.userChunk)&&(r.userChunk(t.results,s,t.file),delete t.results)}t.finished&&!n&&c(t.workerId,t.results)}function c(e,t){var r=b[e];m(r.userComplete)&&r.userComplete(t),r.terminate(),delete b[e]}function l(){throw"Not implemented."}function p(t){var r=t.data;if("undefined"==typeof w.WORKER_ID&&r&&(w.WORKER_ID=r.workerId),"string"==typeof r.input)e.postMessage({workerId:w.WORKER_ID,results:w.parse(r.input,r.config),finished:!0});else if(e.File&&r.input instanceof File||r.input instanceof Object){var n=w.parse(r.input,r.config);n&&e.postMessage({workerId:w.WORKER_ID,results:n,finished:!0})}}function _(e){if("object"!=typeof e)return e;var t=e instanceof Array?[]:{};for(var r in e)t[r]=_(e[r]);return t}function g(e,t){return function(){e.apply(t,arguments)}}function m(e){return"function"==typeof e}var v,k=!e.document&&!!e.postMessage,y=!1,b={},R=0,w={};if(w.parse=t,w.unparse=r,w.RECORD_SEP=String.fromCharCode(30),w.UNIT_SEP=String.fromCharCode(31),w.BYTE_ORDER_MARK="﻿",w.BAD_DELIMITERS=["\r","\n",'"',w.BYTE_ORDER_MARK],w.WORKERS_SUPPORTED=!!e.Worker,w.SCRIPT_PATH=null,w.LocalChunkSize=10485760,w.RemoteChunkSize=5242880,w.DefaultDelimiter=",",w.Parser=u,w.ParserHandle=o,w.NetworkStreamer=i,w.FileStreamer=s,w.StringStreamer=a,"undefined"!=typeof module&&module.exports?module.exports=w:m(e.define)&&e.define.amd?e.define(function(){return w}):e.Papa=w,e.jQuery){var S=e.jQuery;S.fn.parse=function(t){function r(){if(0==a.length)return void(m(t.complete)&&t.complete());var e=a[0];if(m(t.before)){var r=t.before(e.file,e.inputElem);if("object"==typeof r){if("abort"==r.action)return void n("AbortError",e.file,e.inputElem,r.reason);if("skip"==r.action)return void i();"object"==typeof r.config&&(e.instanceConfig=S.extend(e.instanceConfig,r.config))}else if("skip"==r)return void i()}var s=e.instanceConfig.complete;e.instanceConfig.complete=function(t){m(s)&&s(t,e.file,e.inputElem),i()},w.parse(e.file,e.instanceConfig)}function n(e,r,n,i){m(t.error)&&t.error({name:e},r,n,i)}function i(){a.splice(0,1),r()}var s=t.config||{},a=[];return this.each(function(){var t="INPUT"==S(this).prop("tagName").toUpperCase()&&"file"==S(this).attr("type").toLowerCase()&&e.FileReader;if(!t||!this.files||0==this.files.length)return!0;for(var r=0;r<this.files.length;r++)a.push({file:this.files[r],inputElem:this,instanceConfig:S.extend({},s)})}),r(),this}}k?e.onmessage=p:w.WORKERS_SUPPORTED&&(v=f(),document.body?document.addEventListener("DOMContentLoaded",function(){y=!0},!0):y=!0),i.prototype=Object.create(n.prototype),i.prototype.constructor=i,s.prototype=Object.create(n.prototype),s.prototype.constructor=s,a.prototype=Object.create(a.prototype),a.prototype.constructor=a}("undefined"!=typeof window?window:this);require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],"superagent":[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? (this || self)
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(err || new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":1,"reduce":2}]},{},[]);
(function(global) {
  "use strict";

  var inNodeJS = false;
  if (typeof module !== 'undefined' && module.exports) {
    inNodeJS = true;
    var request = require('request');
  }

  var supportsCORS = false;
  var inLegacyIE = false;
  try {
    var testXHR = new XMLHttpRequest();
    if (typeof testXHR.withCredentials !== 'undefined') {
      supportsCORS = true;
    } else {
      if ("XDomainRequest" in window) {
        supportsCORS = true;
        inLegacyIE = true;
      }
    }
  } catch (e) { }

  // Create a simple indexOf function for support
  // of older browsers.  Uses native indexOf if 
  // available.  Code similar to underscores.
  // By making a separate function, instead of adding
  // to the prototype, we will not break bad for loops
  // in older browsers
  var indexOfProto = Array.prototype.indexOf;
  var ttIndexOf = function(array, item) {
    var i = 0, l = array.length;
    
    if (indexOfProto && array.indexOf === indexOfProto) return array.indexOf(item);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };
  
  /*
    Initialize with Tabletop.init( { key: '0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc' } )
      OR!
    Initialize with Tabletop.init( { key: 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc&output=html&widget=true' } )
      OR!
    Initialize with Tabletop.init('0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc')
  */

  var Tabletop = function(options) {
    // Make sure Tabletop is being used as a constructor no matter what.
    if(!this || !(this instanceof Tabletop)) {
      return new Tabletop(options);
    }
    
    if(typeof(options) === 'string') {
      options = { key : options };
    }

    this.callback = options.callback;
    this.wanted = options.wanted || [];
    this.key = options.key;
    this.simpleSheet = !!options.simpleSheet;
    this.parseNumbers = !!options.parseNumbers;
    this.wait = !!options.wait;
    this.reverse = !!options.reverse;
    this.postProcess = options.postProcess;
    this.debug = !!options.debug;
    this.query = options.query || '';
    this.orderby = options.orderby;
    this.endpoint = options.endpoint || "https://spreadsheets.google.com";
    this.singleton = !!options.singleton;
    this.simple_url = !!options.simple_url;
    this.callbackContext = options.callbackContext;
    this.prettyColumnNames = typeof(options.prettyColumnNames) == 'undefined' ? true : options.prettyColumnNames
    
    if(typeof(options.proxy) !== 'undefined') {
      // Remove trailing slash, it will break the app
      this.endpoint = options.proxy.replace(/\/$/,'');
      this.simple_url = true;
      this.singleton = true;
      // Let's only use CORS (straight JSON request) when
      // fetching straight from Google
      supportsCORS = false
    }
    
    this.parameterize = options.parameterize || false;
    
    if(this.singleton) {
      if(typeof(Tabletop.singleton) !== 'undefined') {
        this.log("WARNING! Tabletop singleton already defined");
      }
      Tabletop.singleton = this;
    }
    
    /* Be friendly about what you accept */
    if(/key=/.test(this.key)) {
      this.log("You passed an old Google Docs url as the key! Attempting to parse.");
      this.key = this.key.match("key=(.*?)(&|#|$)")[1];
    }

    if(/pubhtml/.test(this.key)) {
      this.log("You passed a new Google Spreadsheets url as the key! Attempting to parse.");
      this.key = this.key.match("d\\/(.*?)\\/pubhtml")[1];
    }

    if(!this.key) {
      this.log("You need to pass Tabletop a key!");
      return;
    }

    this.log("Initializing with key " + this.key);

    this.models = {};
    this.model_names = [];

    this.base_json_path = "/feeds/worksheets/" + this.key + "/public/basic?alt=";

    if (inNodeJS || supportsCORS) {
      this.base_json_path += 'json';
    } else {
      this.base_json_path += 'json-in-script';
    }
    
    if(!this.wait) {
      this.fetch();
    }
  };

  // A global storage for callbacks.
  Tabletop.callbacks = {};

  // Backwards compatibility.
  Tabletop.init = function(options) {
    return new Tabletop(options);
  };

  Tabletop.sheets = function() {
    this.log("Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)");
  };

  Tabletop.prototype = {

    fetch: function(callback) {
      if(typeof(callback) !== "undefined") {
        this.callback = callback;
      }
      this.requestData(this.base_json_path, this.loadSheets);
    },
    
    /*
      This will call the environment appropriate request method.
      
      In browser it will use JSON-P, in node it will use request()
    */
    requestData: function(path, callback) {
      if (inNodeJS) {
        this.serverSideFetch(path, callback);
      } else {
        //CORS only works in IE8/9 across the same protocol
        //You must have your server on HTTPS to talk to Google, or it'll fall back on injection
        var protocol = this.endpoint.split("//").shift() || "http";
        if (supportsCORS && (!inLegacyIE || protocol === location.protocol)) {
          this.xhrFetch(path, callback);
        } else {
          this.injectScript(path, callback);
        }
      }
    },

    /*
      Use Cross-Origin XMLHttpRequest to get the data in browsers that support it.
    */
    xhrFetch: function(path, callback) {
      //support IE8's separate cross-domain object
      var xhr = inLegacyIE ? new XDomainRequest() : new XMLHttpRequest();
      xhr.open("GET", this.endpoint + path);
      var self = this;
      xhr.onload = function() {
        try {
          var json = JSON.parse(xhr.responseText);
        } catch (e) {
          console.error(e);
        }
        callback.call(self, json);
      };
      xhr.send();
    },
    
    /*
      Insert the URL into the page as a script tag. Once it's loaded the spreadsheet data
      it triggers the callback. This helps you avoid cross-domain errors
      http://code.google.com/apis/gdata/samples/spreadsheet_sample.html

      Let's be plain-Jane and not use jQuery or anything.
    */
    injectScript: function(path, callback) {
      var script = document.createElement('script');
      var callbackName;
      
      if(this.singleton) {
        if(callback === this.loadSheets) {
          callbackName = 'Tabletop.singleton.loadSheets';
        } else if (callback === this.loadSheet) {
          callbackName = 'Tabletop.singleton.loadSheet';
        }
      } else {
        var self = this;
        callbackName = 'tt' + (+new Date()) + (Math.floor(Math.random()*100000));
        // Create a temp callback which will get removed once it has executed,
        // this allows multiple instances of Tabletop to coexist.
        Tabletop.callbacks[ callbackName ] = function () {
          var args = Array.prototype.slice.call( arguments, 0 );
          callback.apply(self, args);
          script.parentNode.removeChild(script);
          delete Tabletop.callbacks[callbackName];
        };
        callbackName = 'Tabletop.callbacks.' + callbackName;
      }
      
      var url = path + "&callback=" + callbackName;
      
      if(this.simple_url) {
        // We've gone down a rabbit hole of passing injectScript the path, so let's
        // just pull the sheet_id out of the path like the least efficient worker bees
        if(path.indexOf("/list/") !== -1) {
          script.src = this.endpoint + "/" + this.key + "-" + path.split("/")[4];
        } else {
          script.src = this.endpoint + "/" + this.key;
        }
      } else {
        script.src = this.endpoint + url;
      }
      
      if (this.parameterize) {
        script.src = this.parameterize + encodeURIComponent(script.src);
      }
      
      document.getElementsByTagName('script')[0].parentNode.appendChild(script);
    },
    
    /* 
      This will only run if tabletop is being run in node.js
    */
    serverSideFetch: function(path, callback) {
      var self = this
      request({url: this.endpoint + path, json: true}, function(err, resp, body) {
        if (err) {
          return console.error(err);
        }
        callback.call(self, body);
      });
    },

    /* 
      Is this a sheet you want to pull?
      If { wanted: ["Sheet1"] } has been specified, only Sheet1 is imported
      Pulls all sheets if none are specified
    */
    isWanted: function(sheetName) {
      if(this.wanted.length === 0) {
        return true;
      } else {
        return (ttIndexOf(this.wanted, sheetName) !== -1);
      }
    },
    
    /*
      What gets send to the callback
      if simpleSheet === true, then don't return an array of Tabletop.this.models,
      only return the first one's elements
    */
    data: function() {
      // If the instance is being queried before the data's been fetched
      // then return undefined.
      if(this.model_names.length === 0) {
        return undefined;
      }
      if(this.simpleSheet) {
        if(this.model_names.length > 1 && this.debug) {
          this.log("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong.");
        }
        return this.models[ this.model_names[0] ].all();
      } else {
        return this.models;
      }
    },

    /*
      Add another sheet to the wanted list
    */
    addWanted: function(sheet) {
      if(ttIndexOf(this.wanted, sheet) === -1) {
        this.wanted.push(sheet);
      }
    },
    
    /*
      Load all worksheets of the spreadsheet, turning each into a Tabletop Model.
      Need to use injectScript because the worksheet view that you're working from
      doesn't actually include the data. The list-based feed (/feeds/list/key..) does, though.
      Calls back to loadSheet in order to get the real work done.

      Used as a callback for the worksheet-based JSON
    */
    loadSheets: function(data) {
      var i, ilen;
      var toLoad = [];
      this.foundSheetNames = [];

      for(i = 0, ilen = data.feed.entry.length; i < ilen ; i++) {
        this.foundSheetNames.push(data.feed.entry[i].title.$t);
        // Only pull in desired sheets to reduce loading
        if( this.isWanted(data.feed.entry[i].content.$t) ) {
          var linkIdx = data.feed.entry[i].link.length-1;
          var sheet_id = data.feed.entry[i].link[linkIdx].href.split('/').pop();
          var json_path = "/feeds/list/" + this.key + "/" + sheet_id + "/public/values?alt="
          if (inNodeJS || supportsCORS) {
            json_path += 'json';
          } else {
            json_path += 'json-in-script';
          }
          if(this.query) {
            json_path += "&sq=" + this.query;
          }
          if(this.orderby) {
            json_path += "&orderby=column:" + this.orderby.toLowerCase();
          }
          if(this.reverse) {
            json_path += "&reverse=true";
          }
          toLoad.push(json_path);
        }
      }

      this.sheetsToLoad = toLoad.length;
      for(i = 0, ilen = toLoad.length; i < ilen; i++) {
        this.requestData(toLoad[i], this.loadSheet);
      }
    },

    /*
      Access layer for the this.models
      .sheets() gets you all of the sheets
      .sheets('Sheet1') gets you the sheet named Sheet1
    */
    sheets: function(sheetName) {
      if(typeof sheetName === "undefined") {
        return this.models;
      } else {
        if(typeof(this.models[ sheetName ]) === "undefined") {
          // alert( "Can't find " + sheetName );
          return;
        } else {
          return this.models[ sheetName ];
        }
      }
    },

    sheetReady: function(model) {
      this.models[ model.name ] = model;
      if(ttIndexOf(this.model_names, model.name) === -1) {
        this.model_names.push(model.name);
      }

      this.sheetsToLoad--;
      if(this.sheetsToLoad === 0)
        this.doCallback();
    },
    
    /*
      Parse a single list-based worksheet, turning it into a Tabletop Model

      Used as a callback for the list-based JSON
    */
    loadSheet: function(data) {
      var that = this;
      var model = new Tabletop.Model( { data: data, 
                                        parseNumbers: this.parseNumbers,
                                        postProcess: this.postProcess,
                                        tabletop: this,
                                        prettyColumnNames: this.prettyColumnNames,
                                        onReady: function() {
                                          that.sheetReady(this);
                                        } } );
    },

    /*
      Execute the callback upon loading! Rely on this.data() because you might
        only request certain pieces of data (i.e. simpleSheet mode)
      Tests this.sheetsToLoad just in case a race condition happens to show up
    */
    doCallback: function() {
      if(this.sheetsToLoad === 0) {
        this.callback.apply(this.callbackContext || this, [this.data(), this]);
      }
    },

    log: function(msg) {
      if(this.debug) {
        if(typeof console !== "undefined" && typeof console.log !== "undefined") {
          Function.prototype.apply.apply(console.log, [console, arguments]);
        }
      }
    }

  };

  /*
    Tabletop.Model stores the attribute names and parses the worksheet data
      to turn it into something worthwhile

    Options should be in the format { data: XXX }, with XXX being the list-based worksheet
  */
  Tabletop.Model = function(options) {
    var i, j, ilen, jlen;
    this.column_names = [];
    this.name = options.data.feed.title.$t;
    this.tabletop = options.tabletop;
    this.elements = [];
    this.onReady = options.onReady;
    this.raw = options.data; // A copy of the sheet's raw data, for accessing minutiae

    if(typeof(options.data.feed.entry) === 'undefined') {
      options.tabletop.log("Missing data for " + this.name + ", make sure you didn't forget column headers");
      this.elements = [];
      return;
    }
    
    for(var key in options.data.feed.entry[0]){
      if(/^gsx/.test(key))
        this.column_names.push( key.replace("gsx$","") );
    }

    this.original_columns = this.column_names;
    
    for(i = 0, ilen =  options.data.feed.entry.length ; i < ilen; i++) {
      var source = options.data.feed.entry[i];
      var element = {};
      for(var j = 0, jlen = this.column_names.length; j < jlen ; j++) {
        var cell = source[ "gsx$" + this.column_names[j] ];
        if (typeof(cell) !== 'undefined') {
          if(options.parseNumbers && cell.$t !== '' && !isNaN(cell.$t))
            element[ this.column_names[j] ] = +cell.$t;
          else
            element[ this.column_names[j] ] = cell.$t;
        } else {
            element[ this.column_names[j] ] = '';
        }
      }
      if(element.rowNumber === undefined)
        element.rowNumber = i + 1;
      if( options.postProcess )
        options.postProcess(element);
      this.elements.push(element);
    }
    
    if(options.prettyColumnNames)
      this.fetchPrettyColumns();
    else
      this.onReady.call(this);
  };

  Tabletop.Model.prototype = {
    /*
      Returns all of the elements (rows) of the worksheet as objects
    */
    all: function() {
      return this.elements;
    },
    
    fetchPrettyColumns: function() {
      if(!this.raw.feed.link[3])
        return this.ready();
      var cellurl = this.raw.feed.link[3].href.replace('/feeds/list/', '/feeds/cells/').replace('https://spreadsheets.google.com', '');
      var that = this;
      this.tabletop.requestData(cellurl, function(data) {
        that.loadPrettyColumns(data)
      });
    },
    
    ready: function() {
      this.onReady.call(this);
    },
    
    /*
     * Store column names as an object
     * with keys of Google-formatted "columnName"
     * and values of human-readable "Column name"
     */
    loadPrettyColumns: function(data) {
      var pretty_columns = {};

      var column_names = this.column_names;

      var i = 0;
      var l = column_names.length;

      for (; i < l; i++) {
        if (typeof data.feed.entry[i].content.$t !== 'undefined') {
          pretty_columns[column_names[i]] = data.feed.entry[i].content.$t;
        } else {
          pretty_columns[column_names[i]] = column_names[i];
        }
      }

      this.pretty_columns = pretty_columns;

      this.prettifyElements();
      this.ready();
    },
    
    /*
     * Go through each row, substitutiting
     * Google-formatted "columnName"
     * with human-readable "Column name"
     */
    prettifyElements: function() {
      var pretty_elements = [],
          ordered_pretty_names = [],
          i, j, ilen, jlen;

      var ordered_pretty_names;
      for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
        ordered_pretty_names.push(this.pretty_columns[this.column_names[j]]);
      }

      for(i = 0, ilen = this.elements.length; i < ilen; i++) {
        var new_element = {};
        for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
          var new_column_name = this.pretty_columns[this.column_names[j]];
          new_element[new_column_name] = this.elements[i][this.column_names[j]];
        }
        pretty_elements.push(new_element);
      }
      this.elements = pretty_elements;
      this.column_names = ordered_pretty_names;
    },

    /*
      Return the elements as an array of arrays, instead of an array of objects
    */
    toArray: function() {
      var array = [],
          i, j, ilen, jlen;
      for(i = 0, ilen = this.elements.length; i < ilen; i++) {
        var row = [];
        for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
          row.push( this.elements[i][ this.column_names[j] ] );
        }
        array.push(row);
      }
      return array;
    }
  };

  if(inNodeJS) {
    module.exports = Tabletop;
  } else {
    global.Tabletop = Tabletop;
  }

})(this);
(function() {
  var dms2decPTBR = function(lat,lon){
      // Examples:
      // 22°32'24.000000"S
      // 53°39'42.120000"O
      str = lat;
      str = str.split('°');
      graus= str[0];
      str = str[1].split("'");
      minutos = str[0];
      str = str[1].split('"');
      segundos = str[0];
      ref = str[1];
      lat=[parseInt(graus),parseInt(minutos),parseFloat(segundos)];
      str = lon;
      str = str.split('°');
      graus= str[0];
      str = str[1].split("'");
      minutos = str[0];
      str = str[1].split('"');
      segundos = str[0];
      reflon = str[1];

      lon=[parseInt(graus),parseInt(minutos),parseFloat(segundos)];

      return dms2dec(lat,ref,lon,reflon);
  }
  var dms2dec = function(lat, latRef, lon, lonRef) {
    var ref = {'N': 1, 'E': 1, 'S': -1, 'W': -1
               , 'L': 1, 'O': -1}; // pt-br locale
    var i;

    if (typeof lat === 'string') {
      lat = lat.split(',');
    }

    if (typeof lon === 'string') {
      lon = lon.split(',');
    }

    for (i = 0; i < lat.length; i++) {
      if (typeof lat[i] === 'string') {
        lat[i] = lat[i].replace(/^\s+|\s+$/g,'').split('/');
        lat[i] = parseInt(lat[i][0], 10) / parseInt(lat[i][1], 10);
      }
    }

    for (i = 0; i < lon.length; i++) {
      if (typeof lon[i] === 'string') {
        lon[i] = lon[i].replace(/^\s+|\s+$/g,'').split('/');
        lon[i] = parseInt(lon[i][0], 10) / parseInt(lon[i][1], 10);
      }
    }

    lat = (lat[0] + (lat[1] / 60) + (lat[2] / 3600)) * ref[latRef];
    lon = (lon[0] + (lon[1] / 60) + (lon[2] / 3600)) * ref[lonRef];

    return [lat, lon]
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = dms2decPTBR;
  else {
    window.dms2dec = dms2dec;
    window.dms2decPTBR = dms2decPTBR;
  }
})();

!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var Ajax, del, get, isRunningOnBrowser, post, request;

  isRunningOnBrowser = require('./utils').isRunningOnBrowser;

  request = require('superagent');

  if (!isRunningOnBrowser) {
    request = request.agent();
  }

  Ajax = (function() {
    function Ajax(options) {
      this.xhr = null;
      this.donecb = null;
      this.failcb = null;
      this.request = request;
      this.options = options;
    }

    Ajax.prototype.get = function(params) {
      this.xhr = this.request.get(params);
      if (isRunningOnBrowser) {
        this.xhr.withCredentials();
      }
      if (this.options && this.options.buffer) {
        this.xhr.buffer();
      }
      if (this.options && this.options.type) {
        this.xhr.type(this.options.type);
      }
      this.xhr.end((function(_this) {
        return function(err, res) {
          return _this.end(err, res);
        };
      })(this));
      return this;
    };

    Ajax.prototype.post = function(params) {
      if ("data" in params) {
        this.xhr = this.request.post(params['url']).send(params['data']);
      } else {
        this.xhr = this.request.post(params);
      }
      if (isRunningOnBrowser) {
        this.xhr.withCredentials();
      }
      this.xhr.end((function(_this) {
        return function(err, res) {
          return _this.end(err, res);
        };
      })(this));
      return this;
    };

    Ajax.prototype.end = function(err, res) {
      if (err) {
        return this.failcb(err);
      } else {
        return this.donecb(res);
      }
    };

    Ajax.prototype["delete"] = function(params) {
      this.xhr = this.request.del(params);
      if (isRunningOnBrowser) {
        this.xhr.withCredentials();
      }
      this.xhr.end((function(_this) {
        return function(err, res) {
          return _this.end(err, res);
        };
      })(this));
      return this;
    };

    Ajax.prototype.done = function(cb) {
      return this.donecb = cb;
    };

    Ajax.prototype.fail = function(cb) {
      return this.failcb = cb;
    };

    return Ajax;

  })();

  get = function(params, options) {
    return new Ajax(options).get(params);
  };

  post = function(params) {
    return new Ajax().post(params);
  };

  del = function(params) {
    return new Ajax()["delete"](params);
  };

  module.exports = {
    get: get,
    post: post,
    del: del,
    Ajax: Ajax
  };

}).call(this);

},{"./utils":13,"superagent":undefined}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var Config, ajax, events, utils;

  events = require('./events');

  utils = require('./utils');

  ajax = require('./ajax');

  Config = (function() {
    Config.debug = true;

    Config.EVENT_READY = 'config:ready.slsapi';

    Config.EVENT_FAIL = 'config:fail.slsapi';

    function Config(opcoes) {
      var self, xhr;
      this.id = utils.md5(JSON.stringify(opcoes)) + parseInt(1000 * Math.random());
      this.children = [];
      self = this;
      this.parseOpcoes(opcoes);
      if (opcoes.urlConfServico) {
        xhr = ajax.get(opcoes.urlConfServico);
        xhr.done(function(res) {
          self.parseOpcoes(res.body);
          return events.trigger(self.id, Config.EVENT_READY);
        });
        xhr.fail(function(err) {
          return events.trigger(self.id, Config.EVENT_FAIL, {
            err: err,
            message: 'Error: não foi possível carregar configuração da visualização'
          });
        });
      } else {
        setTimeout((function() {
          return events.trigger(self.id, Config.EVENT_READY);
        }), 5);
      }
    }

    Config.prototype.parseOpcoes = function(opcoes, view) {
      var child, j, len, ref, results;
      this.opcoes = new utils.Dicionario(opcoes);
      this.serverURL = this.opcoes.get('serverURL', this.serverURL || 'http://sl.wancharle.com.br');
      ref = this.children;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        child = ref[j];
        results.push(child.parseOpcoes(this.opcoes));
      }
      return results;
    };

    Config.prototype.register = function(configInstance) {
      if (configInstance.parseOpcoes) {
        configInstance.parseOpcoes(this.opcoes);
      }
      return this.children.push(configInstance);
    };

    Config.prototype.unregister = function(instance) {
      var i;
      i = this.children.indexOf(instance);
      return this.children.splice(i, 1);
    };

    Config.prototype.toJSON = function() {
      var child, j, json, len, ref;
      json = {
        'storageNotebook': this.coletorNotebookId,
        'serverURL': this.serverURL
      };
      ref = this.children;
      for (j = 0, len = ref.length; j < len; j++) {
        child = ref[j];
        json = utils.merge(json, child.toJSON());
      }
      return JSON.parse(JSON.stringify(json));
    };

    return Config;

  })();

  module.exports = {
    'Config': Config
  };

}).call(this);

},{"./ajax":1,"./events":7,"./utils":13}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var DataPool, DataSource, DataSourceCSV, DataSourceGoogle, createDataPool, createDataSource, events,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  events = require('./events');

  DataSource = require('./datasource').DataSource;

  DataSourceGoogle = require('./datasourceGoogle').DataSourceGoogle;

  DataSourceCSV = require('./datasourceCSV').DataSourceCSV;

  createDataSource = function(url, functionCode, i) {
    if (url.indexOf("docs.google.com/spreadsheet") > -1) {
      return new DataSourceGoogle(url, functionCode, i);
    } else {
      if (url.slice(-4) === ".csv") {
        return new DataSourceCSV(url, functionCode, i);
      } else {
        return new DataSource(url, functionCode, i);
      }
    }
  };

  createDataPool = function(mashup) {
    var instance;
    instance = DataPool.getInstance(mashup.config);
    if (instance) {
      instance.destroy();
    }
    instance = new DataPool();
    instance._constructor(mashup);
    return instance;
  };

  DataPool = (function() {
    function DataPool() {
      this.loadAllData = bind(this.loadAllData, this);
    }

    DataPool.EVENT_LOAD_START = 'datapool:start.slsapi';

    DataPool.EVENT_LOAD_STOP = 'datapool:stop.slsapi';

    DataPool.instances = {};

    DataPool.getInstance = function(config) {
      return this.instances[config.id];
    };

    DataPool.prototype.parseOpcoes = function(opcoes) {
      var index, j, len, ref, s;
      this.dataSourcesConf = opcoes.get('dataSources', this.dataSourcesConf || []);
      this.dataSources = [];
      ref = this.dataSourcesConf;
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        s = ref[index];
        this.addDataSource(s);
      }
      events.off(this.config.id, DataSource.EVENT_LOADED);
      return events.on(this.config.id, DataSource.EVENT_LOADED, (function(_this) {
        return function() {
          return _this.onDataSourceLoaded();
        };
      })(this));
    };

    DataPool.prototype.toJSON = function() {
      var ds;
      return {
        'dataSources': (function() {
          var j, len, ref, results;
          ref = this.dataSources;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            ds = ref[j];
            results.push(ds.toJSON());
          }
          return results;
        }).call(this)
      };
    };

    DataPool.prototype._constructor = function(mashup1) {
      this.mashup = mashup1;
      DataPool.instances[this.mashup.config.id] = this;
      this.config = this.mashup.config;
      return this.config.register(this);
    };

    DataPool.prototype.addDataSource = function(s) {
      var source;
      source = createDataSource(s.url, s.func_code, this.dataSources.length);
      if (source.isValid()) {
        return this.dataSources.push(source);
      }
    };

    DataPool.prototype.removeDataSource = function(i) {
      return this.dataSources.splice(i, 1);
    };

    DataPool.prototype.getDataSources = function() {
      return this.dataSources;
    };

    DataPool.prototype.updateDataSource = function(url, func_code, index) {
      return this.dataSources[index] = createDataSource(url, func_code, index);
    };

    DataPool.prototype.getDataSource = function(i) {
      return this.dataSources[i];
    };

    DataPool.prototype.loadOneData = function(fonteIndex, force, position) {
      if (force == null) {
        force = "";
      }
      this.loadingOneData = true;
      events.trigger(this.config.id, DataPool.EVENT_LOAD_START);
      return this.dataSources[fonteIndex].load(this.mashup, force, position);
    };

    DataPool.prototype.loadAllData = function(force, position) {
      var i, j, len, ref, results, source;
      if (force == null) {
        force = "";
      }
      this.sourcesLoaded = 0;
      events.trigger(this.config.id, DataPool.EVENT_LOAD_START);
      ref = this.dataSources;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        source = ref[i];
        results.push(source.load(this.mashup, force, position));
      }
      return results;
    };

    DataPool.prototype.onDataSourceLoaded = function() {
      if (this.loadingOneData) {
        this.loadingOneData = false;
        events.trigger(this.config.id, DataPool.EVENT_LOAD_STOP, this);
      } else {
        this.sourcesLoaded += 1;
        if (this.sourcesLoaded === this.dataSources.length) {
          return events.trigger(this.config.id, DataPool.EVENT_LOAD_STOP, this);
        }
      }
    };

    DataPool.prototype.destroy = function() {
      this.config.unregister(this);
      events.off(this.config.id, DataSource.EVENT_LOADED);
      events.off(this.config.id, DataPool.EVENT_LOAD_START);
      return events.off(this.config.id, DataPool.EVENT_LOAD_STOP);
    };

    return DataPool;

  })();

  module.exports = {
    DataPool: DataPool,
    createDataPool: createDataPool
  };

}).call(this);

},{"./datasource":4,"./datasourceCSV":5,"./datasourceGoogle":6,"./events":7}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var DataSource, ajax, contexto, events, utils,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  events = require('./events');

  ajax = require('./ajax');

  utils = require('./utils');

  contexto = {};

  contexto = utils;

  DataSource = (function() {
    DataSource.EVENT_LOADED = 'datasourceLoaded.slsapi';

    DataSource.EVENT_LOAD_FAIL = 'datasourceLoadFail.slsapi';

    DataSource.EVENT_REQUEST_FAIL = 'datasourceRequestFail.slsapi';

    DataSource.hashItem = function(item) {
      return "" + (parseFloat(item.latitude).toFixed(7)) + (parseFloat(item.longitude).toFixed(7)) + (utils.md5(JSON.stringify(item)));
    };

    DataSource.getNotesReadURLByPosition = function(mashup, position) {
      var url;
      url = (mashup.config.toJSON().notesReadURL) + "lista/?limit=100&lat=" + position.latitude + "&lng=" + position.longitude + "&distance=" + position.distance;
      console.log(url);
      return url;
    };

    function DataSource(url, func_code, i) {
      this.addItem = bind(this.addItem, this);
      this._getCatOrCreate = bind(this._getCatOrCreate, this);
      var e;
      this.index = i;
      this.valid = true;
      if (url && typeof func_code === 'function') {
        this.url = url;
        this.func_code = func_code;
      } else {
        if (typeof func_code === 'string') {
          try {
            this.func_code = utils.string2function(func_code);
            this.url = url;
          } catch (_error) {
            e = _error;
            console.error(e, 'Error ao tentar criar funcao de conversao apartir de texto');
            this.valid = false;
          }
        } else {
          console.error("Error de configuração de fonte:", {
            url: url,
            func_code: func_code
          });
          this.valid = false;
        }
      }
      this.resetData();
      this.cachedSource = {
        url: url,
        func_code: function(i) {
          return i;
        }
      };
    }

    DataSource.prototype.resetData = function() {
      this.notes = [];
      this.notesChildren = {};
      this.categories = {};
      return this.categories_id = {};
    };

    DataSource.prototype.toJSON = function() {
      return {
        'func_code': this.func_code.toString(),
        'url': this.url,
        'cachedURL': this.cachedUrl
      };
    };

    DataSource.prototype.isValid = function() {
      return this.valid;
    };

    DataSource.prototype._getCatOrCreate = function(i) {
      var cat;
      cat = this.categories[i.cat];
      if (cat) {
        return cat;
      } else {
        this.categories[i.cat] = [];
        this.categories_id[i.cat] = i.cat_id;
        return this.categories[i.cat];
      }
    };

    DataSource.prototype.addItem = function(i, func_convert) {
      var cat, e, geoItem;
      try {
        geoItem = func_convert(i, contexto);
      } catch (_error) {
        e = _error;
        console.error("Erro em DataSource::addItem: " + e.message, i);
        geoItem = null;
      }
      if (geoItem) {
        if (!geoItem.id) {
          geoItem.hashid = DataSource.hashItem(geoItem);
        } else {
          if (!geoItem.hashid) {
            geoItem.hashid = geoItem.id;
          }
          geoItem.id = void 0;
        }
        this.notes.push(geoItem);
        if (geoItem.id_parent) {
          this.addChild(geoItem.id_parent, geoItem);
        }
        cat = this._getCatOrCreate(geoItem);
        cat.push(geoItem);
      }
      return geoItem;
    };

    DataSource.prototype.addChild = function(parentId, child) {
      if (!this.notesChildren[parentId]) {
        this.notesChildren[parentId] = [];
      }
      return this.notesChildren[parentId].push(child);
    };

    DataSource.prototype.canLoadFromCache = function(mashup) {
      var can;
      can = mashup.useCache && this.url.indexOf(mashup.config.serverURL) === -1;
      return can;
    };

    DataSource.prototype.load = function(mashup, force, position) {
      if (force == null) {
        force = "";
      }
      this.resetData();
      if (this.canLoadFromCache(mashup)) {
        if (this.cachedURL) {
          return this.loadFromCache(mashup, position);
        } else {
          return this.getCachedURL(mashup, force, (function(_this) {
            return function() {
              return _this.loadFromCache(mashup, position);
            };
          })(this));
        }
      } else {
        return this.loadData(mashup, position);
      }
    };

    DataSource.prototype.loadData = function(mashup, position) {
      var url, xhr;
      if (position) {
        url = DataSource.getNotesReadURLByPosition(mashup, position);
      } else {
        url = this.url;
      }
      xhr = ajax.get(url, {
        type: 'json'
      });
      xhr.done((function(_this) {
        return function(res) {
          var json;
          json = res.body;
          if (res.type.toLowerCase().indexOf("text") > -1) {
            json = JSON.parse(res.text);
          }
          return _this.onDataLoaded(json, _this, mashup);
        };
      })(this));
      return xhr.fail(function(err) {
        return events.trigger(mashup.config.id, DataSource.EVENT_REQUEST_FAIL, err);
      });
    };

    DataSource.prototype.loadFromCache = function(mashup, position) {
      var url, xhr;
      if (position) {
        url = this.cachedURL + "&limit=100&lat=" + position.latitude + "&lng=" + position.longitude + "&distance=" + position.distance;
      } else {
        url = this.cachedURL + "&limit=1000 ";
      }
      xhr = ajax.get(url, {
        type: 'json'
      });
      xhr.done((function(_this) {
        return function(res) {
          var json;
          json = res.body;
          if (res.type.toLowerCase().indexOf("text") > -1) {
            json = JSON.parse(res.text);
          }
          return _this.onDataLoaded(json, _this.cachedSource, mashup);
        };
      })(this));
      return xhr.fail(function(err, res) {
        return events.trigger(mashup.config.id, DataSource.EVENT_REQUEST_FAIL, err);
      });
    };

    DataSource.prototype.getCachedURL = function(mashup, forceImport, cb) {
      var url, xhr;
      if (forceImport == null) {
        forceImport = "";
      }
      url = mashup.cacheURL + "?mashupid=" + mashup.id + "&fonteIndex=" + this.index + "&forceImport=" + forceImport;
      xhr = ajax.get(url, {
        type: 'json'
      });
      xhr.done((function(_this) {
        return function(res) {
          _this.cachedURL = res.body.cachedUrl;
          return cb();
        };
      })(this));
      return xhr.fail((function(_this) {
        return function(err) {
          if (err.status === 400) {
            return _this.loadData(mashup);
          } else {
            return console.log(err);
          }
        };
      })(this));
    };

    DataSource.prototype.onDataLoaded = function(data, fonte, mashup) {
      var d, e, i, j, len;
      try {
        for (i = j = 0, len = data.length; j < len; i = ++j) {
          d = data[i];
          this.addItem(d, fonte.func_code);
        }
        return events.trigger(mashup.config.id, DataSource.EVENT_LOADED);
      } catch (_error) {
        e = _error;
        console.error(e.toString());
        events.trigger(mashup.config.id, DataSource.EVENT_LOAD_FAIL);
      }
    };

    return DataSource;

  })();

  module.exports = {
    DataSource: DataSource
  };

}).call(this);

},{"./ajax":1,"./events":7,"./utils":13}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var DataSource, DataSourceCSV, ajax, csvParse, isRunningOnBrowser,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  DataSource = require('./datasource').DataSource;

  ajax = require('./ajax');

  isRunningOnBrowser = require('./utils').isRunningOnBrowser;

  if (!isRunningOnBrowser) {
    csvParse = require('babyparse');
    DataSourceCSV = (function(superClass) {
      extend(DataSourceCSV, superClass);

      function DataSourceCSV() {
        return DataSourceCSV.__super__.constructor.apply(this, arguments);
      }

      DataSourceCSV.prototype.loadData = function(config) {
        var xhr;
        xhr = ajax.get(this.url, {
          buffer: true
        });
        xhr.done((function(_this) {
          return function(res) {
            var json, parsed;
            parsed = csvParse.parse(res.text, {
              header: true
            });
            json = parsed.data;
            return _this.onDataLoaded(json, _this, config);
          };
        })(this));
        return xhr.fail(function(error) {
          return console.log('error ao baixar CSV', error);
        });
      };

      return DataSourceCSV;

    })(DataSource);
  } else {
    if (typeof Papa === 'undefined') {
      csvParse = null;
    } else {
      csvParse = Papa;
    }
    DataSourceCSV = (function(superClass) {
      extend(DataSourceCSV, superClass);

      function DataSourceCSV() {
        return DataSourceCSV.__super__.constructor.apply(this, arguments);
      }

      DataSourceCSV.prototype.loadData = function(config) {
        if (csvParse) {
          return csvParse.parse(this.url, {
            header: true,
            download: true,
            error: (function(_this) {
              return function() {
                return alert("Erro ao baixar arquivo csv da fonte de dados:\n" + _this.url);
              };
            })(this),
            complete: (function(_this) {
              return function(results, file) {
                return _this.onDataLoaded(results['data'], _this, config);
              };
            })(this)
          });
        } else {
          return console.error('error: CSV format not suported in core-version. Download the full version bundle');
        }
      };

      return DataSourceCSV;

    })(DataSource);
  }

  module.exports = {
    DataSourceCSV: DataSourceCSV
  };

}).call(this);

},{"./ajax":1,"./datasource":4,"./utils":13,"babyparse":undefined}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var DataSource, DataSourceGoogle, TABLETOP, isRunningOnBrowser,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isRunningOnBrowser = require('./utils').isRunningOnBrowser;

  if (!isRunningOnBrowser) {
    TABLETOP = require('tabletop');
  } else {
    TABLETOP = Tabletop;
  }

  DataSource = require('./datasource').DataSource;

  DataSourceGoogle = (function(superClass) {
    extend(DataSourceGoogle, superClass);

    function DataSourceGoogle() {
      return DataSourceGoogle.__super__.constructor.apply(this, arguments);
    }

    DataSourceGoogle.prototype.loadData = function(config) {
      return TABLETOP.init({
        'key': this.url,
        'callback': (function(_this) {
          return function(data, tabletop) {
            return _this.onDataLoaded(data, _this, config);
          };
        })(this),
        'simpleSheet': true
      });
    };

    return DataSourceGoogle;

  })(DataSource);

  module.exports = {
    DataSourceGoogle: DataSourceGoogle
  };

}).call(this);

},{"./datasource":4,"./utils":13,"tabletop":undefined}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var bind, emitter, emitters, events, isRunningOnBrowser, select, trigger, unbind;

  emitter = null;

  isRunningOnBrowser = require('./utils').isRunningOnBrowser;

  if (!isRunningOnBrowser) {
    events = require('events');
    emitters = {};
    select = function(id) {
      if (!(id in emitters)) {
        emitters[id] = new events.EventEmitter();
      }
      return emitters[id];
    };
    trigger = function(id, event, param) {
      return select(id).emit(event, param);
    };
    bind = function(id, event, cb) {
      var cb2;
      cb2 = function(caller, params) {
        return cb(caller, params);
      };
      return select(id).on(event, cb2);
    };
    unbind = function(id, event, cb) {
      if (cb) {
        return select(id).removeListener(event, cb);
      } else {
        return select(id).removeAllListeners(event);
      }
    };
  } else {
    select = function(id) {
      var target;
      target = $("#slEvent" + id);
      if (target.length <= 0) {
        target = $("<div id='slEvent" + id + "'> </div>");
        $("body").append(target);
      }
      return target;
    };
    trigger = function(id, event, param) {
      return select(id).trigger(event, param);
    };
    bind = function(id, event, cb) {
      var f;
      f = function(caller, params) {
        return cb(params);
      };
      return select(id).on(event, f);
    };
    unbind = function(id, event, cb) {
      return select(id).off(event);
    };
  }

  module.exports = {
    trigger: trigger,
    on: bind,
    off: unbind
  };

}).call(this);

},{"./utils":13,"events":undefined}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var Mashup, ajax;

  ajax = require('./ajax');

  Mashup = (function() {
    function Mashup(config) {
      this.config = config;
      this.config.register(this);
    }

    Mashup.prototype.parseOpcoes = function(opcoes) {
      this.opcoes = opcoes;
      this.createURL = this.opcoes.get('mashupCreateURL', this.createURL || (this.config.serverURL + "/mashup/create/"));
      this.readURL = this.opcoes.get('mashupReadURL', this.readURL || (this.config.serverURL + "/mashup/"));
      this.updateURL = this.opcoes.get('mashupUpdateURL', this.updateURL || (this.config.serverURL + "/mashup/update/"));
      this.cacheURL = this.opcoes.get('mashupCacheURL', this.cacheURL || (this.config.serverURL + "/mashup/getCachedURL"));
      this.title = this.opcoes.get('title', this.title || '');
      this.id = this.opcoes.get('id', this.id || '');
      if (this.id) {
        return this.useCache = true;
      } else {
        return this.useCache = false;
      }
    };

    Mashup.prototype.toJSON = function() {
      return {
        'mashupCreateURL': this.createURL,
        'mashupReadURL': this.readURL,
        'mashupUpdateURL': this.updateURL,
        'title': this.title,
        'id': this.id
      };
    };

    Mashup.prototype.get = function(title, user, success, fail) {
      var xhr;
      xhr = ajax.get(this.readURL + "?user=" + user + "&title=" + title);
      xhr.done(function(res) {
        if (res.body.length === 1 && res.body[0].id) {
          return success(res.body[0]);
        } else {
          return fail('mashup not found');
        }
      });
      return xhr.fail(fail);
    };

    Mashup.prototype.create = function(json, success, fail) {
      var xhr;
      xhr = ajax.post({
        url: this.createURL,
        data: json
      });
      xhr.done(function(res) {
        if (res.body.id) {
          return success(res.body);
        } else {
          return fail('mashup not created');
        }
      });
      return xhr.fail(fail);
    };

    Mashup.prototype.update = function(id, json, success, fail) {
      var xhr;
      xhr = ajax.post({
        url: "" + this.updateURL + id + "/",
        data: json
      });
      xhr.done(function(res) {
        if (res.body.id) {
          return success(res.body);
        } else {
          return fail('mashup not updated');
        }
      });
      return xhr.fail(fail);
    };

    Mashup.prototype["delete"] = function(id, success, fail) {
      var xhr;
      xhr = ajax.del("" + this.readURL + id + "/");
      xhr.done(function(res) {
        if (res.body.id) {
          return success(res.body);
        } else {
          return fail('mashup not deleted');
        }
      });
      return xhr.fail(fail);
    };

    Mashup.prototype.save = function(success, fail) {
      var json;
      json = this.config.toJSON();
      if (json.title && json.user) {
        return this.get(json.title, json.user, (function(_this) {
          return function(found) {
            return _this.update(found.id, json, success, fail);
          };
        })(this), (function(_this) {
          return function(err) {
            if (typeof err === 'string' && err === 'mashup not found') {
              return _this.create(json, success, fail);
            } else {
              return fail(err);
            }
          };
        })(this));
      } else {
        return fail("you need a title and logged user to save a mashup");
      }
    };

    return Mashup;

  })();

  module.exports = {
    'Mashup': Mashup
  };

}).call(this);

},{"./ajax":1}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var Notebook, ajax;

  ajax = require('./ajax');

  Notebook = (function() {
    Notebook.instances = {};

    Notebook.getInstance = function(config) {
      return this.instances[config.id];
    };

    Notebook.prototype.parseOpcoes = function(opcoes) {
      this.opcoes = opcoes;
      this.createURL = this.opcoes.get('notebookCreateURL', this.createURL || (this.config.serverURL + "/notebook/create/"));
      this.readURL = this.opcoes.get('notebookReadURL', this.readURL || (this.config.serverURL + "/notebook/"));
      return this.updateURL = this.opcoes.get('notebookUpdateURL', this.updateURL || (this.config.serverURL + "/notebook/update/"));
    };

    Notebook.prototype.toJSON = function() {
      return {
        notebookCreateURL: this.createURL,
        notebookReadURL: this.readURL
      };
    };

    function Notebook(config) {
      Notebook.instances[config.id] = this;
      this.config = config;
      this.config.register(this);
    }

    Notebook.prototype.get = function(callback, callbackFail) {
      var url, xhr;
      if (callbackFail == null) {
        callbackFail = null;
      }
      url = "" + this.readURL;
      xhr = ajax.get(url);
      xhr.done(function(res) {
        return callback(res.body);
      });
      return xhr.fail(function(err) {
        return callbackFail(err);
      });
    };

    Notebook.prototype.getByName = function(notebookName, callback, callbackFail) {
      var url, xhr;
      if (callbackFail == null) {
        callbackFail = null;
      }
      url = this.readURL + "?name=" + notebookName;
      xhr = ajax.get(url);
      xhr.done(function(res) {
        return callback(res.body);
      });
      return xhr.fail(function(err) {
        return callbackFail(err);
      });
    };

    Notebook.prototype.getById = function(notebookId, callback, callbackFail) {
      var url, xhr;
      if (callbackFail == null) {
        callbackFail = null;
      }
      url = this.readURL + "?id=" + notebookId;
      xhr = ajax.get(url);
      xhr.done(function(res) {
        return callback(res.body);
      });
      return xhr.fail(function(err) {
        return callbackFail(err);
      });
    };

    Notebook.prototype.create = function(nbname, success, fail) {
      var xhr;
      xhr = ajax.post({
        url: this.createURL,
        data: {
          name: nbname
        }
      });
      xhr.done(function(res) {
        if (res.body.id) {
          return success(res.body);
        } else {
          return fail('notebook not created');
        }
      });
      return xhr.fail(fail);
    };

    Notebook.prototype.update = function(id, json, success, fail) {
      var xhr;
      xhr = ajax.post({
        url: "" + this.updateURL + id + "/",
        data: json
      });
      xhr.done(function(res) {
        if (res.body.id) {
          return success(res.body);
        } else {
          return fail('notebook not updated');
        }
      });
      return xhr.fail(fail);
    };

    Notebook.prototype["delete"] = function(id, success, fail) {
      var xhr;
      xhr = ajax.del("" + this.readURL + id + "/");
      xhr.done(function(res) {
        if (res.body.id) {
          return success(res.body);
        } else {
          return fail('notebook not deleted');
        }
      });
      return xhr.fail(fail);
    };

    return Notebook;

  })();

  module.exports = {
    'Notebook': Notebook
  };

}).call(this);

},{"./ajax":1}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var Notes, ajax, events;

  ajax = require('./ajax');

  events = require('./events');

  Notes = (function() {
    Notes.EVENT_ADD_NOTE_START = 'note:uploadStart.slsapi';

    Notes.EVENT_ADD_NOTE_FINISH = 'note:uploadFinish.slsapi';

    Notes.EVENT_ADD_NOTE_FAIL = 'note:uploadFail.slsapi';

    Notes.EVENT_DEL_NOTE_FAIL = 'note:deleteFail.slsapi';

    Notes.EVENT_DEL_NOTE_SUCCESS = 'note:deleteSUCCESS.slsapi';

    Notes.instances = {};

    Notes.getInstance = function(config) {
      return this.instances[config.id];
    };

    function Notes(config1) {
      this.config = config1;
      Notes.instances[this.config.id] = this;
      this.config.register(this);
    }

    Notes.prototype.parseOpcoes = function(opcoes) {
      this.opcoes = opcoes;
      this.createURL = this.opcoes.get('notesCreateURL', this.createURL || (this.config.serverURL + "/note/create/"));
      this.readURL = this.opcoes.get('notesReadURL', this.readURL || (this.config.serverURL + "/note/"));
      this.updateURL = this.opcoes.get('notesUpdateURL', this.updateURL || (this.config.serverURL + "/note/update/"));
      return this.storageNotebook = this.opcoes.get('storageNotebook', '');
    };

    Notes.prototype.toJSON = function() {
      return {
        notesCreateURL: this.createURL,
        notesReadURL: this.readURL,
        notesUpdateURL: this.updateURL,
        storageNotebook: this.storageNotebook
      };
    };

    Notes.prototype.getByUser = function(user_id, callback, callback_fail) {
      var xhr;
      xhr = ajax.get(this.readURL + "?user=" + user_id);
      xhr.done(function(res) {
        return callback(res.body);
      });
      return xhr.fail(function(err) {
        return callback_fail(err);
      });
    };

    Notes.prototype.getByQuery = function(query, callback, callback_fail) {
      var xhr;
      xhr = ajax.get(this.readURL + "?" + query);
      xhr.done(function(res) {
        return callback(res.body);
      });
      return xhr.fail(function(err) {
        return callback_fail(err);
      });
    };

    Notes.prototype.update = function(note_id, queryparams, callback, callback_fail) {
      var xhr;
      xhr = ajax.post({
        url: "" + this.updateURL + note_id + "/",
        data: queryparams
      });
      xhr.done(function(res) {
        return callback(res.body);
      });
      return xhr.fail(function(err) {
        return callback_fail(err);
      });
    };

    Notes.prototype["delete"] = function(note_id, callback) {
      var url, xhr;
      url = "" + this.readURL + note_id;
      xhr = ajax.del(url);
      if (callback) {
        xhr.done(function(data) {
          return callback(data);
        });
      } else {
        xhr.done((function(_this) {
          return function(data) {
            return events.trigger(_this.config.id, Notes.EVENT_DEL_NOTE_SUCCESS, data);
          };
        })(this));
      }
      return xhr.fail((function(_this) {
        return function(err) {
          return events.trigger(_this.config.id, Notes.EVENT_DEL_NOTE_FAIL, err);
        };
      })(this));
    };

    Notes.prototype.enviar = function(note, notebookId, callback_ok, callback_fail) {
      var ft, options, params, xhr;
      if (notebookId == null) {
        notebookId = null;
      }
      if (callback_ok == null) {
        callback_ok = (function() {});
      }
      if (callback_fail == null) {
        callback_fail = (function() {});
      }
      if (!notebookId) {
        if (!this.storageNotebook) {
          console.error('NotebookId não foi informado!');
          return;
        } else {
          notebookId = this.storageNotebook.id;
        }
      }
      params = note;
      params.notebook = notebookId;
      events.trigger(this.config.id, Notes.EVENT_ADD_NOTE_START);
      if (note.fotoURI) {
        options = new FileUploadOptions();
        options.params = params;
        options.fileKey = "foto";
        options.fileName = note.fotoURI.substr(note.fotoURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params.fotoURL = true;
        ft = new FileTransfer();
        return ft.upload(note.fotoURI, encodeURI(this.createURL), (function(_this) {
          return function(r) {
            events.trigger(_this.config.id, Notes.EVENT_ADD_NOTE_FINISH);
            return callback_ok(r);
          };
        })(this), (function(_this) {
          return function(error) {
            events.trigger(_this.config.id, Notes.EVENT_ADD_NOTE_FAIL);
            return callback_fail(error);
          };
        })(this), options);
      } else {
        xhr = ajax.post({
          url: this.createURL,
          data: params
        });
        xhr.done((function(_this) {
          return function(res) {
            events.trigger(_this.config.id, Notes.EVENT_ADD_NOTE_FINISH, res.body);
            return callback_ok(res.body);
          };
        })(this));
        return xhr.fail((function(_this) {
          return function(error) {
            events.trigger(_this.config.id, Notes.EVENT_ADD_NOTE_FAIL, error);
            return callback_fail(error);
          };
        })(this));
      }
    };

    return Notes;

  })();

  module.exports = {
    'Notes': Notes
  };

}).call(this);

},{"./ajax":1,"./events":7}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.9.2
(function() {
  var Config, DataSource, Mashup, Notebook, SLSAPI, User, ajax, dataPool, events, isRunningOnBrowser, notes, utils;

  isRunningOnBrowser = require('./utils').isRunningOnBrowser;

  utils = require('./utils');

  events = require('./events');

  ajax = require('./ajax');

  notes = require('./notes');

  Notebook = require('./notebook').Notebook;

  User = require('./user').User;

  Config = require('./config').Config;

  Mashup = require('./mashup').Mashup;

  dataPool = require('./datapool');

  DataSource = require('./datasource').DataSource;

  SLSAPI = (function() {
    function SLSAPI(opts) {
      this.config = new Config(opts);
      this.user = new User(this.config);
      this.notes = new notes.Notes(this.config);
      this.notebook = new Notebook(this.config);
      this.mashup = new Mashup(this.config);
    }

    SLSAPI.prototype.trigger = function(event, params) {
      return events.trigger(this.config.id, event, params);
    };

    SLSAPI.prototype.on = function(event, params) {
      return events.on(this.config.id, event, params);
    };

    SLSAPI.prototype.off = function(event, params) {
      return events.off(this.config.id, event, params);
    };

    return SLSAPI;

  })();

  SLSAPI.Config = Config;

  SLSAPI.Notes = notes.Notes;

  SLSAPI.User = User;

  SLSAPI.dataPool = dataPool;

  SLSAPI.DataSource = DataSource;

  SLSAPI.ajax = ajax;

  SLSAPI.utils = utils;

  SLSAPI.events = events;

  if (isRunningOnBrowser) {
    window.SLSAPI = SLSAPI;
  }

  module.exports = SLSAPI;

}).call(this);

},{"./ajax":1,"./config":2,"./datapool":3,"./datasource":4,"./events":7,"./mashup":8,"./notebook":9,"./notes":10,"./user":12,"./utils":13}],12:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.9.2
(function() {
  var CLIENT_SIDE, LocalStorage, User, ajax, events, localStorage, md5,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (typeof process.browser === 'undefined') {
    md5 = require('blueimp-md5').md5;
    LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
    CLIENT_SIDE = false;
  } else {
    CLIENT_SIDE = true;
    localStorage = window.localStorage;
    md5 = window.md5;
  }

  events = require('./events');

  ajax = require('./ajax');

  User = (function() {
    User.EVENT_LOGIN_SUCCESS = 'userLoginSuccess.slsapi';

    User.EVENT_LOGIN_START = 'userLoginStart.slsapi';

    User.EVENT_LOGIN_FINISH = 'userLoginFinish.slsapi';

    User.EVENT_LOGIN_FAIL = 'userLoginFail.slsapi';

    User.EVENT_LOGOUT_SUCCESS = 'userLogoutSuccess.slsapi';

    User.EVENT_LOGOUT_FAIL = 'userLogoutFail.slsapi';

    User.instances = {};

    User.getInstance = function() {
      return this.instances[config.id];
    };

    function User(config1) {
      this.config = config1;
      this.login = bind(this.login, this);
      User.instances[this.config.id] = this;
      this.storage = localStorage;
      this.usuario = this.getUsuario();
      if (!this.isLogged()) {
        this.logout();
      }
      this.config.register(this);
    }

    User.prototype.parseOpcoes = function(opcoes) {
      this.opcoes = opcoes;
      this.loginURL = this.opcoes.get('loginURL', this.loginURL || (this.config.serverURL + "/user/login/"));
      return this.logoutURL = this.opcoes.get('logoutURL', this.logoutURL || (this.config.serverURL + "/user/logout/"));
    };

    User.prototype.toJSON = function() {
      return {
        loginURL: this.loginURL,
        logoutURL: this.logoutURL,
        user: this.user_id
      };
    };

    User.prototype.isLogged = function() {
      var tempo_logado, usuario;
      usuario = this.getUsuario();
      if (usuario) {
        tempo_logado = ((new Date()).getTime() - this.logginTime) / 1000;
        if (tempo_logado > 24 * 3600) {
          return false;
        }
        return true;
      } else {
        return false;
      }
    };

    User.prototype.getUsuario = function() {
      this.usuario = this.storage.getItem('Usuario');
      this.user_id = this.storage.getItem('user_id');
      this.logginTime = this.storage.getItem('logginTime');
      return this.usuario;
    };

    User.prototype.setUsuario = function(usuario, json) {
      this.user_id = json.id;
      this.usuario = usuario;
      this.storage.setItem('Usuario', this.usuario);
      this.storage.setItem('user_id', this.user_id);
      return this.storage.setItem('logginTime', (new Date()).getTime());
    };

    User.prototype.logout = function() {
      var xhr;
      this.storage.removeItem('Usuario');
      this.usuario = null;
      this.user_id = null;
      xhr = ajax.get(this.logoutURL);
      xhr.done((function(_this) {
        return function(req) {
          return events.trigger(_this.config.id, User.EVENT_LOGOUT_SUCCESS, req);
        };
      })(this));
      return xhr.fail((function(_this) {
        return function(req) {
          return events.trigger(_this.config.id, User.EVENT_LOGOUT_FAIL, req);
        };
      })(this));
    };

    User.prototype.login = function(u, p) {
      var url, xhr;
      if (u && p) {
        url = this.loginURL;
        events.trigger(this.config.id, User.EVENT_LOGIN_START);
        xhr = ajax.post({
          url: url,
          dataType: 'json',
          data: {
            username: u,
            password: p
          }
        });
        xhr.done((function(_this) {
          return function(res) {
            var json;
            json = res.body;
            if (json.error) {
              alert(json.error);
            } else {
              _this.setUsuario(u, json);
              events.trigger(_this.config.id, User.EVENT_LOGIN_SUCCESS, json);
            }
            return events.trigger(_this.config.id, User.EVENT_LOGIN_FINISH, json);
          };
        })(this));
        xhr.fail((function(_this) {
          return function(err) {
            return events.trigger(_this.config.id, User.EVENT_LOGIN_FAIL, err);
          };
        })(this));
      }
      return false;
    };

    return User;

  })();

  module.exports = {
    'User': User
  };

}).call(this);

}).call(this,require("/home/wancharle/searchlight-service-api/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"./ajax":1,"./events":7,"/home/wancharle/searchlight-service-api/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":14,"blueimp-md5":undefined,"node-localstorage":undefined}],13:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.9.2
(function() {
  var CLIENT_SIDE, Dicionario, dms2decPTBR, extend, getURLParameter, md5, merge, parseFloatPTBR, string2function,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof process.browser === 'undefined') {
    md5 = require('blueimp-md5').md5;
    extend = require('node.extend');
    CLIENT_SIDE = false;
    dms2decPTBR = require('dms2dec-ptbr');
  } else {
    CLIENT_SIDE = true;
    md5 = window.md5;
    dms2decPTBR = window.dms2decPTBR;
  }

  Dicionario = (function() {
    function Dicionario(js_hash) {
      this.get = bind(this.get, this);
      if (typeof js_hash === 'string') {
        js_hash = JSON.parse(js_hash);
      }
      this.keys = Object.keys(js_hash);
      this.data = js_hash;
    }

    Dicionario.prototype.get = function(key, value) {
      if (indexOf.call(this.keys, key) >= 0) {
        return this.data[key];
      } else {
        return value;
      }
    };

    return Dicionario;

  })();

  getURLParameter = function(name) {
    return $(document).getUrlParam(name);
  };

  string2function = function(func_code) {
    var m, nome, re;
    re = /.*function *(\w*) *\( *([\w\,]*) *\) *\{/mg;
    if ((m = re.exec(func_code)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }
      nome = m[1] || 'slsAnonymousFunction';
      if (CLIENT_SIDE) {
        return eval("window['" + nome + "']=" + func_code);
      } else {
        return eval("exports['" + nome + "']=" + func_code);
      }
    } else {
      return null;
    }
  };

  parseFloatPTBR = function(str) {
    var itens;
    itens = String(str).match(/^(-*\d+)([\,\.]*)(\d+)?$/);
    if (itens[2]) {
      return parseFloat(itens[1] + "." + itens[3]);
    } else {
      return parseFloat(itens[1]);
    }
  };

  merge = function(target, source, deep) {
    if (deep == null) {
      deep = true;
    }
    if (CLIENT_SIDE) {
      if (deep) {
        return $.extend(true, target, source);
      } else {
        return $.extend(target, source);
      }
    } else {
      return extend(deep, target, source);
    }
  };

  if (CLIENT_SIDE) {
    window.parseFloatPTBR = parseFloatPTBR;
    window.string2function = string2function;
    window.getURLParameter = getURLParameter;
  }

  module.exports = {
    Dicionario: Dicionario,
    parseFloatPTBR: parseFloatPTBR,
    string2function: string2function,
    getURLParameter: getURLParameter,
    md5: md5,
    dms2decPTBR: dms2decPTBR,
    isRunningOnBrowser: CLIENT_SIDE,
    merge: merge
  };

}).call(this);

}).call(this,require("/home/wancharle/searchlight-service-api/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/home/wancharle/searchlight-service-api/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":14,"blueimp-md5":undefined,"dms2dec-ptbr":undefined,"node.extend":undefined}],14:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[11]);
