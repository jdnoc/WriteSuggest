(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/localforage/dist/localforage.js
  var require_localforage = __commonJS({
    "node_modules/localforage/dist/localforage.js"(exports, module) {
      (function(f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
          module.exports = f();
        } else if (typeof define === "function" && define.amd) {
          define([], f);
        } else {
          var g;
          if (typeof window !== "undefined") {
            g = window;
          } else if (typeof global !== "undefined") {
            g = global;
          } else if (typeof self !== "undefined") {
            g = self;
          } else {
            g = this;
          }
          g.localforage = f();
        }
      })(function() {
        var define2, module2, exports2;
        return function e(t, n, r) {
          function s(o2, u) {
            if (!n[o2]) {
              if (!t[o2]) {
                var a = typeof __require == "function" && __require;
                if (!u && a)
                  return a(o2, true);
                if (i)
                  return i(o2, true);
                var f = new Error("Cannot find module '" + o2 + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
              }
              var l = n[o2] = { exports: {} };
              t[o2][0].call(l.exports, function(e2) {
                var n2 = t[o2][1][e2];
                return s(n2 ? n2 : e2);
              }, l, l.exports, e, t, n, r);
            }
            return n[o2].exports;
          }
          var i = typeof __require == "function" && __require;
          for (var o = 0; o < r.length; o++)
            s(r[o]);
          return s;
        }({ 1: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            var Mutation = global2.MutationObserver || global2.WebKitMutationObserver;
            var scheduleDrain;
            {
              if (Mutation) {
                var called = 0;
                var observer = new Mutation(nextTick);
                var element = global2.document.createTextNode("");
                observer.observe(element, {
                  characterData: true
                });
                scheduleDrain = function() {
                  element.data = called = ++called % 2;
                };
              } else if (!global2.setImmediate && typeof global2.MessageChannel !== "undefined") {
                var channel = new global2.MessageChannel();
                channel.port1.onmessage = nextTick;
                scheduleDrain = function() {
                  channel.port2.postMessage(0);
                };
              } else if ("document" in global2 && "onreadystatechange" in global2.document.createElement("script")) {
                scheduleDrain = function() {
                  var scriptEl = global2.document.createElement("script");
                  scriptEl.onreadystatechange = function() {
                    nextTick();
                    scriptEl.onreadystatechange = null;
                    scriptEl.parentNode.removeChild(scriptEl);
                    scriptEl = null;
                  };
                  global2.document.documentElement.appendChild(scriptEl);
                };
              } else {
                scheduleDrain = function() {
                  setTimeout(nextTick, 0);
                };
              }
            }
            var draining;
            var queue = [];
            function nextTick() {
              draining = true;
              var i, oldQueue;
              var len = queue.length;
              while (len) {
                oldQueue = queue;
                queue = [];
                i = -1;
                while (++i < len) {
                  oldQueue[i]();
                }
                len = queue.length;
              }
              draining = false;
            }
            module3.exports = immediate;
            function immediate(task) {
              if (queue.push(task) === 1 && !draining) {
                scheduleDrain();
              }
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {}], 2: [function(_dereq_, module3, exports3) {
          "use strict";
          var immediate = _dereq_(1);
          function INTERNAL() {
          }
          var handlers = {};
          var REJECTED = ["REJECTED"];
          var FULFILLED = ["FULFILLED"];
          var PENDING = ["PENDING"];
          module3.exports = Promise2;
          function Promise2(resolver) {
            if (typeof resolver !== "function") {
              throw new TypeError("resolver must be a function");
            }
            this.state = PENDING;
            this.queue = [];
            this.outcome = void 0;
            if (resolver !== INTERNAL) {
              safelyResolveThenable(this, resolver);
            }
          }
          Promise2.prototype["catch"] = function(onRejected) {
            return this.then(null, onRejected);
          };
          Promise2.prototype.then = function(onFulfilled, onRejected) {
            if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
              return this;
            }
            var promise = new this.constructor(INTERNAL);
            if (this.state !== PENDING) {
              var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
              unwrap(promise, resolver, this.outcome);
            } else {
              this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
            }
            return promise;
          };
          function QueueItem(promise, onFulfilled, onRejected) {
            this.promise = promise;
            if (typeof onFulfilled === "function") {
              this.onFulfilled = onFulfilled;
              this.callFulfilled = this.otherCallFulfilled;
            }
            if (typeof onRejected === "function") {
              this.onRejected = onRejected;
              this.callRejected = this.otherCallRejected;
            }
          }
          QueueItem.prototype.callFulfilled = function(value) {
            handlers.resolve(this.promise, value);
          };
          QueueItem.prototype.otherCallFulfilled = function(value) {
            unwrap(this.promise, this.onFulfilled, value);
          };
          QueueItem.prototype.callRejected = function(value) {
            handlers.reject(this.promise, value);
          };
          QueueItem.prototype.otherCallRejected = function(value) {
            unwrap(this.promise, this.onRejected, value);
          };
          function unwrap(promise, func, value) {
            immediate(function() {
              var returnValue;
              try {
                returnValue = func(value);
              } catch (e) {
                return handlers.reject(promise, e);
              }
              if (returnValue === promise) {
                handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
              } else {
                handlers.resolve(promise, returnValue);
              }
            });
          }
          handlers.resolve = function(self2, value) {
            var result = tryCatch(getThen, value);
            if (result.status === "error") {
              return handlers.reject(self2, result.value);
            }
            var thenable = result.value;
            if (thenable) {
              safelyResolveThenable(self2, thenable);
            } else {
              self2.state = FULFILLED;
              self2.outcome = value;
              var i = -1;
              var len = self2.queue.length;
              while (++i < len) {
                self2.queue[i].callFulfilled(value);
              }
            }
            return self2;
          };
          handlers.reject = function(self2, error) {
            self2.state = REJECTED;
            self2.outcome = error;
            var i = -1;
            var len = self2.queue.length;
            while (++i < len) {
              self2.queue[i].callRejected(error);
            }
            return self2;
          };
          function getThen(obj) {
            var then = obj && obj.then;
            if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
              return function appyThen() {
                then.apply(obj, arguments);
              };
            }
          }
          function safelyResolveThenable(self2, thenable) {
            var called = false;
            function onError2(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.reject(self2, value);
            }
            function onSuccess(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.resolve(self2, value);
            }
            function tryToUnwrap() {
              thenable(onSuccess, onError2);
            }
            var result = tryCatch(tryToUnwrap);
            if (result.status === "error") {
              onError2(result.value);
            }
          }
          function tryCatch(func, value) {
            var out = {};
            try {
              out.value = func(value);
              out.status = "success";
            } catch (e) {
              out.status = "error";
              out.value = e;
            }
            return out;
          }
          Promise2.resolve = resolve;
          function resolve(value) {
            if (value instanceof this) {
              return value;
            }
            return handlers.resolve(new this(INTERNAL), value);
          }
          Promise2.reject = reject;
          function reject(reason) {
            var promise = new this(INTERNAL);
            return handlers.reject(promise, reason);
          }
          Promise2.all = all;
          function all(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var values = new Array(len);
            var resolved = 0;
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              allResolver(iterable[i], i);
            }
            return promise;
            function allResolver(value, i2) {
              self2.resolve(value).then(resolveFromAll, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
              function resolveFromAll(outValue) {
                values[i2] = outValue;
                if (++resolved === len && !called) {
                  called = true;
                  handlers.resolve(promise, values);
                }
              }
            }
          }
          Promise2.race = race;
          function race(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              resolver(iterable[i]);
            }
            return promise;
            function resolver(value) {
              self2.resolve(value).then(function(response) {
                if (!called) {
                  called = true;
                  handlers.resolve(promise, response);
                }
              }, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
            }
          }
        }, { "1": 1 }], 3: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            if (typeof global2.Promise !== "function") {
              global2.Promise = _dereq_(2);
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, { "2": 2 }], 4: [function(_dereq_, module3, exports3) {
          "use strict";
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function getIDB() {
            try {
              if (typeof indexedDB !== "undefined") {
                return indexedDB;
              }
              if (typeof webkitIndexedDB !== "undefined") {
                return webkitIndexedDB;
              }
              if (typeof mozIndexedDB !== "undefined") {
                return mozIndexedDB;
              }
              if (typeof OIndexedDB !== "undefined") {
                return OIndexedDB;
              }
              if (typeof msIndexedDB !== "undefined") {
                return msIndexedDB;
              }
            } catch (e) {
              return;
            }
          }
          var idb = getIDB();
          function isIndexedDBValid() {
            try {
              if (!idb || !idb.open) {
                return false;
              }
              var isSafari = typeof openDatabase !== "undefined" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
              var hasFetch = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
              return (!isSafari || hasFetch) && typeof indexedDB !== "undefined" && typeof IDBKeyRange !== "undefined";
            } catch (e) {
              return false;
            }
          }
          function createBlob(parts, properties) {
            parts = parts || [];
            properties = properties || {};
            try {
              return new Blob(parts, properties);
            } catch (e) {
              if (e.name !== "TypeError") {
                throw e;
              }
              var Builder = typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder;
              var builder = new Builder();
              for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
              }
              return builder.getBlob(properties.type);
            }
          }
          if (typeof Promise === "undefined") {
            _dereq_(3);
          }
          var Promise$1 = Promise;
          function executeCallback(promise, callback) {
            if (callback) {
              promise.then(function(result) {
                callback(null, result);
              }, function(error) {
                callback(error);
              });
            }
          }
          function executeTwoCallbacks(promise, callback, errorCallback) {
            if (typeof callback === "function") {
              promise.then(callback);
            }
            if (typeof errorCallback === "function") {
              promise["catch"](errorCallback);
            }
          }
          function normalizeKey(key2) {
            if (typeof key2 !== "string") {
              console.warn(key2 + " used as a key, but it is not a string.");
              key2 = String(key2);
            }
            return key2;
          }
          function getCallback() {
            if (arguments.length && typeof arguments[arguments.length - 1] === "function") {
              return arguments[arguments.length - 1];
            }
          }
          var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support";
          var supportsBlobs = void 0;
          var dbContexts = {};
          var toString = Object.prototype.toString;
          var READ_ONLY = "readonly";
          var READ_WRITE = "readwrite";
          function _binStringToArrayBuffer(bin) {
            var length2 = bin.length;
            var buf = new ArrayBuffer(length2);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < length2; i++) {
              arr[i] = bin.charCodeAt(i);
            }
            return buf;
          }
          function _checkBlobSupportWithoutCaching(idb2) {
            return new Promise$1(function(resolve) {
              var txn = idb2.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
              var blob = createBlob([""]);
              txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key");
              txn.onabort = function(e) {
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
              };
              txn.oncomplete = function() {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
              };
            })["catch"](function() {
              return false;
            });
          }
          function _checkBlobSupport(idb2) {
            if (typeof supportsBlobs === "boolean") {
              return Promise$1.resolve(supportsBlobs);
            }
            return _checkBlobSupportWithoutCaching(idb2).then(function(value) {
              supportsBlobs = value;
              return supportsBlobs;
            });
          }
          function _deferReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = {};
            deferredOperation.promise = new Promise$1(function(resolve, reject) {
              deferredOperation.resolve = resolve;
              deferredOperation.reject = reject;
            });
            dbContext.deferredOperations.push(deferredOperation);
            if (!dbContext.dbReady) {
              dbContext.dbReady = deferredOperation.promise;
            } else {
              dbContext.dbReady = dbContext.dbReady.then(function() {
                return deferredOperation.promise;
              });
            }
          }
          function _advanceReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.resolve();
              return deferredOperation.promise;
            }
          }
          function _rejectReadiness(dbInfo, err) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.reject(err);
              return deferredOperation.promise;
            }
          }
          function _getConnection(dbInfo, upgradeNeeded) {
            return new Promise$1(function(resolve, reject) {
              dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
              if (dbInfo.db) {
                if (upgradeNeeded) {
                  _deferReadiness(dbInfo);
                  dbInfo.db.close();
                } else {
                  return resolve(dbInfo.db);
                }
              }
              var dbArgs = [dbInfo.name];
              if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
              }
              var openreq = idb.open.apply(idb, dbArgs);
              if (upgradeNeeded) {
                openreq.onupgradeneeded = function(e) {
                  var db = openreq.result;
                  try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                      db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                  } catch (ex) {
                    if (ex.name === "ConstraintError") {
                      console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e.oldVersion + " to version " + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                      throw ex;
                    }
                  }
                };
              }
              openreq.onerror = function(e) {
                e.preventDefault();
                reject(openreq.error);
              };
              openreq.onsuccess = function() {
                var db = openreq.result;
                db.onversionchange = function(e) {
                  e.target.close();
                };
                resolve(db);
                _advanceReadiness(dbInfo);
              };
            });
          }
          function _getOriginalConnection(dbInfo) {
            return _getConnection(dbInfo, false);
          }
          function _getUpgradedConnection(dbInfo) {
            return _getConnection(dbInfo, true);
          }
          function _isUpgradeNeeded(dbInfo, defaultVersion) {
            if (!dbInfo.db) {
              return true;
            }
            var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
            var isDowngrade = dbInfo.version < dbInfo.db.version;
            var isUpgrade = dbInfo.version > dbInfo.db.version;
            if (isDowngrade) {
              if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + `" can't be downgraded from version ` + dbInfo.db.version + " to version " + dbInfo.version + ".");
              }
              dbInfo.version = dbInfo.db.version;
            }
            if (isUpgrade || isNewStore) {
              if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                  dbInfo.version = incVersion;
                }
              }
              return true;
            }
            return false;
          }
          function _encodeBlob(blob) {
            return new Promise$1(function(resolve, reject) {
              var reader = new FileReader();
              reader.onerror = reject;
              reader.onloadend = function(e) {
                var base64 = btoa(e.target.result || "");
                resolve({
                  __local_forage_encoded_blob: true,
                  data: base64,
                  type: blob.type
                });
              };
              reader.readAsBinaryString(blob);
            });
          }
          function _decodeBlob(encodedBlob) {
            var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
            return createBlob([arrayBuff], { type: encodedBlob.type });
          }
          function _isEncodedBlob(value) {
            return value && value.__local_forage_encoded_blob;
          }
          function _fullyReady(callback) {
            var self2 = this;
            var promise = self2._initReady().then(function() {
              var dbContext = dbContexts[self2._dbInfo.name];
              if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
              }
            });
            executeTwoCallbacks(promise, callback, callback);
            return promise;
          }
          function _tryReconnect(dbInfo) {
            _deferReadiness(dbInfo);
            var dbContext = dbContexts[dbInfo.name];
            var forages = dbContext.forages;
            for (var i = 0; i < forages.length; i++) {
              var forage = forages[i];
              if (forage._dbInfo.db) {
                forage._dbInfo.db.close();
                forage._dbInfo.db = null;
              }
            }
            dbInfo.db = null;
            return _getOriginalConnection(dbInfo).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              for (var i2 = 0; i2 < forages.length; i2++) {
                forages[i2]._dbInfo.db = db;
              }
            })["catch"](function(err) {
              _rejectReadiness(dbInfo, err);
              throw err;
            });
          }
          function createTransaction(dbInfo, mode, callback, retries) {
            if (retries === void 0) {
              retries = 1;
            }
            try {
              var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
              callback(null, tx);
            } catch (err) {
              if (retries > 0 && (!dbInfo.db || err.name === "InvalidStateError" || err.name === "NotFoundError")) {
                return Promise$1.resolve().then(function() {
                  if (!dbInfo.db || err.name === "NotFoundError" && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    if (dbInfo.db) {
                      dbInfo.version = dbInfo.db.version + 1;
                    }
                    return _getUpgradedConnection(dbInfo);
                  }
                }).then(function() {
                  return _tryReconnect(dbInfo).then(function() {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                  });
                })["catch"](callback);
              }
              callback(err);
            }
          }
          function createDbContext() {
            return {
              forages: [],
              db: null,
              dbReady: null,
              deferredOperations: []
            };
          }
          function _initStorage(options2) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options2) {
              for (var i in options2) {
                dbInfo[i] = options2[i];
              }
            }
            var dbContext = dbContexts[dbInfo.name];
            if (!dbContext) {
              dbContext = createDbContext();
              dbContexts[dbInfo.name] = dbContext;
            }
            dbContext.forages.push(self2);
            if (!self2._initReady) {
              self2._initReady = self2.ready;
              self2.ready = _fullyReady;
            }
            var initPromises = [];
            function ignoreErrors() {
              return Promise$1.resolve();
            }
            for (var j = 0; j < dbContext.forages.length; j++) {
              var forage = dbContext.forages[j];
              if (forage !== self2) {
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
              }
            }
            var forages = dbContext.forages.slice(0);
            return Promise$1.all(initPromises).then(function() {
              dbInfo.db = dbContext.db;
              return _getOriginalConnection(dbInfo);
            }).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo, self2._defaultConfig.version)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              self2._dbInfo = dbInfo;
              for (var k = 0; k < forages.length; k++) {
                var forage2 = forages[k];
                if (forage2 !== self2) {
                  forage2._dbInfo.db = dbInfo.db;
                  forage2._dbInfo.version = dbInfo.version;
                }
              }
            });
          }
          function getItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.get(key2);
                    req.onsuccess = function() {
                      var value = req.result;
                      if (value === void 0) {
                        value = null;
                      }
                      if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                      }
                      resolve(value);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (cursor) {
                        var value = cursor.value;
                        if (_isEncodedBlob(value)) {
                          value = _decodeBlob(value);
                        }
                        var result = iterator(value, cursor.key, iterationNumber++);
                        if (result !== void 0) {
                          resolve(result);
                        } else {
                          cursor["continue"]();
                        }
                      } else {
                        resolve();
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              var dbInfo;
              self2.ready().then(function() {
                dbInfo = self2._dbInfo;
                if (toString.call(value) === "[object Blob]") {
                  return _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                    if (blobSupport) {
                      return value;
                    }
                    return _encodeBlob(value);
                  });
                }
                return value;
              }).then(function(value2) {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    if (value2 === null) {
                      value2 = void 0;
                    }
                    var req = store.put(value2, key2);
                    transaction.oncomplete = function() {
                      if (value2 === void 0) {
                        value2 = null;
                      }
                      resolve(value2);
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store["delete"](key2);
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onerror = function() {
                      reject(req.error);
                    };
                    transaction.onabort = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.clear();
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.count();
                    req.onsuccess = function() {
                      resolve(req.result);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              if (n < 0) {
                resolve(null);
                return;
              }
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openKeyCursor();
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(null);
                        return;
                      }
                      if (n === 0) {
                        resolve(cursor.key);
                      } else {
                        if (!advanced) {
                          advanced = true;
                          cursor.advance(n);
                        } else {
                          resolve(cursor.key);
                        }
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openKeyCursor();
                    var keys2 = [];
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(keys2);
                        return;
                      }
                      keys2.push(cursor.key);
                      cursor["continue"]();
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance(options2, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options2 = typeof options2 !== "function" && options2 || {};
            if (!options2.name) {
              options2.name = options2.name || currentConfig.name;
              options2.storeName = options2.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options2.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              var isCurrentDb = options2.name === currentConfig.name && self2._dbInfo.db;
              var dbPromise = isCurrentDb ? Promise$1.resolve(self2._dbInfo.db) : _getOriginalConnection(options2).then(function(db) {
                var dbContext = dbContexts[options2.name];
                var forages = dbContext.forages;
                dbContext.db = db;
                for (var i = 0; i < forages.length; i++) {
                  forages[i]._dbInfo.db = db;
                }
                return db;
              });
              if (!options2.storeName) {
                promise = dbPromise.then(function(db) {
                  _deferReadiness(options2);
                  var dbContext = dbContexts[options2.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                  }
                  var dropDBPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.deleteDatabase(options2.name);
                    req.onerror = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      reject(req.error);
                    };
                    req.onblocked = function() {
                      console.warn('dropInstance blocked for database "' + options2.name + '" until all open connections are closed');
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      resolve(db2);
                    };
                  });
                  return dropDBPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var i2 = 0; i2 < forages.length; i2++) {
                      var _forage = forages[i2];
                      _advanceReadiness(_forage._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options2, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              } else {
                promise = dbPromise.then(function(db) {
                  if (!db.objectStoreNames.contains(options2.storeName)) {
                    return;
                  }
                  var newVersion = db.version + 1;
                  _deferReadiness(options2);
                  var dbContext = dbContexts[options2.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                  }
                  var dropObjectPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.open(options2.name, newVersion);
                    req.onerror = function(err) {
                      var db2 = req.result;
                      db2.close();
                      reject(err);
                    };
                    req.onupgradeneeded = function() {
                      var db2 = req.result;
                      db2.deleteObjectStore(options2.storeName);
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      db2.close();
                      resolve(db2);
                    };
                  });
                  return dropObjectPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var j = 0; j < forages.length; j++) {
                      var _forage2 = forages[j];
                      _forage2._dbInfo.db = db2;
                      _advanceReadiness(_forage2._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options2, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              }
            }
            executeCallback(promise, callback);
            return promise;
          }
          var asyncStorage = {
            _driver: "asyncStorage",
            _initStorage,
            _support: isIndexedDBValid(),
            iterate,
            getItem,
            setItem,
            removeItem,
            clear,
            length,
            key,
            keys,
            dropInstance
          };
          function isWebSQLValid() {
            return typeof openDatabase === "function";
          }
          var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var BLOB_TYPE_PREFIX = "~~local_forage_type~";
          var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
          var SERIALIZED_MARKER = "__lfsc__:";
          var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
          var TYPE_ARRAYBUFFER = "arbf";
          var TYPE_BLOB = "blob";
          var TYPE_INT8ARRAY = "si08";
          var TYPE_UINT8ARRAY = "ui08";
          var TYPE_UINT8CLAMPEDARRAY = "uic8";
          var TYPE_INT16ARRAY = "si16";
          var TYPE_INT32ARRAY = "si32";
          var TYPE_UINT16ARRAY = "ur16";
          var TYPE_UINT32ARRAY = "ui32";
          var TYPE_FLOAT32ARRAY = "fl32";
          var TYPE_FLOAT64ARRAY = "fl64";
          var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
          var toString$1 = Object.prototype.toString;
          function stringToBuffer(serializedString) {
            var bufferLength = serializedString.length * 0.75;
            var len = serializedString.length;
            var i;
            var p = 0;
            var encoded1, encoded2, encoded3, encoded4;
            if (serializedString[serializedString.length - 1] === "=") {
              bufferLength--;
              if (serializedString[serializedString.length - 2] === "=") {
                bufferLength--;
              }
            }
            var buffer = new ArrayBuffer(bufferLength);
            var bytes = new Uint8Array(buffer);
            for (i = 0; i < len; i += 4) {
              encoded1 = BASE_CHARS.indexOf(serializedString[i]);
              encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
              encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
              encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
              bytes[p++] = encoded1 << 2 | encoded2 >> 4;
              bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
              bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
            }
            return buffer;
          }
          function bufferToString(buffer) {
            var bytes = new Uint8Array(buffer);
            var base64String = "";
            var i;
            for (i = 0; i < bytes.length; i += 3) {
              base64String += BASE_CHARS[bytes[i] >> 2];
              base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
              base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
              base64String += BASE_CHARS[bytes[i + 2] & 63];
            }
            if (bytes.length % 3 === 2) {
              base64String = base64String.substring(0, base64String.length - 1) + "=";
            } else if (bytes.length % 3 === 1) {
              base64String = base64String.substring(0, base64String.length - 2) + "==";
            }
            return base64String;
          }
          function serialize(value, callback) {
            var valueType = "";
            if (value) {
              valueType = toString$1.call(value);
            }
            if (value && (valueType === "[object ArrayBuffer]" || value.buffer && toString$1.call(value.buffer) === "[object ArrayBuffer]")) {
              var buffer;
              var marker = SERIALIZED_MARKER;
              if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
              } else {
                buffer = value.buffer;
                if (valueType === "[object Int8Array]") {
                  marker += TYPE_INT8ARRAY;
                } else if (valueType === "[object Uint8Array]") {
                  marker += TYPE_UINT8ARRAY;
                } else if (valueType === "[object Uint8ClampedArray]") {
                  marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueType === "[object Int16Array]") {
                  marker += TYPE_INT16ARRAY;
                } else if (valueType === "[object Uint16Array]") {
                  marker += TYPE_UINT16ARRAY;
                } else if (valueType === "[object Int32Array]") {
                  marker += TYPE_INT32ARRAY;
                } else if (valueType === "[object Uint32Array]") {
                  marker += TYPE_UINT32ARRAY;
                } else if (valueType === "[object Float32Array]") {
                  marker += TYPE_FLOAT32ARRAY;
                } else if (valueType === "[object Float64Array]") {
                  marker += TYPE_FLOAT64ARRAY;
                } else {
                  callback(new Error("Failed to get type for BinaryArray"));
                }
              }
              callback(marker + bufferToString(buffer));
            } else if (valueType === "[object Blob]") {
              var fileReader = new FileReader();
              fileReader.onload = function() {
                var str2 = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
                callback(SERIALIZED_MARKER + TYPE_BLOB + str2);
              };
              fileReader.readAsArrayBuffer(value);
            } else {
              try {
                callback(JSON.stringify(value));
              } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);
                callback(null, e);
              }
            }
          }
          function deserialize(value) {
            if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
              return JSON.parse(value);
            }
            var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
            var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
            var blobType;
            if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
              var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
              blobType = matcher[1];
              serializedString = serializedString.substring(matcher[0].length);
            }
            var buffer = stringToBuffer(serializedString);
            switch (type) {
              case TYPE_ARRAYBUFFER:
                return buffer;
              case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
              case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
              case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
              case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
              case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
              case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
              case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
              case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
              case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
              case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
              default:
                throw new Error("Unkown type: " + type);
            }
          }
          var localforageSerializer = {
            serialize,
            deserialize,
            stringToBuffer,
            bufferToString
          };
          function createDbTable(t, dbInfo, callback, errorCallback) {
            t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
          }
          function _initStorage$1(options2) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options2) {
              for (var i in options2) {
                dbInfo[i] = typeof options2[i] !== "string" ? options2[i].toString() : options2[i];
              }
            }
            var dbInfoPromise = new Promise$1(function(resolve, reject) {
              try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
              } catch (e) {
                return reject(e);
              }
              dbInfo.db.transaction(function(t) {
                createDbTable(t, dbInfo, function() {
                  self2._dbInfo = dbInfo;
                  resolve();
                }, function(t2, error) {
                  reject(error);
                });
              }, reject);
            });
            dbInfo.serializer = localforageSerializer;
            return dbInfoPromise;
          }
          function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
            t.executeSql(sqlStatement, args, callback, function(t2, error) {
              if (error.code === error.SYNTAX_ERR) {
                t2.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [dbInfo.storeName], function(t3, results) {
                  if (!results.rows.length) {
                    createDbTable(t3, dbInfo, function() {
                      t3.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                  } else {
                    errorCallback(t3, error);
                  }
                }, errorCallback);
              } else {
                errorCallback(t2, error);
              }
            }, errorCallback);
          }
          function getItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [key2], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;
                    if (result) {
                      result = dbInfo.serializer.deserialize(result);
                    }
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$1(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t2, results) {
                    var rows = results.rows;
                    var length2 = rows.length;
                    for (var i = 0; i < length2; i++) {
                      var item = rows.item(i);
                      var result = item.value;
                      if (result) {
                        result = dbInfo.serializer.deserialize(result);
                      }
                      result = iterator(result, item.key, i + 1);
                      if (result !== void 0) {
                        resolve(result);
                        return;
                      }
                    }
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function _setItem(key2, value, callback, retriesLeft) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                if (value === void 0) {
                  value = null;
                }
                var originalValue = value;
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    dbInfo.db.transaction(function(t) {
                      tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [key2, value2], function() {
                        resolve(originalValue);
                      }, function(t2, error2) {
                        reject(error2);
                      });
                    }, function(sqlError) {
                      if (sqlError.code === sqlError.QUOTA_ERR) {
                        if (retriesLeft > 0) {
                          resolve(_setItem.apply(self2, [key2, originalValue, callback, retriesLeft - 1]));
                          return;
                        }
                        reject(sqlError);
                      }
                    });
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$1(key2, value, callback) {
            return _setItem.apply(this, [key2, value, callback, 1]);
          }
          function removeItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [key2], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t2, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$1(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [n + 1], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t2, results) {
                    var keys2 = [];
                    for (var i = 0; i < results.rows.length; i++) {
                      keys2.push(results.rows.item(i).key);
                    }
                    resolve(keys2);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getAllStoreNames(db) {
            return new Promise$1(function(resolve, reject) {
              db.transaction(function(t) {
                t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t2, results) {
                  var storeNames = [];
                  for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                  }
                  resolve({
                    db,
                    storeNames
                  });
                }, function(t2, error) {
                  reject(error);
                });
              }, function(sqlError) {
                reject(sqlError);
              });
            });
          }
          function dropInstance$1(options2, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options2 = typeof options2 !== "function" && options2 || {};
            if (!options2.name) {
              options2.name = options2.name || currentConfig.name;
              options2.storeName = options2.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options2.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                var db;
                if (options2.name === currentConfig.name) {
                  db = self2._dbInfo.db;
                } else {
                  db = openDatabase(options2.name, "", "", 0);
                }
                if (!options2.storeName) {
                  resolve(getAllStoreNames(db));
                } else {
                  resolve({
                    db,
                    storeNames: [options2.storeName]
                  });
                }
              }).then(function(operationInfo) {
                return new Promise$1(function(resolve, reject) {
                  operationInfo.db.transaction(function(t) {
                    function dropTable(storeName) {
                      return new Promise$1(function(resolve2, reject2) {
                        t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                          resolve2();
                        }, function(t2, error) {
                          reject2(error);
                        });
                      });
                    }
                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                      operations.push(dropTable(operationInfo.storeNames[i]));
                    }
                    Promise$1.all(operations).then(function() {
                      resolve();
                    })["catch"](function(e) {
                      reject(e);
                    });
                  }, function(sqlError) {
                    reject(sqlError);
                  });
                });
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var webSQLStorage = {
            _driver: "webSQLStorage",
            _initStorage: _initStorage$1,
            _support: isWebSQLValid(),
            iterate: iterate$1,
            getItem: getItem$1,
            setItem: setItem$1,
            removeItem: removeItem$1,
            clear: clear$1,
            length: length$1,
            key: key$1,
            keys: keys$1,
            dropInstance: dropInstance$1
          };
          function isLocalStorageValid() {
            try {
              return typeof localStorage !== "undefined" && "setItem" in localStorage && !!localStorage.setItem;
            } catch (e) {
              return false;
            }
          }
          function _getKeyPrefix(options2, defaultConfig) {
            var keyPrefix = options2.name + "/";
            if (options2.storeName !== defaultConfig.storeName) {
              keyPrefix += options2.storeName + "/";
            }
            return keyPrefix;
          }
          function checkIfLocalStorageThrows() {
            var localStorageTestKey = "_localforage_support_test";
            try {
              localStorage.setItem(localStorageTestKey, true);
              localStorage.removeItem(localStorageTestKey);
              return false;
            } catch (e) {
              return true;
            }
          }
          function _isLocalStorageUsable() {
            return !checkIfLocalStorageThrows() || localStorage.length > 0;
          }
          function _initStorage$2(options2) {
            var self2 = this;
            var dbInfo = {};
            if (options2) {
              for (var i in options2) {
                dbInfo[i] = options2[i];
              }
            }
            dbInfo.keyPrefix = _getKeyPrefix(options2, self2._defaultConfig);
            if (!_isLocalStorageUsable()) {
              return Promise$1.reject();
            }
            self2._dbInfo = dbInfo;
            dbInfo.serializer = localforageSerializer;
            return Promise$1.resolve();
          }
          function clear$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var keyPrefix = self2._dbInfo.keyPrefix;
              for (var i = localStorage.length - 1; i >= 0; i--) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) === 0) {
                  localStorage.removeItem(key2);
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result = localStorage.getItem(dbInfo.keyPrefix + key2);
              if (result) {
                result = dbInfo.serializer.deserialize(result);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$2(iterator, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var keyPrefix = dbInfo.keyPrefix;
              var keyPrefixLength = keyPrefix.length;
              var length2 = localStorage.length;
              var iterationNumber = 1;
              for (var i = 0; i < length2; i++) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) !== 0) {
                  continue;
                }
                var value = localStorage.getItem(key2);
                if (value) {
                  value = dbInfo.serializer.deserialize(value);
                }
                value = iterator(value, key2.substring(keyPrefixLength), iterationNumber++);
                if (value !== void 0) {
                  return value;
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$2(n, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result;
              try {
                result = localStorage.key(n);
              } catch (error) {
                result = null;
              }
              if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var length2 = localStorage.length;
              var keys2 = [];
              for (var i = 0; i < length2; i++) {
                var itemKey = localStorage.key(i);
                if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                  keys2.push(itemKey.substring(dbInfo.keyPrefix.length));
                }
              }
              return keys2;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$2(callback) {
            var self2 = this;
            var promise = self2.keys().then(function(keys2) {
              return keys2.length;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              localStorage.removeItem(dbInfo.keyPrefix + key2);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$2(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              if (value === void 0) {
                value = null;
              }
              var originalValue = value;
              return new Promise$1(function(resolve, reject) {
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    try {
                      localStorage.setItem(dbInfo.keyPrefix + key2, value2);
                      resolve(originalValue);
                    } catch (e) {
                      if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                        reject(e);
                      }
                      reject(e);
                    }
                  }
                });
              });
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance$2(options2, callback) {
            callback = getCallback.apply(this, arguments);
            options2 = typeof options2 !== "function" && options2 || {};
            if (!options2.name) {
              var currentConfig = this.config();
              options2.name = options2.name || currentConfig.name;
              options2.storeName = options2.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options2.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                if (!options2.storeName) {
                  resolve(options2.name + "/");
                } else {
                  resolve(_getKeyPrefix(options2, self2._defaultConfig));
                }
              }).then(function(keyPrefix) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                  var key2 = localStorage.key(i);
                  if (key2.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key2);
                  }
                }
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var localStorageWrapper = {
            _driver: "localStorageWrapper",
            _initStorage: _initStorage$2,
            _support: isLocalStorageValid(),
            iterate: iterate$2,
            getItem: getItem$2,
            setItem: setItem$2,
            removeItem: removeItem$2,
            clear: clear$2,
            length: length$2,
            key: key$2,
            keys: keys$2,
            dropInstance: dropInstance$2
          };
          var sameValue = function sameValue2(x, y) {
            return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
          };
          var includes = function includes2(array, searchElement) {
            var len = array.length;
            var i = 0;
            while (i < len) {
              if (sameValue(array[i], searchElement)) {
                return true;
              }
              i++;
            }
            return false;
          };
          var isArray = Array.isArray || function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
          };
          var DefinedDrivers = {};
          var DriverSupport = {};
          var DefaultDrivers = {
            INDEXEDDB: asyncStorage,
            WEBSQL: webSQLStorage,
            LOCALSTORAGE: localStorageWrapper
          };
          var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];
          var OptionalDriverMethods = ["dropInstance"];
          var LibraryMethods = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(OptionalDriverMethods);
          var DefaultConfig = {
            description: "",
            driver: DefaultDriverOrder.slice(),
            name: "localforage",
            size: 4980736,
            storeName: "keyvaluepairs",
            version: 1
          };
          function callWhenReady(localForageInstance, libraryMethod) {
            localForageInstance[libraryMethod] = function() {
              var _args = arguments;
              return localForageInstance.ready().then(function() {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
              });
            };
          }
          function extend() {
            for (var i = 1; i < arguments.length; i++) {
              var arg = arguments[i];
              if (arg) {
                for (var _key in arg) {
                  if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                      arguments[0][_key] = arg[_key].slice();
                    } else {
                      arguments[0][_key] = arg[_key];
                    }
                  }
                }
              }
            }
            return arguments[0];
          }
          var LocalForage = function() {
            function LocalForage2(options2) {
              _classCallCheck(this, LocalForage2);
              for (var driverTypeKey in DefaultDrivers) {
                if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                  var driver = DefaultDrivers[driverTypeKey];
                  var driverName = driver._driver;
                  this[driverTypeKey] = driverName;
                  if (!DefinedDrivers[driverName]) {
                    this.defineDriver(driver);
                  }
                }
              }
              this._defaultConfig = extend({}, DefaultConfig);
              this._config = extend({}, this._defaultConfig, options2);
              this._driverSet = null;
              this._initDriver = null;
              this._ready = false;
              this._dbInfo = null;
              this._wrapLibraryMethodsWithReady();
              this.setDriver(this._config.driver)["catch"](function() {
              });
            }
            LocalForage2.prototype.config = function config(options2) {
              if ((typeof options2 === "undefined" ? "undefined" : _typeof(options2)) === "object") {
                if (this._ready) {
                  return new Error("Can't call config() after localforage has been used.");
                }
                for (var i in options2) {
                  if (i === "storeName") {
                    options2[i] = options2[i].replace(/\W/g, "_");
                  }
                  if (i === "version" && typeof options2[i] !== "number") {
                    return new Error("Database version must be a number.");
                  }
                  this._config[i] = options2[i];
                }
                if ("driver" in options2 && options2.driver) {
                  return this.setDriver(this._config.driver);
                }
                return true;
              } else if (typeof options2 === "string") {
                return this._config[options2];
              } else {
                return this._config;
              }
            };
            LocalForage2.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
              var promise = new Promise$1(function(resolve, reject) {
                try {
                  var driverName = driverObject._driver;
                  var complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                  if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                  }
                  var driverMethods = LibraryMethods.concat("_initStorage");
                  for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== "function") {
                      reject(complianceError);
                      return;
                    }
                  }
                  var configureMissingMethods = function configureMissingMethods2() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory2(methodName) {
                      return function() {
                        var error = new Error("Method " + methodName + " is not implemented by the current driver");
                        var promise2 = Promise$1.reject(error);
                        executeCallback(promise2, arguments[arguments.length - 1]);
                        return promise2;
                      };
                    };
                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                      var optionalDriverMethod = OptionalDriverMethods[_i];
                      if (!driverObject[optionalDriverMethod]) {
                        driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                      }
                    }
                  };
                  configureMissingMethods();
                  var setDriverSupport = function setDriverSupport2(support) {
                    if (DefinedDrivers[driverName]) {
                      console.info("Redefining LocalForage driver: " + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    resolve();
                  };
                  if ("_support" in driverObject) {
                    if (driverObject._support && typeof driverObject._support === "function") {
                      driverObject._support().then(setDriverSupport, reject);
                    } else {
                      setDriverSupport(!!driverObject._support);
                    }
                  } else {
                    setDriverSupport(true);
                  }
                } catch (e) {
                  reject(e);
                }
              });
              executeTwoCallbacks(promise, callback, errorCallback);
              return promise;
            };
            LocalForage2.prototype.driver = function driver() {
              return this._driver || null;
            };
            LocalForage2.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
              var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
              executeTwoCallbacks(getDriverPromise, callback, errorCallback);
              return getDriverPromise;
            };
            LocalForage2.prototype.getSerializer = function getSerializer(callback) {
              var serializerPromise = Promise$1.resolve(localforageSerializer);
              executeTwoCallbacks(serializerPromise, callback);
              return serializerPromise;
            };
            LocalForage2.prototype.ready = function ready(callback) {
              var self2 = this;
              var promise = self2._driverSet.then(function() {
                if (self2._ready === null) {
                  self2._ready = self2._initDriver();
                }
                return self2._ready;
              });
              executeTwoCallbacks(promise, callback, callback);
              return promise;
            };
            LocalForage2.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
              var self2 = this;
              if (!isArray(drivers)) {
                drivers = [drivers];
              }
              var supportedDrivers = this._getSupportedDrivers(drivers);
              function setDriverToConfig() {
                self2._config.driver = self2.driver();
              }
              function extendSelfWithDriver(driver) {
                self2._extend(driver);
                setDriverToConfig();
                self2._ready = self2._initStorage(self2._config);
                return self2._ready;
              }
              function initDriver(supportedDrivers2) {
                return function() {
                  var currentDriverIndex = 0;
                  function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers2.length) {
                      var driverName = supportedDrivers2[currentDriverIndex];
                      currentDriverIndex++;
                      self2._dbInfo = null;
                      self2._ready = null;
                      return self2.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }
                    setDriverToConfig();
                    var error = new Error("No available storage method found.");
                    self2._driverSet = Promise$1.reject(error);
                    return self2._driverSet;
                  }
                  return driverPromiseLoop();
                };
              }
              var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function() {
                return Promise$1.resolve();
              }) : Promise$1.resolve();
              this._driverSet = oldDriverSetDone.then(function() {
                var driverName = supportedDrivers[0];
                self2._dbInfo = null;
                self2._ready = null;
                return self2.getDriver(driverName).then(function(driver) {
                  self2._driver = driver._driver;
                  setDriverToConfig();
                  self2._wrapLibraryMethodsWithReady();
                  self2._initDriver = initDriver(supportedDrivers);
                });
              })["catch"](function() {
                setDriverToConfig();
                var error = new Error("No available storage method found.");
                self2._driverSet = Promise$1.reject(error);
                return self2._driverSet;
              });
              executeTwoCallbacks(this._driverSet, callback, errorCallback);
              return this._driverSet;
            };
            LocalForage2.prototype.supports = function supports(driverName) {
              return !!DriverSupport[driverName];
            };
            LocalForage2.prototype._extend = function _extend(libraryMethodsAndProperties) {
              extend(this, libraryMethodsAndProperties);
            };
            LocalForage2.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
              var supportedDrivers = [];
              for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                  supportedDrivers.push(driverName);
                }
              }
              return supportedDrivers;
            };
            LocalForage2.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
              for (var i = 0, len = LibraryMethods.length; i < len; i++) {
                callWhenReady(this, LibraryMethods[i]);
              }
            };
            LocalForage2.prototype.createInstance = function createInstance(options2) {
              return new LocalForage2(options2);
            };
            return LocalForage2;
          }();
          var localforage_js = new LocalForage();
          module3.exports = localforage_js;
        }, { "3": 3 }] }, {}, [4])(4);
      });
    }
  });

  // node_modules/marked/lib/marked.esm.js
  function getDefaults() {
    return {
      async: false,
      baseUrl: null,
      breaks: false,
      extensions: null,
      gfm: true,
      headerIds: true,
      headerPrefix: "",
      highlight: null,
      hooks: null,
      langPrefix: "language-",
      mangle: true,
      pedantic: false,
      renderer: null,
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartypants: false,
      tokenizer: null,
      walkTokens: null,
      xhtml: false
    };
  }
  var defaults = getDefaults();
  function changeDefaults(newDefaults) {
    defaults = newDefaults;
  }
  var escapeTest = /[&<>"']/;
  var escapeReplace = new RegExp(escapeTest.source, "g");
  var escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
  var escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
  var escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape(html, encode) {
    if (encode) {
      if (escapeTest.test(html)) {
        return html.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html)) {
        return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }
    return html;
  }
  var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
  function unescape(html) {
    return html.replace(unescapeTest, (_, n) => {
      n = n.toLowerCase();
      if (n === "colon")
        return ":";
      if (n.charAt(0) === "#") {
        return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }
      return "";
    });
  }
  var caret = /(^|[^\[])\^/g;
  function edit(regex, opt) {
    regex = typeof regex === "string" ? regex : regex.source;
    opt = opt || "";
    const obj = {
      replace: (name, val) => {
        val = val.source || val;
        val = val.replace(caret, "$1");
        regex = regex.replace(name, val);
        return obj;
      },
      getRegex: () => {
        return new RegExp(regex, opt);
      }
    };
    return obj;
  }
  var nonWordAndColonTest = /[^\w:]/g;
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
  function cleanUrl(sanitize, base, href) {
    if (sanitize) {
      let prot;
      try {
        prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, "").toLowerCase();
      } catch (e) {
        return null;
      }
      if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
        return null;
      }
    }
    if (base && !originIndependentUrl.test(href)) {
      href = resolveUrl(base, href);
    }
    try {
      href = encodeURI(href).replace(/%25/g, "%");
    } catch (e) {
      return null;
    }
    return href;
  }
  var baseUrls = {};
  var justDomain = /^[^:]+:\/*[^/]*$/;
  var protocol = /^([^:]+:)[\s\S]*$/;
  var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
  function resolveUrl(base, href) {
    if (!baseUrls[" " + base]) {
      if (justDomain.test(base)) {
        baseUrls[" " + base] = base + "/";
      } else {
        baseUrls[" " + base] = rtrim(base, "/", true);
      }
    }
    base = baseUrls[" " + base];
    const relativeBase = base.indexOf(":") === -1;
    if (href.substring(0, 2) === "//") {
      if (relativeBase) {
        return href;
      }
      return base.replace(protocol, "$1") + href;
    } else if (href.charAt(0) === "/") {
      if (relativeBase) {
        return href;
      }
      return base.replace(domain, "$1") + href;
    } else {
      return base + href;
    }
  }
  var noopTest = { exec: function noopTest2() {
  } };
  function splitCells(tableRow, count) {
    const row = tableRow.replace(/\|/g, (match, offset, str2) => {
      let escaped = false, curr = offset;
      while (--curr >= 0 && str2[curr] === "\\")
        escaped = !escaped;
      if (escaped) {
        return "|";
      } else {
        return " |";
      }
    }), cells = row.split(/ \|/);
    let i = 0;
    if (!cells[0].trim()) {
      cells.shift();
    }
    if (cells.length > 0 && !cells[cells.length - 1].trim()) {
      cells.pop();
    }
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count)
        cells.push("");
    }
    for (; i < cells.length; i++) {
      cells[i] = cells[i].trim().replace(/\\\|/g, "|");
    }
    return cells;
  }
  function rtrim(str2, c, invert) {
    const l = str2.length;
    if (l === 0) {
      return "";
    }
    let suffLen = 0;
    while (suffLen < l) {
      const currChar = str2.charAt(l - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }
    return str2.slice(0, l - suffLen);
  }
  function findClosingBracket(str2, b) {
    if (str2.indexOf(b[1]) === -1) {
      return -1;
    }
    const l = str2.length;
    let level = 0, i = 0;
    for (; i < l; i++) {
      if (str2[i] === "\\") {
        i++;
      } else if (str2[i] === b[0]) {
        level++;
      } else if (str2[i] === b[1]) {
        level--;
        if (level < 0) {
          return i;
        }
      }
    }
    return -1;
  }
  function checkSanitizeDeprecation(opt) {
    if (opt && opt.sanitize && !opt.silent) {
      console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
    }
  }
  function repeatString(pattern, count) {
    if (count < 1) {
      return "";
    }
    let result = "";
    while (count > 1) {
      if (count & 1) {
        result += pattern;
      }
      count >>= 1;
      pattern += pattern;
    }
    return result + pattern;
  }
  function outputLink(cap, link, raw, lexer2) {
    const href = link.href;
    const title = link.title ? escape(link.title) : null;
    const text = cap[1].replace(/\\([\[\]])/g, "$1");
    if (cap[0].charAt(0) !== "!") {
      lexer2.state.inLink = true;
      const token = {
        type: "link",
        raw,
        href,
        title,
        text,
        tokens: lexer2.inlineTokens(text)
      };
      lexer2.state.inLink = false;
      return token;
    }
    return {
      type: "image",
      raw,
      href,
      title,
      text: escape(text)
    };
  }
  function indentCodeCompensation(raw, text) {
    const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
    if (matchIndentToCode === null) {
      return text;
    }
    const indentToCode = matchIndentToCode[1];
    return text.split("\n").map((node) => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }
      const [indentInNode] = matchIndentInNode;
      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }
      return node;
    }).join("\n");
  }
  var Tokenizer = class {
    constructor(options2) {
      this.options = options2 || defaults;
    }
    space(src) {
      const cap = this.rules.block.newline.exec(src);
      if (cap && cap[0].length > 0) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
    }
    code(src) {
      const cap = this.rules.block.code.exec(src);
      if (cap) {
        const text = cap[0].replace(/^ {1,4}/gm, "");
        return {
          type: "code",
          raw: cap[0],
          codeBlockStyle: "indented",
          text: !this.options.pedantic ? rtrim(text, "\n") : text
        };
      }
    }
    fences(src) {
      const cap = this.rules.block.fences.exec(src);
      if (cap) {
        const raw = cap[0];
        const text = indentCodeCompensation(raw, cap[3] || "");
        return {
          type: "code",
          raw,
          lang: cap[2] ? cap[2].trim().replace(this.rules.inline._escapes, "$1") : cap[2],
          text
        };
      }
    }
    heading(src) {
      const cap = this.rules.block.heading.exec(src);
      if (cap) {
        let text = cap[2].trim();
        if (/#$/.test(text)) {
          const trimmed = rtrim(text, "#");
          if (this.options.pedantic) {
            text = trimmed.trim();
          } else if (!trimmed || / $/.test(trimmed)) {
            text = trimmed.trim();
          }
        }
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[1].length,
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    hr(src) {
      const cap = this.rules.block.hr.exec(src);
      if (cap) {
        return {
          type: "hr",
          raw: cap[0]
        };
      }
    }
    blockquote(src) {
      const cap = this.rules.block.blockquote.exec(src);
      if (cap) {
        const text = cap[0].replace(/^ *>[ \t]?/gm, "");
        const top = this.lexer.state.top;
        this.lexer.state.top = true;
        const tokens = this.lexer.blockTokens(text);
        this.lexer.state.top = top;
        return {
          type: "blockquote",
          raw: cap[0],
          tokens,
          text
        };
      }
    }
    list(src) {
      let cap = this.rules.block.list.exec(src);
      if (cap) {
        let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine, line, nextLine, rawLine, itemContents, endEarly;
        let bull = cap[1].trim();
        const isordered = bull.length > 1;
        const list = {
          type: "list",
          raw: "",
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : "",
          loose: false,
          items: []
        };
        bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
        if (this.options.pedantic) {
          bull = isordered ? bull : "[*+-]";
        }
        const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
        while (src) {
          endEarly = false;
          if (!(cap = itemRegex.exec(src))) {
            break;
          }
          if (this.rules.block.hr.test(src)) {
            break;
          }
          raw = cap[0];
          src = src.substring(raw.length);
          line = cap[2].split("\n", 1)[0].replace(/^\t+/, (t) => " ".repeat(3 * t.length));
          nextLine = src.split("\n", 1)[0];
          if (this.options.pedantic) {
            indent = 2;
            itemContents = line.trimLeft();
          } else {
            indent = cap[2].search(/[^ ]/);
            indent = indent > 4 ? 1 : indent;
            itemContents = line.slice(indent);
            indent += cap[1].length;
          }
          blankLine = false;
          if (!line && /^ *$/.test(nextLine)) {
            raw += nextLine + "\n";
            src = src.substring(nextLine.length + 1);
            endEarly = true;
          }
          if (!endEarly) {
            const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`);
            const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
            const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
            const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
            while (src) {
              rawLine = src.split("\n", 1)[0];
              nextLine = rawLine;
              if (this.options.pedantic) {
                nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
              }
              if (fencesBeginRegex.test(nextLine)) {
                break;
              }
              if (headingBeginRegex.test(nextLine)) {
                break;
              }
              if (nextBulletRegex.test(nextLine)) {
                break;
              }
              if (hrRegex.test(src)) {
                break;
              }
              if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) {
                itemContents += "\n" + nextLine.slice(indent);
              } else {
                if (blankLine) {
                  break;
                }
                if (line.search(/[^ ]/) >= 4) {
                  break;
                }
                if (fencesBeginRegex.test(line)) {
                  break;
                }
                if (headingBeginRegex.test(line)) {
                  break;
                }
                if (hrRegex.test(line)) {
                  break;
                }
                itemContents += "\n" + nextLine;
              }
              if (!blankLine && !nextLine.trim()) {
                blankLine = true;
              }
              raw += rawLine + "\n";
              src = src.substring(rawLine.length + 1);
              line = nextLine.slice(indent);
            }
          }
          if (!list.loose) {
            if (endsWithBlankLine) {
              list.loose = true;
            } else if (/\n *\n *$/.test(raw)) {
              endsWithBlankLine = true;
            }
          }
          if (this.options.gfm) {
            istask = /^\[[ xX]\] /.exec(itemContents);
            if (istask) {
              ischecked = istask[0] !== "[ ] ";
              itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
            }
          }
          list.items.push({
            type: "list_item",
            raw,
            task: !!istask,
            checked: ischecked,
            loose: false,
            text: itemContents
          });
          list.raw += raw;
        }
        list.items[list.items.length - 1].raw = raw.trimRight();
        list.items[list.items.length - 1].text = itemContents.trimRight();
        list.raw = list.raw.trimRight();
        const l = list.items.length;
        for (i = 0; i < l; i++) {
          this.lexer.state.top = false;
          list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
          if (!list.loose) {
            const spacers = list.items[i].tokens.filter((t) => t.type === "space");
            const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t) => /\n.*\n/.test(t.raw));
            list.loose = hasMultipleLineBreaks;
          }
        }
        if (list.loose) {
          for (i = 0; i < l; i++) {
            list.items[i].loose = true;
          }
        }
        return list;
      }
    }
    html(src) {
      const cap = this.rules.block.html.exec(src);
      if (cap) {
        const token = {
          type: "html",
          raw: cap[0],
          pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
          text: cap[0]
        };
        if (this.options.sanitize) {
          const text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
          token.type = "paragraph";
          token.text = text;
          token.tokens = this.lexer.inline(text);
        }
        return token;
      }
    }
    def(src) {
      const cap = this.rules.block.def.exec(src);
      if (cap) {
        const tag = cap[1].toLowerCase().replace(/\s+/g, " ");
        const href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "";
        const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline._escapes, "$1") : cap[3];
        return {
          type: "def",
          tag,
          raw: cap[0],
          href,
          title
        };
      }
    }
    table(src) {
      const cap = this.rules.block.table.exec(src);
      if (cap) {
        const item = {
          type: "table",
          header: splitCells(cap[1]).map((c) => {
            return { text: c };
          }),
          align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
          rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : []
        };
        if (item.header.length === item.align.length) {
          item.raw = cap[0];
          let l = item.align.length;
          let i, j, k, row;
          for (i = 0; i < l; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = "right";
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = "center";
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = "left";
            } else {
              item.align[i] = null;
            }
          }
          l = item.rows.length;
          for (i = 0; i < l; i++) {
            item.rows[i] = splitCells(item.rows[i], item.header.length).map((c) => {
              return { text: c };
            });
          }
          l = item.header.length;
          for (j = 0; j < l; j++) {
            item.header[j].tokens = this.lexer.inline(item.header[j].text);
          }
          l = item.rows.length;
          for (j = 0; j < l; j++) {
            row = item.rows[j];
            for (k = 0; k < row.length; k++) {
              row[k].tokens = this.lexer.inline(row[k].text);
            }
          }
          return item;
        }
      }
    }
    lheading(src) {
      const cap = this.rules.block.lheading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[2].charAt(0) === "=" ? 1 : 2,
          text: cap[1],
          tokens: this.lexer.inline(cap[1])
        };
      }
    }
    paragraph(src) {
      const cap = this.rules.block.paragraph.exec(src);
      if (cap) {
        const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
        return {
          type: "paragraph",
          raw: cap[0],
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    text(src) {
      const cap = this.rules.block.text.exec(src);
      if (cap) {
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          tokens: this.lexer.inline(cap[0])
        };
      }
    }
    escape(src) {
      const cap = this.rules.inline.escape.exec(src);
      if (cap) {
        return {
          type: "escape",
          raw: cap[0],
          text: escape(cap[1])
        };
      }
    }
    tag(src) {
      const cap = this.rules.inline.tag.exec(src);
      if (cap) {
        if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
          this.lexer.state.inLink = true;
        } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
          this.lexer.state.inLink = false;
        }
        if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = true;
        } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = false;
        }
        return {
          type: this.options.sanitize ? "text" : "html",
          raw: cap[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]
        };
      }
    }
    link(src) {
      const cap = this.rules.inline.link.exec(src);
      if (cap) {
        const trimmedUrl = cap[2].trim();
        if (!this.options.pedantic && /^</.test(trimmedUrl)) {
          if (!/>$/.test(trimmedUrl)) {
            return;
          }
          const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
          if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
            return;
          }
        } else {
          const lastParenIndex = findClosingBracket(cap[2], "()");
          if (lastParenIndex > -1) {
            const start = cap[0].indexOf("!") === 0 ? 5 : 4;
            const linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = "";
          }
        }
        let href = cap[2];
        let title = "";
        if (this.options.pedantic) {
          const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
          if (link) {
            href = link[1];
            title = link[3];
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : "";
        }
        href = href.trim();
        if (/^</.test(href)) {
          if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
            href = href.slice(1);
          } else {
            href = href.slice(1, -1);
          }
        }
        return outputLink(cap, {
          href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
          title: title ? title.replace(this.rules.inline._escapes, "$1") : title
        }, cap[0], this.lexer);
      }
    }
    reflink(src, links) {
      let cap;
      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        let link = (cap[2] || cap[1]).replace(/\s+/g, " ");
        link = links[link.toLowerCase()];
        if (!link) {
          const text = cap[0].charAt(0);
          return {
            type: "text",
            raw: text,
            text
          };
        }
        return outputLink(cap, link, cap[0], this.lexer);
      }
    }
    emStrong(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.emStrong.lDelim.exec(src);
      if (!match)
        return;
      if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
        return;
      const nextChar = match[1] || match[2] || "";
      if (!nextChar || nextChar && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar))) {
        const lLength = match[0].length - 1;
        let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
        const endReg = match[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
        endReg.lastIndex = 0;
        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
        while ((match = endReg.exec(maskedSrc)) != null) {
          rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
          if (!rDelim)
            continue;
          rLength = rDelim.length;
          if (match[3] || match[4]) {
            delimTotal += rLength;
            continue;
          } else if (match[5] || match[6]) {
            if (lLength % 3 && !((lLength + rLength) % 3)) {
              midDelimTotal += rLength;
              continue;
            }
          }
          delimTotal -= rLength;
          if (delimTotal > 0)
            continue;
          rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
          const raw = src.slice(0, lLength + match.index + (match[0].length - rDelim.length) + rLength);
          if (Math.min(lLength, rLength) % 2) {
            const text2 = raw.slice(1, -1);
            return {
              type: "em",
              raw,
              text: text2,
              tokens: this.lexer.inlineTokens(text2)
            };
          }
          const text = raw.slice(2, -2);
          return {
            type: "strong",
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }
      }
    }
    codespan(src) {
      const cap = this.rules.inline.code.exec(src);
      if (cap) {
        let text = cap[2].replace(/\n/g, " ");
        const hasNonSpaceChars = /[^ ]/.test(text);
        const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text = text.substring(1, text.length - 1);
        }
        text = escape(text, true);
        return {
          type: "codespan",
          raw: cap[0],
          text
        };
      }
    }
    br(src) {
      const cap = this.rules.inline.br.exec(src);
      if (cap) {
        return {
          type: "br",
          raw: cap[0]
        };
      }
    }
    del(src) {
      const cap = this.rules.inline.del.exec(src);
      if (cap) {
        return {
          type: "del",
          raw: cap[0],
          text: cap[2],
          tokens: this.lexer.inlineTokens(cap[2])
        };
      }
    }
    autolink(src, mangle2) {
      const cap = this.rules.inline.autolink.exec(src);
      if (cap) {
        let text, href;
        if (cap[2] === "@") {
          text = escape(this.options.mangle ? mangle2(cap[1]) : cap[1]);
          href = "mailto:" + text;
        } else {
          text = escape(cap[1]);
          href = text;
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    url(src, mangle2) {
      let cap;
      if (cap = this.rules.inline.url.exec(src)) {
        let text, href;
        if (cap[2] === "@") {
          text = escape(this.options.mangle ? mangle2(cap[0]) : cap[0]);
          href = "mailto:" + text;
        } else {
          let prevCapZero;
          do {
            prevCapZero = cap[0];
            cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
          } while (prevCapZero !== cap[0]);
          text = escape(cap[0]);
          if (cap[1] === "www.") {
            href = "http://" + cap[0];
          } else {
            href = cap[0];
          }
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    inlineText(src, smartypants2) {
      const cap = this.rules.inline.text.exec(src);
      if (cap) {
        let text;
        if (this.lexer.state.inRawBlock) {
          text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];
        } else {
          text = escape(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
        }
        return {
          type: "text",
          raw: cap[0],
          text
        };
      }
    }
  };
  var block = {
    newline: /^(?: *(?:\n|$))+/,
    code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
    fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
    hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
    html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
    def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
    table: noopTest,
    lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
    text: /^[^\n]+/
  };
  block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
  block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block.def = edit(block.def).replace("label", block._label).replace("title", block._title).getRegex();
  block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
  block.listItemStart = edit(/^( *)(bull) */).replace("bull", block.bullet).getRegex();
  block.list = edit(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
  block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
  block.html = edit(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  block.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
  block.blockquote = edit(block.blockquote).replace("paragraph", block.paragraph).getRegex();
  block.normal = { ...block };
  block.gfm = {
    ...block.normal,
    table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  };
  block.gfm.table = edit(block.gfm.table).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
  block.gfm.paragraph = edit(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", block.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block._tag).getRegex();
  block.pedantic = {
    ...block.normal,
    html: edit(
      `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
    ).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
  };
  var inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noopTest,
    tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(ref)\]/,
    nolink: /^!?\[(ref)\](?:\[\])?/,
    reflinkSearch: "reflink|nolink(?!\\()",
    emStrong: {
      lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
      rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
      rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noopTest,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\spunctuation])/
  };
  inline._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
  inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();
  inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
  inline.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g;
  inline._comment = edit(block._comment).replace("(?:-->|$)", "-->").getRegex();
  inline.emStrong.lDelim = edit(inline.emStrong.lDelim).replace(/punct/g, inline._punctuation).getRegex();
  inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, "g").replace(/punct/g, inline._punctuation).getRegex();
  inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, "g").replace(/punct/g, inline._punctuation).getRegex();
  inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
  inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline.autolink = edit(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
  inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
  inline.tag = edit(inline.tag).replace("comment", inline._comment).replace("attribute", inline._attribute).getRegex();
  inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
  inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
  inline.link = edit(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
  inline.reflink = edit(inline.reflink).replace("label", inline._label).replace("ref", block._label).getRegex();
  inline.nolink = edit(inline.nolink).replace("ref", block._label).getRegex();
  inline.reflinkSearch = edit(inline.reflinkSearch, "g").replace("reflink", inline.reflink).replace("nolink", inline.nolink).getRegex();
  inline.normal = { ...inline };
  inline.pedantic = {
    ...inline.normal,
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g
    },
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
  };
  inline.gfm = {
    ...inline.normal,
    escape: edit(inline.escape).replace("])", "~|])").getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  };
  inline.gfm.url = edit(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
  inline.breaks = {
    ...inline.gfm,
    br: edit(inline.br).replace("{2,}", "*").getRegex(),
    text: edit(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  };
  function smartypants(text) {
    return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
  }
  function mangle(text) {
    let out = "", i, ch;
    const l = text.length;
    for (i = 0; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = "x" + ch.toString(16);
      }
      out += "&#" + ch + ";";
    }
    return out;
  }
  var Lexer = class {
    constructor(options2) {
      this.tokens = [];
      this.tokens.links = /* @__PURE__ */ Object.create(null);
      this.options = options2 || defaults;
      this.options.tokenizer = this.options.tokenizer || new Tokenizer();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      this.tokenizer.lexer = this;
      this.inlineQueue = [];
      this.state = {
        inLink: false,
        inRawBlock: false,
        top: true
      };
      const rules = {
        block: block.normal,
        inline: inline.normal
      };
      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;
        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }
      this.tokenizer.rules = rules;
    }
    static get rules() {
      return {
        block,
        inline
      };
    }
    static lex(src, options2) {
      const lexer2 = new Lexer(options2);
      return lexer2.lex(src);
    }
    static lexInline(src, options2) {
      const lexer2 = new Lexer(options2);
      return lexer2.inlineTokens(src);
    }
    lex(src) {
      src = src.replace(/\r\n|\r/g, "\n");
      this.blockTokens(src, this.tokens);
      let next;
      while (next = this.inlineQueue.shift()) {
        this.inlineTokens(next.src, next.tokens);
      }
      return this.tokens;
    }
    blockTokens(src, tokens = []) {
      if (this.options.pedantic) {
        src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
      } else {
        src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
          return leading + "    ".repeat(tabs.length);
        });
      }
      let token, lastToken, cutSrc, lastParagraphClipped;
      while (src) {
        if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);
          if (token.raw.length === 1 && tokens.length > 0) {
            tokens[tokens.length - 1].raw += "\n";
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.code(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.def(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.raw;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }
          continue;
        }
        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startBlock) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startBlock.forEach(function(getStartIndex) {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
          lastToken = tokens[tokens.length - 1];
          if (lastParagraphClipped && lastToken.type === "paragraph") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          lastParagraphClipped = cutSrc.length !== src.length;
          src = src.substring(token.raw.length);
          continue;
        }
        if (token = this.tokenizer.text(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      this.state.top = true;
      return tokens;
    }
    inline(src, tokens = []) {
      this.inlineQueue.push({ src, tokens });
      return tokens;
    }
    inlineTokens(src, tokens = []) {
      let token, lastToken, cutSrc;
      let maskedSrc = src;
      let match;
      let keepPrevChar, prevChar;
      if (this.tokens.links) {
        const links = Object.keys(this.tokens.links);
        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      }
      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      }
      while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index + match[0].length - 2) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
      }
      while (src) {
        if (!keepPrevChar) {
          prevChar = "";
        }
        keepPrevChar = false;
        if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.tag(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];
          if (lastToken && token.type === "text" && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.autolink(src, mangle)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        cutSrc = src;
        if (this.options.extensions && this.options.extensions.startInline) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startInline.forEach(function(getStartIndex) {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
          src = src.substring(token.raw.length);
          if (token.raw.slice(-1) !== "_") {
            prevChar = token.raw.slice(-1);
          }
          keepPrevChar = true;
          lastToken = tokens[tokens.length - 1];
          if (lastToken && lastToken.type === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
  };
  var Renderer = class {
    constructor(options2) {
      this.options = options2 || defaults;
    }
    code(code, infostring, escaped) {
      const lang = (infostring || "").match(/\S*/)[0];
      if (this.options.highlight) {
        const out = this.options.highlight(code, lang);
        if (out != null && out !== code) {
          escaped = true;
          code = out;
        }
      }
      code = code.replace(/\n$/, "") + "\n";
      if (!lang) {
        return "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>\n";
      }
      return '<pre><code class="' + this.options.langPrefix + escape(lang) + '">' + (escaped ? code : escape(code, true)) + "</code></pre>\n";
    }
    blockquote(quote) {
      return `<blockquote>
${quote}</blockquote>
`;
    }
    html(html) {
      return html;
    }
    heading(text, level, raw, slugger) {
      if (this.options.headerIds) {
        const id = this.options.headerPrefix + slugger.slug(raw);
        return `<h${level} id="${id}">${text}</h${level}>
`;
      }
      return `<h${level}>${text}</h${level}>
`;
    }
    hr() {
      return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
    }
    list(body, ordered, start) {
      const type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
    }
    listitem(text) {
      return `<li>${text}</li>
`;
    }
    checkbox(checked) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
    }
    paragraph(text) {
      return `<p>${text}</p>
`;
    }
    table(header, body) {
      if (body)
        body = `<tbody>${body}</tbody>`;
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    }
    tablerow(content) {
      return `<tr>
${content}</tr>
`;
    }
    tablecell(content, flags) {
      const type = flags.header ? "th" : "td";
      const tag = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
      return tag + content + `</${type}>
`;
    }
    strong(text) {
      return `<strong>${text}</strong>`;
    }
    em(text) {
      return `<em>${text}</em>`;
    }
    codespan(text) {
      return `<code>${text}</code>`;
    }
    br() {
      return this.options.xhtml ? "<br/>" : "<br>";
    }
    del(text) {
      return `<del>${text}</del>`;
    }
    link(href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text;
      }
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ">" + text + "</a>";
      return out;
    }
    image(href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text;
      }
      let out = `<img src="${href}" alt="${text}"`;
      if (title) {
        out += ` title="${title}"`;
      }
      out += this.options.xhtml ? "/>" : ">";
      return out;
    }
    text(text) {
      return text;
    }
  };
  var TextRenderer = class {
    strong(text) {
      return text;
    }
    em(text) {
      return text;
    }
    codespan(text) {
      return text;
    }
    del(text) {
      return text;
    }
    html(text) {
      return text;
    }
    text(text) {
      return text;
    }
    link(href, title, text) {
      return "" + text;
    }
    image(href, title, text) {
      return "" + text;
    }
    br() {
      return "";
    }
  };
  var Slugger = class {
    constructor() {
      this.seen = {};
    }
    serialize(value) {
      return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
    }
    getNextSafeSlug(originalSlug, isDryRun) {
      let slug = originalSlug;
      let occurenceAccumulator = 0;
      if (this.seen.hasOwnProperty(slug)) {
        occurenceAccumulator = this.seen[originalSlug];
        do {
          occurenceAccumulator++;
          slug = originalSlug + "-" + occurenceAccumulator;
        } while (this.seen.hasOwnProperty(slug));
      }
      if (!isDryRun) {
        this.seen[originalSlug] = occurenceAccumulator;
        this.seen[slug] = 0;
      }
      return slug;
    }
    slug(value, options2 = {}) {
      const slug = this.serialize(value);
      return this.getNextSafeSlug(slug, options2.dryrun);
    }
  };
  var Parser = class {
    constructor(options2) {
      this.options = options2 || defaults;
      this.options.renderer = this.options.renderer || new Renderer();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.textRenderer = new TextRenderer();
      this.slugger = new Slugger();
    }
    static parse(tokens, options2) {
      const parser2 = new Parser(options2);
      return parser2.parse(tokens);
    }
    static parseInline(tokens, options2) {
      const parser2 = new Parser(options2);
      return parser2.parseInline(tokens);
    }
    parse(tokens, top = true) {
      let out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox, ret;
      const l = tokens.length;
      for (i = 0; i < l; i++) {
        token = tokens[i];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
          if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(token.type)) {
            out += ret || "";
            continue;
          }
        }
        switch (token.type) {
          case "space": {
            continue;
          }
          case "hr": {
            out += this.renderer.hr();
            continue;
          }
          case "heading": {
            out += this.renderer.heading(
              this.parseInline(token.tokens),
              token.depth,
              unescape(this.parseInline(token.tokens, this.textRenderer)),
              this.slugger
            );
            continue;
          }
          case "code": {
            out += this.renderer.code(
              token.text,
              token.lang,
              token.escaped
            );
            continue;
          }
          case "table": {
            header = "";
            cell = "";
            l2 = token.header.length;
            for (j = 0; j < l2; j++) {
              cell += this.renderer.tablecell(
                this.parseInline(token.header[j].tokens),
                { header: true, align: token.align[j] }
              );
            }
            header += this.renderer.tablerow(cell);
            body = "";
            l2 = token.rows.length;
            for (j = 0; j < l2; j++) {
              row = token.rows[j];
              cell = "";
              l3 = row.length;
              for (k = 0; k < l3; k++) {
                cell += this.renderer.tablecell(
                  this.parseInline(row[k].tokens),
                  { header: false, align: token.align[k] }
                );
              }
              body += this.renderer.tablerow(cell);
            }
            out += this.renderer.table(header, body);
            continue;
          }
          case "blockquote": {
            body = this.parse(token.tokens);
            out += this.renderer.blockquote(body);
            continue;
          }
          case "list": {
            ordered = token.ordered;
            start = token.start;
            loose = token.loose;
            l2 = token.items.length;
            body = "";
            for (j = 0; j < l2; j++) {
              item = token.items[j];
              checked = item.checked;
              task = item.task;
              itemBody = "";
              if (item.task) {
                checkbox = this.renderer.checkbox(checked);
                if (loose) {
                  if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                    item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                    if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                      item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                    }
                  } else {
                    item.tokens.unshift({
                      type: "text",
                      text: checkbox
                    });
                  }
                } else {
                  itemBody += checkbox;
                }
              }
              itemBody += this.parse(item.tokens, loose);
              body += this.renderer.listitem(itemBody, task, checked);
            }
            out += this.renderer.list(body, ordered, start);
            continue;
          }
          case "html": {
            out += this.renderer.html(token.text);
            continue;
          }
          case "paragraph": {
            out += this.renderer.paragraph(this.parseInline(token.tokens));
            continue;
          }
          case "text": {
            body = token.tokens ? this.parseInline(token.tokens) : token.text;
            while (i + 1 < l && tokens[i + 1].type === "text") {
              token = tokens[++i];
              body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
            }
            out += top ? this.renderer.paragraph(body) : body;
            continue;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return;
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
    parseInline(tokens, renderer) {
      renderer = renderer || this.renderer;
      let out = "", i, token, ret;
      const l = tokens.length;
      for (i = 0; i < l; i++) {
        token = tokens[i];
        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
          if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
            out += ret || "";
            continue;
          }
        }
        switch (token.type) {
          case "escape": {
            out += renderer.text(token.text);
            break;
          }
          case "html": {
            out += renderer.html(token.text);
            break;
          }
          case "link": {
            out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
            break;
          }
          case "image": {
            out += renderer.image(token.href, token.title, token.text);
            break;
          }
          case "strong": {
            out += renderer.strong(this.parseInline(token.tokens, renderer));
            break;
          }
          case "em": {
            out += renderer.em(this.parseInline(token.tokens, renderer));
            break;
          }
          case "codespan": {
            out += renderer.codespan(token.text);
            break;
          }
          case "br": {
            out += renderer.br();
            break;
          }
          case "del": {
            out += renderer.del(this.parseInline(token.tokens, renderer));
            break;
          }
          case "text": {
            out += renderer.text(token.text);
            break;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return;
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
  };
  var Hooks = class {
    constructor(options2) {
      this.options = options2 || defaults;
    }
    preprocess(markdown) {
      return markdown;
    }
    postprocess(html) {
      return html;
    }
  };
  __publicField(Hooks, "passThroughHooks", /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess"
  ]));
  function onError(silent, async, callback) {
    return (e) => {
      e.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (silent) {
        const msg = "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
        if (async) {
          return Promise.resolve(msg);
        }
        if (callback) {
          callback(null, msg);
          return;
        }
        return msg;
      }
      if (async) {
        return Promise.reject(e);
      }
      if (callback) {
        callback(e);
        return;
      }
      throw e;
    };
  }
  function parseMarkdown(lexer2, parser2) {
    return (src, opt, callback) => {
      if (typeof opt === "function") {
        callback = opt;
        opt = null;
      }
      const origOpt = { ...opt };
      opt = { ...marked.defaults, ...origOpt };
      const throwError = onError(opt.silent, opt.async, callback);
      if (typeof src === "undefined" || src === null) {
        return throwError(new Error("marked(): input parameter is undefined or null"));
      }
      if (typeof src !== "string") {
        return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      }
      checkSanitizeDeprecation(opt);
      if (opt.hooks) {
        opt.hooks.options = opt;
      }
      if (callback) {
        const highlight = opt.highlight;
        let tokens;
        try {
          if (opt.hooks) {
            src = opt.hooks.preprocess(src);
          }
          tokens = lexer2(src, opt);
        } catch (e) {
          return throwError(e);
        }
        const done = function(err) {
          let out;
          if (!err) {
            try {
              if (opt.walkTokens) {
                marked.walkTokens(tokens, opt.walkTokens);
              }
              out = parser2(tokens, opt);
              if (opt.hooks) {
                out = opt.hooks.postprocess(out);
              }
            } catch (e) {
              err = e;
            }
          }
          opt.highlight = highlight;
          return err ? throwError(err) : callback(null, out);
        };
        if (!highlight || highlight.length < 3) {
          return done();
        }
        delete opt.highlight;
        if (!tokens.length)
          return done();
        let pending = 0;
        marked.walkTokens(tokens, function(token) {
          if (token.type === "code") {
            pending++;
            setTimeout(() => {
              highlight(token.text, token.lang, function(err, code) {
                if (err) {
                  return done(err);
                }
                if (code != null && code !== token.text) {
                  token.text = code;
                  token.escaped = true;
                }
                pending--;
                if (pending === 0) {
                  done();
                }
              });
            }, 0);
          }
        });
        if (pending === 0) {
          done();
        }
        return;
      }
      if (opt.async) {
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.walkTokens ? Promise.all(marked.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html) => opt.hooks ? opt.hooks.postprocess(html) : html).catch(throwError);
      }
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        const tokens = lexer2(src, opt);
        if (opt.walkTokens) {
          marked.walkTokens(tokens, opt.walkTokens);
        }
        let html = parser2(tokens, opt);
        if (opt.hooks) {
          html = opt.hooks.postprocess(html);
        }
        return html;
      } catch (e) {
        return throwError(e);
      }
    };
  }
  function marked(src, opt, callback) {
    return parseMarkdown(Lexer.lex, Parser.parse)(src, opt, callback);
  }
  marked.options = marked.setOptions = function(opt) {
    marked.defaults = { ...marked.defaults, ...opt };
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.getDefaults = getDefaults;
  marked.defaults = defaults;
  marked.use = function(...args) {
    const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };
    args.forEach((pack) => {
      const opts = { ...pack };
      opts.async = marked.defaults.async || opts.async || false;
      if (pack.extensions) {
        pack.extensions.forEach((ext) => {
          if (!ext.name) {
            throw new Error("extension name required");
          }
          if (ext.renderer) {
            const prevRenderer = extensions.renderers[ext.name];
            if (prevRenderer) {
              extensions.renderers[ext.name] = function(...args2) {
                let ret = ext.renderer.apply(this, args2);
                if (ret === false) {
                  ret = prevRenderer.apply(this, args2);
                }
                return ret;
              };
            } else {
              extensions.renderers[ext.name] = ext.renderer;
            }
          }
          if (ext.tokenizer) {
            if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
              throw new Error("extension level must be 'block' or 'inline'");
            }
            if (extensions[ext.level]) {
              extensions[ext.level].unshift(ext.tokenizer);
            } else {
              extensions[ext.level] = [ext.tokenizer];
            }
            if (ext.start) {
              if (ext.level === "block") {
                if (extensions.startBlock) {
                  extensions.startBlock.push(ext.start);
                } else {
                  extensions.startBlock = [ext.start];
                }
              } else if (ext.level === "inline") {
                if (extensions.startInline) {
                  extensions.startInline.push(ext.start);
                } else {
                  extensions.startInline = [ext.start];
                }
              }
            }
          }
          if (ext.childTokens) {
            extensions.childTokens[ext.name] = ext.childTokens;
          }
        });
        opts.extensions = extensions;
      }
      if (pack.renderer) {
        const renderer = marked.defaults.renderer || new Renderer();
        for (const prop in pack.renderer) {
          const prevRenderer = renderer[prop];
          renderer[prop] = (...args2) => {
            let ret = pack.renderer[prop].apply(renderer, args2);
            if (ret === false) {
              ret = prevRenderer.apply(renderer, args2);
            }
            return ret;
          };
        }
        opts.renderer = renderer;
      }
      if (pack.tokenizer) {
        const tokenizer = marked.defaults.tokenizer || new Tokenizer();
        for (const prop in pack.tokenizer) {
          const prevTokenizer = tokenizer[prop];
          tokenizer[prop] = (...args2) => {
            let ret = pack.tokenizer[prop].apply(tokenizer, args2);
            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args2);
            }
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (pack.hooks) {
        const hooks = marked.defaults.hooks || new Hooks();
        for (const prop in pack.hooks) {
          const prevHook = hooks[prop];
          if (Hooks.passThroughHooks.has(prop)) {
            hooks[prop] = (arg) => {
              if (marked.defaults.async) {
                return Promise.resolve(pack.hooks[prop].call(hooks, arg)).then((ret2) => {
                  return prevHook.call(hooks, ret2);
                });
              }
              const ret = pack.hooks[prop].call(hooks, arg);
              return prevHook.call(hooks, ret);
            };
          } else {
            hooks[prop] = (...args2) => {
              let ret = pack.hooks[prop].apply(hooks, args2);
              if (ret === false) {
                ret = prevHook.apply(hooks, args2);
              }
              return ret;
            };
          }
        }
        opts.hooks = hooks;
      }
      if (pack.walkTokens) {
        const walkTokens2 = marked.defaults.walkTokens;
        opts.walkTokens = function(token) {
          let values = [];
          values.push(pack.walkTokens.call(this, token));
          if (walkTokens2) {
            values = values.concat(walkTokens2.call(this, token));
          }
          return values;
        };
      }
      marked.setOptions(opts);
    });
  };
  marked.walkTokens = function(tokens, callback) {
    let values = [];
    for (const token of tokens) {
      values = values.concat(callback.call(marked, token));
      switch (token.type) {
        case "table": {
          for (const cell of token.header) {
            values = values.concat(marked.walkTokens(cell.tokens, callback));
          }
          for (const row of token.rows) {
            for (const cell of row) {
              values = values.concat(marked.walkTokens(cell.tokens, callback));
            }
          }
          break;
        }
        case "list": {
          values = values.concat(marked.walkTokens(token.items, callback));
          break;
        }
        default: {
          if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) {
            marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
              values = values.concat(marked.walkTokens(token[childTokens], callback));
            });
          } else if (token.tokens) {
            values = values.concat(marked.walkTokens(token.tokens, callback));
          }
        }
      }
    }
    return values;
  };
  marked.parseInline = parseMarkdown(Lexer.lexInline, Parser.parseInline);
  marked.Parser = Parser;
  marked.parser = Parser.parse;
  marked.Renderer = Renderer;
  marked.TextRenderer = TextRenderer;
  marked.Lexer = Lexer;
  marked.lexer = Lexer.lex;
  marked.Tokenizer = Tokenizer;
  marked.Slugger = Slugger;
  marked.Hooks = Hooks;
  marked.parse = marked;
  var options = marked.options;
  var setOptions = marked.setOptions;
  var use = marked.use;
  var walkTokens = marked.walkTokens;
  var parseInline = marked.parseInline;
  var parser = Parser.parse;
  var lexer = Lexer.lex;

  // src/app.js
  var import_localforage = __toESM(require_localforage());

  // node_modules/openai/version.mjs
  var VERSION = "4.52.0";

  // node_modules/openai/_shims/registry.mjs
  var auto = false;
  var kind = void 0;
  var fetch2 = void 0;
  var Request2 = void 0;
  var Response2 = void 0;
  var Headers2 = void 0;
  var FormData2 = void 0;
  var Blob2 = void 0;
  var File2 = void 0;
  var ReadableStream2 = void 0;
  var getMultipartRequestOptions = void 0;
  var getDefaultAgent = void 0;
  var fileFromPath = void 0;
  var isFsReadStream = void 0;
  function setShims(shims, options2 = { auto: false }) {
    if (auto) {
      throw new Error(`you must \`import 'openai/shims/${shims.kind}'\` before importing anything else from openai`);
    }
    if (kind) {
      throw new Error(`can't \`import 'openai/shims/${shims.kind}'\` after \`import 'openai/shims/${kind}'\``);
    }
    auto = options2.auto;
    kind = shims.kind;
    fetch2 = shims.fetch;
    Request2 = shims.Request;
    Response2 = shims.Response;
    Headers2 = shims.Headers;
    FormData2 = shims.FormData;
    Blob2 = shims.Blob;
    File2 = shims.File;
    ReadableStream2 = shims.ReadableStream;
    getMultipartRequestOptions = shims.getMultipartRequestOptions;
    getDefaultAgent = shims.getDefaultAgent;
    fileFromPath = shims.fileFromPath;
    isFsReadStream = shims.isFsReadStream;
  }

  // node_modules/openai/_shims/MultipartBody.mjs
  var MultipartBody = class {
    constructor(body) {
      this.body = body;
    }
    get [Symbol.toStringTag]() {
      return "MultipartBody";
    }
  };

  // node_modules/openai/_shims/web-runtime.mjs
  function getRuntime({ manuallyImported } = {}) {
    const recommendation = manuallyImported ? `You may need to use polyfills` : `Add one of these imports before your first \`import \u2026 from 'openai'\`:
- \`import 'openai/shims/node'\` (if you're running on Node)
- \`import 'openai/shims/web'\` (otherwise)
`;
    let _fetch, _Request, _Response, _Headers;
    try {
      _fetch = fetch;
      _Request = Request;
      _Response = Response;
      _Headers = Headers;
    } catch (error) {
      throw new Error(`this environment is missing the following Web Fetch API type: ${error.message}. ${recommendation}`);
    }
    return {
      kind: "web",
      fetch: _fetch,
      Request: _Request,
      Response: _Response,
      Headers: _Headers,
      FormData: typeof FormData !== "undefined" ? FormData : class FormData {
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${recommendation}`);
        }
      },
      Blob: typeof Blob !== "undefined" ? Blob : class Blob {
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${recommendation}`);
        }
      },
      File: typeof File !== "undefined" ? File : class File {
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${recommendation}`);
        }
      },
      ReadableStream: typeof ReadableStream !== "undefined" ? ReadableStream : class ReadableStream {
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${recommendation}`);
        }
      },
      getMultipartRequestOptions: async (form, opts) => ({
        ...opts,
        body: new MultipartBody(form)
      }),
      getDefaultAgent: (url) => void 0,
      fileFromPath: () => {
        throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads");
      },
      isFsReadStream: (value) => false
    };
  }

  // node_modules/openai/_shims/index.mjs
  if (!kind)
    setShims(getRuntime(), { auto: true });

  // node_modules/openai/error.mjs
  var error_exports = {};
  __export(error_exports, {
    APIConnectionError: () => APIConnectionError,
    APIConnectionTimeoutError: () => APIConnectionTimeoutError,
    APIError: () => APIError,
    APIUserAbortError: () => APIUserAbortError,
    AuthenticationError: () => AuthenticationError,
    BadRequestError: () => BadRequestError,
    ConflictError: () => ConflictError,
    InternalServerError: () => InternalServerError,
    NotFoundError: () => NotFoundError,
    OpenAIError: () => OpenAIError,
    PermissionDeniedError: () => PermissionDeniedError,
    RateLimitError: () => RateLimitError,
    UnprocessableEntityError: () => UnprocessableEntityError
  });
  var OpenAIError = class extends Error {
  };
  var APIError = class extends OpenAIError {
    constructor(status, error, message, headers) {
      super(`${APIError.makeMessage(status, error, message)}`);
      this.status = status;
      this.headers = headers;
      this.request_id = headers?.["x-request-id"];
      const data = error;
      this.error = data;
      this.code = data?.["code"];
      this.param = data?.["param"];
      this.type = data?.["type"];
    }
    static makeMessage(status, error, message) {
      const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
      if (status && msg) {
        return `${status} ${msg}`;
      }
      if (status) {
        return `${status} status code (no body)`;
      }
      if (msg) {
        return msg;
      }
      return "(no status code or body)";
    }
    static generate(status, errorResponse, message, headers) {
      if (!status) {
        return new APIConnectionError({ cause: castToError(errorResponse) });
      }
      const error = errorResponse?.["error"];
      if (status === 400) {
        return new BadRequestError(status, error, message, headers);
      }
      if (status === 401) {
        return new AuthenticationError(status, error, message, headers);
      }
      if (status === 403) {
        return new PermissionDeniedError(status, error, message, headers);
      }
      if (status === 404) {
        return new NotFoundError(status, error, message, headers);
      }
      if (status === 409) {
        return new ConflictError(status, error, message, headers);
      }
      if (status === 422) {
        return new UnprocessableEntityError(status, error, message, headers);
      }
      if (status === 429) {
        return new RateLimitError(status, error, message, headers);
      }
      if (status >= 500) {
        return new InternalServerError(status, error, message, headers);
      }
      return new APIError(status, error, message, headers);
    }
  };
  var APIUserAbortError = class extends APIError {
    constructor({ message } = {}) {
      super(void 0, void 0, message || "Request was aborted.", void 0);
      this.status = void 0;
    }
  };
  var APIConnectionError = class extends APIError {
    constructor({ message, cause }) {
      super(void 0, void 0, message || "Connection error.", void 0);
      this.status = void 0;
      if (cause)
        this.cause = cause;
    }
  };
  var APIConnectionTimeoutError = class extends APIConnectionError {
    constructor({ message } = {}) {
      super({ message: message ?? "Request timed out." });
    }
  };
  var BadRequestError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 400;
    }
  };
  var AuthenticationError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 401;
    }
  };
  var PermissionDeniedError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 403;
    }
  };
  var NotFoundError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 404;
    }
  };
  var ConflictError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 409;
    }
  };
  var UnprocessableEntityError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 422;
    }
  };
  var RateLimitError = class extends APIError {
    constructor() {
      super(...arguments);
      this.status = 429;
    }
  };
  var InternalServerError = class extends APIError {
  };

  // node_modules/openai/streaming.mjs
  var Stream = class {
    constructor(iterator, controller) {
      this.iterator = iterator;
      this.controller = controller;
    }
    static fromSSEResponse(response, controller) {
      let consumed = false;
      async function* iterator() {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          for await (const sse of _iterSSEMessages(response, controller)) {
            if (done)
              continue;
            if (sse.data.startsWith("[DONE]")) {
              done = true;
              continue;
            }
            if (sse.event === null) {
              let data;
              try {
                data = JSON.parse(sse.data);
              } catch (e) {
                console.error(`Could not parse message into JSON:`, sse.data);
                console.error(`From chunk:`, sse.raw);
                throw e;
              }
              if (data && data.error) {
                throw new APIError(void 0, data.error, void 0, void 0);
              }
              yield data;
            } else {
              let data;
              try {
                data = JSON.parse(sse.data);
              } catch (e) {
                console.error(`Could not parse message into JSON:`, sse.data);
                console.error(`From chunk:`, sse.raw);
                throw e;
              }
              if (sse.event == "error") {
                throw new APIError(void 0, data.error, data.message, void 0);
              }
              yield { event: sse.event, data };
            }
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError")
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new Stream(iterator, controller);
    }
    static fromReadableStream(readableStream, controller) {
      let consumed = false;
      async function* iterLines() {
        const lineDecoder = new LineDecoder();
        const iter = readableStreamAsyncIterable(readableStream);
        for await (const chunk of iter) {
          for (const line of lineDecoder.decode(chunk)) {
            yield line;
          }
        }
        for (const line of lineDecoder.flush()) {
          yield line;
        }
      }
      async function* iterator() {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          for await (const line of iterLines()) {
            if (done)
              continue;
            if (line)
              yield JSON.parse(line);
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError")
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new Stream(iterator, controller);
    }
    [Symbol.asyncIterator]() {
      return this.iterator();
    }
    tee() {
      const left = [];
      const right = [];
      const iterator = this.iterator();
      const teeIterator = (queue) => {
        return {
          next: () => {
            if (queue.length === 0) {
              const result = iterator.next();
              left.push(result);
              right.push(result);
            }
            return queue.shift();
          }
        };
      };
      return [
        new Stream(() => teeIterator(left), this.controller),
        new Stream(() => teeIterator(right), this.controller)
      ];
    }
    toReadableStream() {
      const self2 = this;
      let iter;
      const encoder = new TextEncoder();
      return new ReadableStream2({
        async start() {
          iter = self2[Symbol.asyncIterator]();
        },
        async pull(ctrl) {
          try {
            const { value, done } = await iter.next();
            if (done)
              return ctrl.close();
            const bytes = encoder.encode(JSON.stringify(value) + "\n");
            ctrl.enqueue(bytes);
          } catch (err) {
            ctrl.error(err);
          }
        },
        async cancel() {
          await iter.return?.();
        }
      });
    }
  };
  async function* _iterSSEMessages(response, controller) {
    if (!response.body) {
      controller.abort();
      throw new OpenAIError(`Attempted to iterate over a response with no body`);
    }
    const sseDecoder = new SSEDecoder();
    const lineDecoder = new LineDecoder();
    const iter = readableStreamAsyncIterable(response.body);
    for await (const sseChunk of iterSSEChunks(iter)) {
      for (const line of lineDecoder.decode(sseChunk)) {
        const sse = sseDecoder.decode(line);
        if (sse)
          yield sse;
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  async function* iterSSEChunks(iterator) {
    let data = new Uint8Array();
    for await (const chunk of iterator) {
      if (chunk == null) {
        continue;
      }
      const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
      let newData = new Uint8Array(data.length + binaryChunk.length);
      newData.set(data);
      newData.set(binaryChunk, data.length);
      data = newData;
      let patternIndex;
      while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
        yield data.slice(0, patternIndex);
        data = data.slice(patternIndex);
      }
    }
    if (data.length > 0) {
      yield data;
    }
  }
  function findDoubleNewlineIndex(buffer) {
    const newline = 10;
    const carriage = 13;
    for (let i = 0; i < buffer.length - 2; i++) {
      if (buffer[i] === newline && buffer[i + 1] === newline) {
        return i + 2;
      }
      if (buffer[i] === carriage && buffer[i + 1] === carriage) {
        return i + 2;
      }
      if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
        return i + 4;
      }
    }
    return -1;
  }
  var SSEDecoder = class {
    constructor() {
      this.event = null;
      this.data = [];
      this.chunks = [];
    }
    decode(line) {
      if (line.endsWith("\r")) {
        line = line.substring(0, line.length - 1);
      }
      if (!line) {
        if (!this.event && !this.data.length)
          return null;
        const sse = {
          event: this.event,
          data: this.data.join("\n"),
          raw: this.chunks
        };
        this.event = null;
        this.data = [];
        this.chunks = [];
        return sse;
      }
      this.chunks.push(line);
      if (line.startsWith(":")) {
        return null;
      }
      let [fieldname, _, value] = partition(line, ":");
      if (value.startsWith(" ")) {
        value = value.substring(1);
      }
      if (fieldname === "event") {
        this.event = value;
      } else if (fieldname === "data") {
        this.data.push(value);
      }
      return null;
    }
  };
  var LineDecoder = class {
    constructor() {
      this.buffer = [];
      this.trailingCR = false;
    }
    decode(chunk) {
      let text = this.decodeText(chunk);
      if (this.trailingCR) {
        text = "\r" + text;
        this.trailingCR = false;
      }
      if (text.endsWith("\r")) {
        this.trailingCR = true;
        text = text.slice(0, -1);
      }
      if (!text) {
        return [];
      }
      const trailingNewline = LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || "");
      let lines = text.split(LineDecoder.NEWLINE_REGEXP);
      if (trailingNewline) {
        lines.pop();
      }
      if (lines.length === 1 && !trailingNewline) {
        this.buffer.push(lines[0]);
        return [];
      }
      if (this.buffer.length > 0) {
        lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
        this.buffer = [];
      }
      if (!trailingNewline) {
        this.buffer = [lines.pop() || ""];
      }
      return lines;
    }
    decodeText(bytes) {
      if (bytes == null)
        return "";
      if (typeof bytes === "string")
        return bytes;
      if (typeof Buffer !== "undefined") {
        if (bytes instanceof Buffer) {
          return bytes.toString();
        }
        if (bytes instanceof Uint8Array) {
          return Buffer.from(bytes).toString();
        }
        throw new OpenAIError(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
      }
      if (typeof TextDecoder !== "undefined") {
        if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
          this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
          return this.textDecoder.decode(bytes);
        }
        throw new OpenAIError(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
      }
      throw new OpenAIError(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
    }
    flush() {
      if (!this.buffer.length && !this.trailingCR) {
        return [];
      }
      const lines = [this.buffer.join("")];
      this.buffer = [];
      this.trailingCR = false;
      return lines;
    }
  };
  LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
  LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
  function partition(str2, delimiter) {
    const index = str2.indexOf(delimiter);
    if (index !== -1) {
      return [str2.substring(0, index), delimiter, str2.substring(index + delimiter.length)];
    }
    return [str2, "", ""];
  }
  function readableStreamAsyncIterable(stream) {
    if (stream[Symbol.asyncIterator])
      return stream;
    const reader = stream.getReader();
    return {
      async next() {
        try {
          const result = await reader.read();
          if (result?.done)
            reader.releaseLock();
          return result;
        } catch (e) {
          reader.releaseLock();
          throw e;
        }
      },
      async return() {
        const cancelPromise = reader.cancel();
        reader.releaseLock();
        await cancelPromise;
        return { done: true, value: void 0 };
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }

  // node_modules/openai/uploads.mjs
  var isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
  var isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
  var isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
  var isUploadable = (value) => {
    return isFileLike(value) || isResponseLike(value) || isFsReadStream(value);
  };
  async function toFile(value, name, options2) {
    value = await value;
    options2 ?? (options2 = isFileLike(value) ? { lastModified: value.lastModified, type: value.type } : {});
    if (isResponseLike(value)) {
      const blob = await value.blob();
      name || (name = new URL(value.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
      return new File2([blob], name, options2);
    }
    const bits = await getBytes(value);
    name || (name = getName(value) ?? "unknown_file");
    if (!options2.type) {
      const type = bits[0]?.type;
      if (typeof type === "string") {
        options2 = { ...options2, type };
      }
    }
    return new File2(bits, name, options2);
  }
  async function getBytes(value) {
    let parts = [];
    if (typeof value === "string" || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
      parts.push(value);
    } else if (isBlobLike(value)) {
      parts.push(await value.arrayBuffer());
    } else if (isAsyncIterableIterator(value)) {
      for await (const chunk of value) {
        parts.push(chunk);
      }
    } else {
      throw new Error(`Unexpected data type: ${typeof value}; constructor: ${value?.constructor?.name}; props: ${propsForError(value)}`);
    }
    return parts;
  }
  function propsForError(value) {
    const props = Object.getOwnPropertyNames(value);
    return `[${props.map((p) => `"${p}"`).join(", ")}]`;
  }
  function getName(value) {
    return getStringFromMaybeBuffer(value.name) || getStringFromMaybeBuffer(value.filename) || getStringFromMaybeBuffer(value.path)?.split(/[\\/]/).pop();
  }
  var getStringFromMaybeBuffer = (x) => {
    if (typeof x === "string")
      return x;
    if (typeof Buffer !== "undefined" && x instanceof Buffer)
      return String(x);
    return void 0;
  };
  var isAsyncIterableIterator = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
  var isMultipartBody = (body) => body && typeof body === "object" && body.body && body[Symbol.toStringTag] === "MultipartBody";
  var multipartFormRequestOptions = async (opts) => {
    const form = await createForm(opts.body);
    return getMultipartRequestOptions(form, opts);
  };
  var createForm = async (body) => {
    const form = new FormData2();
    await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
    return form;
  };
  var addFormValue = async (form, key, value) => {
    if (value === void 0)
      return;
    if (value == null) {
      throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      form.append(key, String(value));
    } else if (isUploadable(value)) {
      const file = await toFile(value);
      form.append(key, file);
    } else if (Array.isArray(value)) {
      await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
    } else if (typeof value === "object") {
      await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
    } else {
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
    }
  };

  // node_modules/openai/core.mjs
  var __classPrivateFieldSet = function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _AbstractPage_client;
  async function defaultParseResponse(props) {
    const { response } = props;
    if (props.options.stream) {
      debug("response", response.status, response.url, response.headers, response.body);
      if (props.options.__streamClass) {
        return props.options.__streamClass.fromSSEResponse(response, props.controller);
      }
      return Stream.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const isJSON = contentType?.includes("application/json") || contentType?.includes("application/vnd.api+json");
    if (isJSON) {
      const json = await response.json();
      debug("response", response.status, response.url, response.headers, json);
      return json;
    }
    const text = await response.text();
    debug("response", response.status, response.url, response.headers, text);
    return text;
  }
  var APIPromise = class extends Promise {
    constructor(responsePromise, parseResponse = defaultParseResponse) {
      super((resolve) => {
        resolve(null);
      });
      this.responsePromise = responsePromise;
      this.parseResponse = parseResponse;
    }
    _thenUnwrap(transform) {
      return new APIPromise(this.responsePromise, async (props) => transform(await this.parseResponse(props)));
    }
    asResponse() {
      return this.responsePromise.then((p) => p.response);
    }
    async withResponse() {
      const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
      return { data, response };
    }
    parse() {
      if (!this.parsedPromise) {
        this.parsedPromise = this.responsePromise.then(this.parseResponse);
      }
      return this.parsedPromise;
    }
    then(onfulfilled, onrejected) {
      return this.parse().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.parse().catch(onrejected);
    }
    finally(onfinally) {
      return this.parse().finally(onfinally);
    }
  };
  var APIClient = class {
    constructor({
      baseURL,
      maxRetries = 2,
      timeout = 6e5,
      httpAgent,
      fetch: overridenFetch
    }) {
      this.baseURL = baseURL;
      this.maxRetries = validatePositiveInteger("maxRetries", maxRetries);
      this.timeout = validatePositiveInteger("timeout", timeout);
      this.httpAgent = httpAgent;
      this.fetch = overridenFetch ?? fetch2;
    }
    authHeaders(opts) {
      return {};
    }
    defaultHeaders(opts) {
      return {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": this.getUserAgent(),
        ...getPlatformHeaders(),
        ...this.authHeaders(opts)
      };
    }
    validateHeaders(headers, customHeaders) {
    }
    defaultIdempotencyKey() {
      return `stainless-node-retry-${uuid4()}`;
    }
    get(path, opts) {
      return this.methodRequest("get", path, opts);
    }
    post(path, opts) {
      return this.methodRequest("post", path, opts);
    }
    patch(path, opts) {
      return this.methodRequest("patch", path, opts);
    }
    put(path, opts) {
      return this.methodRequest("put", path, opts);
    }
    delete(path, opts) {
      return this.methodRequest("delete", path, opts);
    }
    methodRequest(method, path, opts) {
      return this.request(Promise.resolve(opts).then(async (opts2) => {
        const body = opts2 && isBlobLike(opts2?.body) ? new DataView(await opts2.body.arrayBuffer()) : opts2?.body instanceof DataView ? opts2.body : opts2?.body instanceof ArrayBuffer ? new DataView(opts2.body) : opts2 && ArrayBuffer.isView(opts2?.body) ? new DataView(opts2.body.buffer) : opts2?.body;
        return { method, path, ...opts2, body };
      }));
    }
    getAPIList(path, Page2, opts) {
      return this.requestAPIList(Page2, { method: "get", path, ...opts });
    }
    calculateContentLength(body) {
      if (typeof body === "string") {
        if (typeof Buffer !== "undefined") {
          return Buffer.byteLength(body, "utf8").toString();
        }
        if (typeof TextEncoder !== "undefined") {
          const encoder = new TextEncoder();
          const encoded = encoder.encode(body);
          return encoded.length.toString();
        }
      } else if (ArrayBuffer.isView(body)) {
        return body.byteLength.toString();
      }
      return null;
    }
    buildRequest(options2) {
      const { method, path, query, headers = {} } = options2;
      const body = ArrayBuffer.isView(options2.body) || options2.__binaryRequest && typeof options2.body === "string" ? options2.body : isMultipartBody(options2.body) ? options2.body.body : options2.body ? JSON.stringify(options2.body, null, 2) : null;
      const contentLength = this.calculateContentLength(body);
      const url = this.buildURL(path, query);
      if ("timeout" in options2)
        validatePositiveInteger("timeout", options2.timeout);
      const timeout = options2.timeout ?? this.timeout;
      const httpAgent = options2.httpAgent ?? this.httpAgent ?? getDefaultAgent(url);
      const minAgentTimeout = timeout + 1e3;
      if (typeof httpAgent?.options?.timeout === "number" && minAgentTimeout > (httpAgent.options.timeout ?? 0)) {
        httpAgent.options.timeout = minAgentTimeout;
      }
      if (this.idempotencyHeader && method !== "get") {
        if (!options2.idempotencyKey)
          options2.idempotencyKey = this.defaultIdempotencyKey();
        headers[this.idempotencyHeader] = options2.idempotencyKey;
      }
      const reqHeaders = this.buildHeaders({ options: options2, headers, contentLength });
      const req = {
        method,
        ...body && { body },
        headers: reqHeaders,
        ...httpAgent && { agent: httpAgent },
        signal: options2.signal ?? null
      };
      return { req, url, timeout };
    }
    buildHeaders({ options: options2, headers, contentLength }) {
      const reqHeaders = {};
      if (contentLength) {
        reqHeaders["content-length"] = contentLength;
      }
      const defaultHeaders = this.defaultHeaders(options2);
      applyHeadersMut(reqHeaders, defaultHeaders);
      applyHeadersMut(reqHeaders, headers);
      if (isMultipartBody(options2.body) && kind !== "node") {
        delete reqHeaders["content-type"];
      }
      this.validateHeaders(reqHeaders, headers);
      return reqHeaders;
    }
    async prepareOptions(options2) {
    }
    async prepareRequest(request, { url, options: options2 }) {
    }
    parseHeaders(headers) {
      return !headers ? {} : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header])) : { ...headers };
    }
    makeStatusError(status, error, message, headers) {
      return APIError.generate(status, error, message, headers);
    }
    request(options2, remainingRetries = null) {
      return new APIPromise(this.makeRequest(options2, remainingRetries));
    }
    async makeRequest(optionsInput, retriesRemaining) {
      const options2 = await optionsInput;
      if (retriesRemaining == null) {
        retriesRemaining = options2.maxRetries ?? this.maxRetries;
      }
      await this.prepareOptions(options2);
      const { req, url, timeout } = this.buildRequest(options2);
      await this.prepareRequest(req, { url, options: options2 });
      debug("request", url, options2, req.headers);
      if (options2.signal?.aborted) {
        throw new APIUserAbortError();
      }
      const controller = new AbortController();
      const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
      if (response instanceof Error) {
        if (options2.signal?.aborted) {
          throw new APIUserAbortError();
        }
        if (retriesRemaining) {
          return this.retryRequest(options2, retriesRemaining);
        }
        if (response.name === "AbortError") {
          throw new APIConnectionTimeoutError();
        }
        throw new APIConnectionError({ cause: response });
      }
      const responseHeaders = createResponseHeaders(response.headers);
      if (!response.ok) {
        if (retriesRemaining && this.shouldRetry(response)) {
          const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
          debug(`response (error; ${retryMessage2})`, response.status, url, responseHeaders);
          return this.retryRequest(options2, retriesRemaining, responseHeaders);
        }
        const errText = await response.text().catch((e) => castToError(e).message);
        const errJSON = safeJSON(errText);
        const errMessage = errJSON ? void 0 : errText;
        const retryMessage = retriesRemaining ? `(error; no more retries left)` : `(error; not retryable)`;
        debug(`response (error; ${retryMessage})`, response.status, url, responseHeaders, errMessage);
        const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
        throw err;
      }
      return { response, options: options2, controller };
    }
    requestAPIList(Page2, options2) {
      const request = this.makeRequest(options2, null);
      return new PagePromise(this, request, Page2);
    }
    buildURL(path, query) {
      const url = isAbsoluteURL(path) ? new URL(path) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
      const defaultQuery = this.defaultQuery();
      if (!isEmptyObj(defaultQuery)) {
        query = { ...defaultQuery, ...query };
      }
      if (typeof query === "object" && query && !Array.isArray(query)) {
        url.search = this.stringifyQuery(query);
      }
      return url.toString();
    }
    stringifyQuery(query) {
      return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        if (value === null) {
          return `${encodeURIComponent(key)}=`;
        }
        throw new OpenAIError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
      }).join("&");
    }
    async fetchWithTimeout(url, init, ms, controller) {
      const { signal, ...options2 } = init || {};
      if (signal)
        signal.addEventListener("abort", () => controller.abort());
      const timeout = setTimeout(() => controller.abort(), ms);
      return this.getRequestClient().fetch.call(void 0, url, { signal: controller.signal, ...options2 }).finally(() => {
        clearTimeout(timeout);
      });
    }
    getRequestClient() {
      return { fetch: this.fetch };
    }
    shouldRetry(response) {
      const shouldRetryHeader = response.headers.get("x-should-retry");
      if (shouldRetryHeader === "true")
        return true;
      if (shouldRetryHeader === "false")
        return false;
      if (response.status === 408)
        return true;
      if (response.status === 409)
        return true;
      if (response.status === 429)
        return true;
      if (response.status >= 500)
        return true;
      return false;
    }
    async retryRequest(options2, retriesRemaining, responseHeaders) {
      let timeoutMillis;
      const retryAfterMillisHeader = responseHeaders?.["retry-after-ms"];
      if (retryAfterMillisHeader) {
        const timeoutMs = parseFloat(retryAfterMillisHeader);
        if (!Number.isNaN(timeoutMs)) {
          timeoutMillis = timeoutMs;
        }
      }
      const retryAfterHeader = responseHeaders?.["retry-after"];
      if (retryAfterHeader && !timeoutMillis) {
        const timeoutSeconds = parseFloat(retryAfterHeader);
        if (!Number.isNaN(timeoutSeconds)) {
          timeoutMillis = timeoutSeconds * 1e3;
        } else {
          timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
        }
      }
      if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
        const maxRetries = options2.maxRetries ?? this.maxRetries;
        timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
      }
      await sleep(timeoutMillis);
      return this.makeRequest(options2, retriesRemaining - 1);
    }
    calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
      const initialRetryDelay = 0.5;
      const maxRetryDelay = 8;
      const numRetries = maxRetries - retriesRemaining;
      const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
      const jitter = 1 - Math.random() * 0.25;
      return sleepSeconds * jitter * 1e3;
    }
    getUserAgent() {
      return `${this.constructor.name}/JS ${VERSION}`;
    }
  };
  var AbstractPage = class {
    constructor(client, response, body, options2) {
      _AbstractPage_client.set(this, void 0);
      __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
      this.options = options2;
      this.response = response;
      this.body = body;
    }
    hasNextPage() {
      const items = this.getPaginatedItems();
      if (!items.length)
        return false;
      return this.nextPageInfo() != null;
    }
    async getNextPage() {
      const nextInfo = this.nextPageInfo();
      if (!nextInfo) {
        throw new OpenAIError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
      }
      const nextOptions = { ...this.options };
      if ("params" in nextInfo && typeof nextOptions.query === "object") {
        nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
      } else if ("url" in nextInfo) {
        const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
        for (const [key, value] of params) {
          nextInfo.url.searchParams.set(key, value);
        }
        nextOptions.query = void 0;
        nextOptions.path = nextInfo.url.toString();
      }
      return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
    }
    async *iterPages() {
      let page = this;
      yield page;
      while (page.hasNextPage()) {
        page = await page.getNextPage();
        yield page;
      }
    }
    async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
      for await (const page of this.iterPages()) {
        for (const item of page.getPaginatedItems()) {
          yield item;
        }
      }
    }
  };
  var PagePromise = class extends APIPromise {
    constructor(client, request, Page2) {
      super(request, async (props) => new Page2(client, props.response, await defaultParseResponse(props), props.options));
    }
    async *[Symbol.asyncIterator]() {
      const page = await this;
      for await (const item of page) {
        yield item;
      }
    }
  };
  var createResponseHeaders = (headers) => {
    return new Proxy(Object.fromEntries(
      headers.entries()
    ), {
      get(target, name) {
        const key = name.toString();
        return target[key.toLowerCase()] || target[key];
      }
    });
  };
  var requestOptionsKeys = {
    method: true,
    path: true,
    query: true,
    body: true,
    headers: true,
    maxRetries: true,
    stream: true,
    timeout: true,
    httpAgent: true,
    signal: true,
    idempotencyKey: true,
    __binaryRequest: true,
    __binaryResponse: true,
    __streamClass: true
  };
  var isRequestOptions = (obj) => {
    return typeof obj === "object" && obj !== null && !isEmptyObj(obj) && Object.keys(obj).every((k) => hasOwn(requestOptionsKeys, k));
  };
  var getPlatformProperties = () => {
    if (typeof Deno !== "undefined" && Deno.build != null) {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": normalizePlatform(Deno.build.os),
        "X-Stainless-Arch": normalizeArch(Deno.build.arch),
        "X-Stainless-Runtime": "deno",
        "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
      };
    }
    if (typeof EdgeRuntime !== "undefined") {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": `other:${EdgeRuntime}`,
        "X-Stainless-Runtime": "edge",
        "X-Stainless-Runtime-Version": process.version
      };
    }
    if (Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": normalizePlatform(process.platform),
        "X-Stainless-Arch": normalizeArch(process.arch),
        "X-Stainless-Runtime": "node",
        "X-Stainless-Runtime-Version": process.version
      };
    }
    const browserInfo = getBrowserInfo();
    if (browserInfo) {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": "unknown",
        "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
        "X-Stainless-Runtime-Version": browserInfo.version
      };
    }
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": "unknown",
      "X-Stainless-Runtime-Version": "unknown"
    };
  };
  function getBrowserInfo() {
    if (typeof navigator === "undefined" || !navigator) {
      return null;
    }
    const browserPatterns = [
      { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
    ];
    for (const { key, pattern } of browserPatterns) {
      const match = pattern.exec(navigator.userAgent);
      if (match) {
        const major = match[1] || 0;
        const minor = match[2] || 0;
        const patch = match[3] || 0;
        return { browser: key, version: `${major}.${minor}.${patch}` };
      }
    }
    return null;
  }
  var normalizeArch = (arch) => {
    if (arch === "x32")
      return "x32";
    if (arch === "x86_64" || arch === "x64")
      return "x64";
    if (arch === "arm")
      return "arm";
    if (arch === "aarch64" || arch === "arm64")
      return "arm64";
    if (arch)
      return `other:${arch}`;
    return "unknown";
  };
  var normalizePlatform = (platform) => {
    platform = platform.toLowerCase();
    if (platform.includes("ios"))
      return "iOS";
    if (platform === "android")
      return "Android";
    if (platform === "darwin")
      return "MacOS";
    if (platform === "win32")
      return "Windows";
    if (platform === "freebsd")
      return "FreeBSD";
    if (platform === "openbsd")
      return "OpenBSD";
    if (platform === "linux")
      return "Linux";
    if (platform)
      return `Other:${platform}`;
    return "Unknown";
  };
  var _platformHeaders;
  var getPlatformHeaders = () => {
    return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
  };
  var safeJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      return void 0;
    }
  };
  var startsWithSchemeRegexp = new RegExp("^(?:[a-z]+:)?//", "i");
  var isAbsoluteURL = (url) => {
    return startsWithSchemeRegexp.test(url);
  };
  var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  var validatePositiveInteger = (name, n) => {
    if (typeof n !== "number" || !Number.isInteger(n)) {
      throw new OpenAIError(`${name} must be an integer`);
    }
    if (n < 0) {
      throw new OpenAIError(`${name} must be a positive integer`);
    }
    return n;
  };
  var castToError = (err) => {
    if (err instanceof Error)
      return err;
    return new Error(err);
  };
  var readEnv = (env) => {
    if (typeof process !== "undefined") {
      return process.env?.[env]?.trim() ?? void 0;
    }
    if (typeof Deno !== "undefined") {
      return Deno.env?.get?.(env)?.trim();
    }
    return void 0;
  };
  function isEmptyObj(obj) {
    if (!obj)
      return true;
    for (const _k in obj)
      return false;
    return true;
  }
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function applyHeadersMut(targetHeaders, newHeaders) {
    for (const k in newHeaders) {
      if (!hasOwn(newHeaders, k))
        continue;
      const lowerKey = k.toLowerCase();
      if (!lowerKey)
        continue;
      const val = newHeaders[k];
      if (val === null) {
        delete targetHeaders[lowerKey];
      } else if (val !== void 0) {
        targetHeaders[lowerKey] = val;
      }
    }
  }
  function debug(action, ...args) {
    if (typeof process !== "undefined" && process?.env?.["DEBUG"] === "true") {
      console.log(`OpenAI:DEBUG:${action}`, ...args);
    }
  }
  var uuid4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  };
  var isRunningInBrowser = () => {
    return typeof window !== "undefined" && typeof window.document !== "undefined" && typeof navigator !== "undefined";
  };
  function isObj(obj) {
    return obj != null && typeof obj === "object" && !Array.isArray(obj);
  }

  // node_modules/openai/pagination.mjs
  var Page = class extends AbstractPage {
    constructor(client, response, body, options2) {
      super(client, response, body, options2);
      this.data = body.data || [];
      this.object = body.object;
    }
    getPaginatedItems() {
      return this.data ?? [];
    }
    nextPageParams() {
      return null;
    }
    nextPageInfo() {
      return null;
    }
  };
  var CursorPage = class extends AbstractPage {
    constructor(client, response, body, options2) {
      super(client, response, body, options2);
      this.data = body.data || [];
    }
    getPaginatedItems() {
      return this.data ?? [];
    }
    nextPageParams() {
      const info = this.nextPageInfo();
      if (!info)
        return null;
      if ("params" in info)
        return info.params;
      const params = Object.fromEntries(info.url.searchParams);
      if (!Object.keys(params).length)
        return null;
      return params;
    }
    nextPageInfo() {
      const data = this.getPaginatedItems();
      if (!data.length) {
        return null;
      }
      const id = data[data.length - 1]?.id;
      if (!id) {
        return null;
      }
      return { params: { after: id } };
    }
  };

  // node_modules/openai/resource.mjs
  var APIResource = class {
    constructor(client) {
      this._client = client;
    }
  };

  // node_modules/openai/resources/chat/completions.mjs
  var Completions = class extends APIResource {
    create(body, options2) {
      return this._client.post("/chat/completions", { body, ...options2, stream: body.stream ?? false });
    }
  };
  (function(Completions4) {
  })(Completions || (Completions = {}));

  // node_modules/openai/resources/chat/chat.mjs
  var Chat = class extends APIResource {
    constructor() {
      super(...arguments);
      this.completions = new Completions(this._client);
    }
  };
  (function(Chat3) {
    Chat3.Completions = Completions;
  })(Chat || (Chat = {}));

  // node_modules/openai/resources/audio/speech.mjs
  var Speech = class extends APIResource {
    create(body, options2) {
      return this._client.post("/audio/speech", { body, ...options2, __binaryResponse: true });
    }
  };
  (function(Speech2) {
  })(Speech || (Speech = {}));

  // node_modules/openai/resources/audio/transcriptions.mjs
  var Transcriptions = class extends APIResource {
    create(body, options2) {
      return this._client.post("/audio/transcriptions", multipartFormRequestOptions({ body, ...options2 }));
    }
  };
  (function(Transcriptions2) {
  })(Transcriptions || (Transcriptions = {}));

  // node_modules/openai/resources/audio/translations.mjs
  var Translations = class extends APIResource {
    create(body, options2) {
      return this._client.post("/audio/translations", multipartFormRequestOptions({ body, ...options2 }));
    }
  };
  (function(Translations2) {
  })(Translations || (Translations = {}));

  // node_modules/openai/resources/audio/audio.mjs
  var Audio = class extends APIResource {
    constructor() {
      super(...arguments);
      this.transcriptions = new Transcriptions(this._client);
      this.translations = new Translations(this._client);
      this.speech = new Speech(this._client);
    }
  };
  (function(Audio2) {
    Audio2.Transcriptions = Transcriptions;
    Audio2.Translations = Translations;
    Audio2.Speech = Speech;
  })(Audio || (Audio = {}));

  // node_modules/openai/resources/batches.mjs
  var Batches = class extends APIResource {
    create(body, options2) {
      return this._client.post("/batches", { body, ...options2 });
    }
    retrieve(batchId, options2) {
      return this._client.get(`/batches/${batchId}`, options2);
    }
    list(query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/batches", BatchesPage, { query, ...options2 });
    }
    cancel(batchId, options2) {
      return this._client.post(`/batches/${batchId}/cancel`, options2);
    }
  };
  var BatchesPage = class extends CursorPage {
  };
  (function(Batches2) {
    Batches2.BatchesPage = BatchesPage;
  })(Batches || (Batches = {}));

  // node_modules/openai/resources/beta/assistants.mjs
  var Assistants = class extends APIResource {
    create(body, options2) {
      return this._client.post("/assistants", {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    retrieve(assistantId, options2) {
      return this._client.get(`/assistants/${assistantId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    update(assistantId, body, options2) {
      return this._client.post(`/assistants/${assistantId}`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    list(query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/assistants", AssistantsPage, {
        query,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    del(assistantId, options2) {
      return this._client.delete(`/assistants/${assistantId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
  };
  var AssistantsPage = class extends CursorPage {
  };
  (function(Assistants2) {
    Assistants2.AssistantsPage = AssistantsPage;
  })(Assistants || (Assistants = {}));

  // node_modules/openai/lib/RunnableFunction.mjs
  function isRunnableFunctionWithParse(fn) {
    return typeof fn.parse === "function";
  }

  // node_modules/openai/lib/chatCompletionUtils.mjs
  var isAssistantMessage = (message) => {
    return message?.role === "assistant";
  };
  var isFunctionMessage = (message) => {
    return message?.role === "function";
  };
  var isToolMessage = (message) => {
    return message?.role === "tool";
  };

  // node_modules/openai/lib/AbstractChatCompletionRunner.mjs
  var __classPrivateFieldSet2 = function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet2 = function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _AbstractChatCompletionRunner_instances;
  var _AbstractChatCompletionRunner_connectedPromise;
  var _AbstractChatCompletionRunner_resolveConnectedPromise;
  var _AbstractChatCompletionRunner_rejectConnectedPromise;
  var _AbstractChatCompletionRunner_endPromise;
  var _AbstractChatCompletionRunner_resolveEndPromise;
  var _AbstractChatCompletionRunner_rejectEndPromise;
  var _AbstractChatCompletionRunner_listeners;
  var _AbstractChatCompletionRunner_ended;
  var _AbstractChatCompletionRunner_errored;
  var _AbstractChatCompletionRunner_aborted;
  var _AbstractChatCompletionRunner_catchingPromiseCreated;
  var _AbstractChatCompletionRunner_getFinalContent;
  var _AbstractChatCompletionRunner_getFinalMessage;
  var _AbstractChatCompletionRunner_getFinalFunctionCall;
  var _AbstractChatCompletionRunner_getFinalFunctionCallResult;
  var _AbstractChatCompletionRunner_calculateTotalUsage;
  var _AbstractChatCompletionRunner_handleError;
  var _AbstractChatCompletionRunner_validateParams;
  var _AbstractChatCompletionRunner_stringifyFunctionCallResult;
  var DEFAULT_MAX_CHAT_COMPLETIONS = 10;
  var AbstractChatCompletionRunner = class {
    constructor() {
      _AbstractChatCompletionRunner_instances.add(this);
      this.controller = new AbortController();
      _AbstractChatCompletionRunner_connectedPromise.set(this, void 0);
      _AbstractChatCompletionRunner_resolveConnectedPromise.set(this, () => {
      });
      _AbstractChatCompletionRunner_rejectConnectedPromise.set(this, () => {
      });
      _AbstractChatCompletionRunner_endPromise.set(this, void 0);
      _AbstractChatCompletionRunner_resolveEndPromise.set(this, () => {
      });
      _AbstractChatCompletionRunner_rejectEndPromise.set(this, () => {
      });
      _AbstractChatCompletionRunner_listeners.set(this, {});
      this._chatCompletions = [];
      this.messages = [];
      _AbstractChatCompletionRunner_ended.set(this, false);
      _AbstractChatCompletionRunner_errored.set(this, false);
      _AbstractChatCompletionRunner_aborted.set(this, false);
      _AbstractChatCompletionRunner_catchingPromiseCreated.set(this, false);
      _AbstractChatCompletionRunner_handleError.set(this, (error) => {
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_errored, true, "f");
        if (error instanceof Error && error.name === "AbortError") {
          error = new APIUserAbortError();
        }
        if (error instanceof APIUserAbortError) {
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_aborted, true, "f");
          return this._emit("abort", error);
        }
        if (error instanceof OpenAIError) {
          return this._emit("error", error);
        }
        if (error instanceof Error) {
          const openAIError = new OpenAIError(error.message);
          openAIError.cause = error;
          return this._emit("error", openAIError);
        }
        return this._emit("error", new OpenAIError(String(error)));
      });
      __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_connectedPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_resolveConnectedPromise, resolve, "f");
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_rejectConnectedPromise, reject, "f");
      }), "f");
      __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_endPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_resolveEndPromise, resolve, "f");
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_rejectEndPromise, reject, "f");
      }), "f");
      __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_connectedPromise, "f").catch(() => {
      });
      __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_endPromise, "f").catch(() => {
      });
    }
    _run(executor) {
      setTimeout(() => {
        executor().then(() => {
          this._emitFinal();
          this._emit("end");
        }, __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_handleError, "f"));
      }, 0);
    }
    _addChatCompletion(chatCompletion) {
      this._chatCompletions.push(chatCompletion);
      this._emit("chatCompletion", chatCompletion);
      const message = chatCompletion.choices[0]?.message;
      if (message)
        this._addMessage(message);
      return chatCompletion;
    }
    _addMessage(message, emit = true) {
      if (!("content" in message))
        message.content = null;
      this.messages.push(message);
      if (emit) {
        this._emit("message", message);
        if ((isFunctionMessage(message) || isToolMessage(message)) && message.content) {
          this._emit("functionCallResult", message.content);
        } else if (isAssistantMessage(message) && message.function_call) {
          this._emit("functionCall", message.function_call);
        } else if (isAssistantMessage(message) && message.tool_calls) {
          for (const tool_call of message.tool_calls) {
            if (tool_call.type === "function") {
              this._emit("functionCall", tool_call.function);
            }
          }
        }
      }
    }
    _connected() {
      if (this.ended)
        return;
      __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_resolveConnectedPromise, "f").call(this);
      this._emit("connect");
    }
    get ended() {
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_ended, "f");
    }
    get errored() {
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_errored, "f");
    }
    get aborted() {
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_aborted, "f");
    }
    abort() {
      this.controller.abort();
    }
    on(event, listener) {
      const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] || (__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] = []);
      listeners.push({ listener });
      return this;
    }
    off(event, listener) {
      const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event];
      if (!listeners)
        return this;
      const index = listeners.findIndex((l) => l.listener === listener);
      if (index >= 0)
        listeners.splice(index, 1);
      return this;
    }
    once(event, listener) {
      const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] || (__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] = []);
      listeners.push({ listener, once: true });
      return this;
    }
    emitted(event) {
      return new Promise((resolve, reject) => {
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, true, "f");
        if (event !== "error")
          this.once("error", reject);
        this.once(event, resolve);
      });
    }
    async done() {
      __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, true, "f");
      await __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_endPromise, "f");
    }
    async finalChatCompletion() {
      await this.done();
      const completion = this._chatCompletions[this._chatCompletions.length - 1];
      if (!completion)
        throw new OpenAIError("stream ended without producing a ChatCompletion");
      return completion;
    }
    async finalContent() {
      await this.done();
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
    }
    async finalMessage() {
      await this.done();
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
    }
    async finalFunctionCall() {
      await this.done();
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
    }
    async finalFunctionCallResult() {
      await this.done();
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
    }
    async totalUsage() {
      await this.done();
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this);
    }
    allChatCompletions() {
      return [...this._chatCompletions];
    }
    _emit(event, ...args) {
      if (__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_ended, "f")) {
        return;
      }
      if (event === "end") {
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_ended, true, "f");
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_resolveEndPromise, "f").call(this);
      }
      const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event];
      if (listeners) {
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] = listeners.filter((l) => !l.once);
        listeners.forEach(({ listener }) => listener(...args));
      }
      if (event === "abort") {
        const error = args[0];
        if (!__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, "f") && !listeners?.length) {
          Promise.reject(error);
        }
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectConnectedPromise, "f").call(this, error);
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectEndPromise, "f").call(this, error);
        this._emit("end");
        return;
      }
      if (event === "error") {
        const error = args[0];
        if (!__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, "f") && !listeners?.length) {
          Promise.reject(error);
        }
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectConnectedPromise, "f").call(this, error);
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectEndPromise, "f").call(this, error);
        this._emit("end");
      }
    }
    _emitFinal() {
      const completion = this._chatCompletions[this._chatCompletions.length - 1];
      if (completion)
        this._emit("finalChatCompletion", completion);
      const finalMessage = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
      if (finalMessage)
        this._emit("finalMessage", finalMessage);
      const finalContent = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
      if (finalContent)
        this._emit("finalContent", finalContent);
      const finalFunctionCall = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
      if (finalFunctionCall)
        this._emit("finalFunctionCall", finalFunctionCall);
      const finalFunctionCallResult = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
      if (finalFunctionCallResult != null)
        this._emit("finalFunctionCallResult", finalFunctionCallResult);
      if (this._chatCompletions.some((c) => c.usage)) {
        this._emit("totalUsage", __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this));
      }
    }
    async _createChatCompletion(completions, params, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_validateParams).call(this, params);
      const chatCompletion = await completions.create({ ...params, stream: false }, { ...options2, signal: this.controller.signal });
      this._connected();
      return this._addChatCompletion(chatCompletion);
    }
    async _runChatCompletion(completions, params, options2) {
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      return await this._createChatCompletion(completions, params, options2);
    }
    async _runFunctions(completions, params, options2) {
      const role = "function";
      const { function_call = "auto", stream, ...restParams } = params;
      const singleFunctionToCall = typeof function_call !== "string" && function_call?.name;
      const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options2 || {};
      const functionsByName = {};
      for (const f of params.functions) {
        functionsByName[f.name || f.function.name] = f;
      }
      const functions = params.functions.map((f) => ({
        name: f.name || f.function.name,
        parameters: f.parameters,
        description: f.description
      }));
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      for (let i = 0; i < maxChatCompletions; ++i) {
        const chatCompletion = await this._createChatCompletion(completions, {
          ...restParams,
          function_call,
          functions,
          messages: [...this.messages]
        }, options2);
        const message = chatCompletion.choices[0]?.message;
        if (!message) {
          throw new OpenAIError(`missing message in ChatCompletion response`);
        }
        if (!message.function_call)
          return;
        const { name, arguments: args } = message.function_call;
        const fn = functionsByName[name];
        if (!fn) {
          const content2 = `Invalid function_call: ${JSON.stringify(name)}. Available options are: ${functions.map((f) => JSON.stringify(f.name)).join(", ")}. Please try again`;
          this._addMessage({ role, name, content: content2 });
          continue;
        } else if (singleFunctionToCall && singleFunctionToCall !== name) {
          const content2 = `Invalid function_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
          this._addMessage({ role, name, content: content2 });
          continue;
        }
        let parsed;
        try {
          parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
        } catch (error) {
          this._addMessage({
            role,
            name,
            content: error instanceof Error ? error.message : String(error)
          });
          continue;
        }
        const rawContent = await fn.function(parsed, this);
        const content = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
        this._addMessage({ role, name, content });
        if (singleFunctionToCall)
          return;
      }
    }
    async _runTools(completions, params, options2) {
      const role = "tool";
      const { tool_choice = "auto", stream, ...restParams } = params;
      const singleFunctionToCall = typeof tool_choice !== "string" && tool_choice?.function?.name;
      const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options2 || {};
      const functionsByName = {};
      for (const f of params.tools) {
        if (f.type === "function") {
          functionsByName[f.function.name || f.function.function.name] = f.function;
        }
      }
      const tools = "tools" in params ? params.tools.map((t) => t.type === "function" ? {
        type: "function",
        function: {
          name: t.function.name || t.function.function.name,
          parameters: t.function.parameters,
          description: t.function.description
        }
      } : t) : void 0;
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      for (let i = 0; i < maxChatCompletions; ++i) {
        const chatCompletion = await this._createChatCompletion(completions, {
          ...restParams,
          tool_choice,
          tools,
          messages: [...this.messages]
        }, options2);
        const message = chatCompletion.choices[0]?.message;
        if (!message) {
          throw new OpenAIError(`missing message in ChatCompletion response`);
        }
        if (!message.tool_calls) {
          return;
        }
        for (const tool_call of message.tool_calls) {
          if (tool_call.type !== "function")
            continue;
          const tool_call_id = tool_call.id;
          const { name, arguments: args } = tool_call.function;
          const fn = functionsByName[name];
          if (!fn) {
            const content2 = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${tools.map((f) => JSON.stringify(f.function.name)).join(", ")}. Please try again`;
            this._addMessage({ role, tool_call_id, content: content2 });
            continue;
          } else if (singleFunctionToCall && singleFunctionToCall !== name) {
            const content2 = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
            this._addMessage({ role, tool_call_id, content: content2 });
            continue;
          }
          let parsed;
          try {
            parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
          } catch (error) {
            const content2 = error instanceof Error ? error.message : String(error);
            this._addMessage({ role, tool_call_id, content: content2 });
            continue;
          }
          const rawContent = await fn.function(parsed, this);
          const content = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
          this._addMessage({ role, tool_call_id, content });
          if (singleFunctionToCall) {
            return;
          }
        }
      }
      return;
    }
  };
  _AbstractChatCompletionRunner_connectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_endPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_listeners = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_ended = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_errored = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_aborted = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_handleError = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_instances = /* @__PURE__ */ new WeakSet(), _AbstractChatCompletionRunner_getFinalContent = function _AbstractChatCompletionRunner_getFinalContent2() {
    return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this).content ?? null;
  }, _AbstractChatCompletionRunner_getFinalMessage = function _AbstractChatCompletionRunner_getFinalMessage2() {
    let i = this.messages.length;
    while (i-- > 0) {
      const message = this.messages[i];
      if (isAssistantMessage(message)) {
        const { function_call, ...rest } = message;
        const ret = { ...rest, content: message.content ?? null };
        if (function_call) {
          ret.function_call = function_call;
        }
        return ret;
      }
    }
    throw new OpenAIError("stream ended without producing a ChatCompletionMessage with role=assistant");
  }, _AbstractChatCompletionRunner_getFinalFunctionCall = function _AbstractChatCompletionRunner_getFinalFunctionCall2() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i];
      if (isAssistantMessage(message) && message?.function_call) {
        return message.function_call;
      }
      if (isAssistantMessage(message) && message?.tool_calls?.length) {
        return message.tool_calls.at(-1)?.function;
      }
    }
    return;
  }, _AbstractChatCompletionRunner_getFinalFunctionCallResult = function _AbstractChatCompletionRunner_getFinalFunctionCallResult2() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i];
      if (isFunctionMessage(message) && message.content != null) {
        return message.content;
      }
      if (isToolMessage(message) && message.content != null && this.messages.some((x) => x.role === "assistant" && x.tool_calls?.some((y) => y.type === "function" && y.id === message.tool_call_id))) {
        return message.content;
      }
    }
    return;
  }, _AbstractChatCompletionRunner_calculateTotalUsage = function _AbstractChatCompletionRunner_calculateTotalUsage2() {
    const total = {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0
    };
    for (const { usage } of this._chatCompletions) {
      if (usage) {
        total.completion_tokens += usage.completion_tokens;
        total.prompt_tokens += usage.prompt_tokens;
        total.total_tokens += usage.total_tokens;
      }
    }
    return total;
  }, _AbstractChatCompletionRunner_validateParams = function _AbstractChatCompletionRunner_validateParams2(params) {
    if (params.n != null && params.n > 1) {
      throw new OpenAIError("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
    }
  }, _AbstractChatCompletionRunner_stringifyFunctionCallResult = function _AbstractChatCompletionRunner_stringifyFunctionCallResult2(rawContent) {
    return typeof rawContent === "string" ? rawContent : rawContent === void 0 ? "undefined" : JSON.stringify(rawContent);
  };

  // node_modules/openai/lib/ChatCompletionRunner.mjs
  var ChatCompletionRunner = class extends AbstractChatCompletionRunner {
    static runFunctions(completions, params, options2) {
      const runner = new ChatCompletionRunner();
      const opts = {
        ...options2,
        headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runFunctions" }
      };
      runner._run(() => runner._runFunctions(completions, params, opts));
      return runner;
    }
    static runTools(completions, params, options2) {
      const runner = new ChatCompletionRunner();
      const opts = {
        ...options2,
        headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runTools" }
      };
      runner._run(() => runner._runTools(completions, params, opts));
      return runner;
    }
    _addMessage(message) {
      super._addMessage(message);
      if (isAssistantMessage(message) && message.content) {
        this._emit("content", message.content);
      }
    }
  };

  // node_modules/openai/lib/ChatCompletionStream.mjs
  var __classPrivateFieldGet3 = function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet3 = function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _ChatCompletionStream_instances;
  var _ChatCompletionStream_currentChatCompletionSnapshot;
  var _ChatCompletionStream_beginRequest;
  var _ChatCompletionStream_addChunk;
  var _ChatCompletionStream_endRequest;
  var _ChatCompletionStream_accumulateChatCompletion;
  var ChatCompletionStream = class extends AbstractChatCompletionRunner {
    constructor() {
      super(...arguments);
      _ChatCompletionStream_instances.add(this);
      _ChatCompletionStream_currentChatCompletionSnapshot.set(this, void 0);
    }
    get currentChatCompletionSnapshot() {
      return __classPrivateFieldGet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
    }
    static fromReadableStream(stream) {
      const runner = new ChatCompletionStream();
      runner._run(() => runner._fromReadableStream(stream));
      return runner;
    }
    static createChatCompletion(completions, params, options2) {
      const runner = new ChatCompletionStream();
      runner._run(() => runner._runChatCompletion(completions, { ...params, stream: true }, { ...options2, headers: { ...options2?.headers, "X-Stainless-Helper-Method": "stream" } }));
      return runner;
    }
    async _createChatCompletion(completions, params, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
      const stream = await completions.create({ ...params, stream: true }, { ...options2, signal: this.controller.signal });
      this._connected();
      for await (const chunk of stream) {
        __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addChatCompletion(__classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
    }
    async _fromReadableStream(readableStream, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
      this._connected();
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      let chatId;
      for await (const chunk of stream) {
        if (chatId && chatId !== chunk.id) {
          this._addChatCompletion(__classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
        }
        __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
        chatId = chunk.id;
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addChatCompletion(__classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
    }
    [(_ChatCompletionStream_currentChatCompletionSnapshot = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_instances = /* @__PURE__ */ new WeakSet(), _ChatCompletionStream_beginRequest = function _ChatCompletionStream_beginRequest2() {
      if (this.ended)
        return;
      __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
    }, _ChatCompletionStream_addChunk = function _ChatCompletionStream_addChunk2(chunk) {
      if (this.ended)
        return;
      const completion = __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_accumulateChatCompletion).call(this, chunk);
      this._emit("chunk", chunk, completion);
      const delta = chunk.choices[0]?.delta?.content;
      const snapshot = completion.choices[0]?.message;
      if (delta != null && snapshot?.role === "assistant" && snapshot?.content) {
        this._emit("content", delta, snapshot.content);
      }
    }, _ChatCompletionStream_endRequest = function _ChatCompletionStream_endRequest2() {
      if (this.ended) {
        throw new OpenAIError(`stream has ended, this shouldn't happen`);
      }
      const snapshot = __classPrivateFieldGet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
      if (!snapshot) {
        throw new OpenAIError(`request ended without sending any chunks`);
      }
      __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
      return finalizeChatCompletion(snapshot);
    }, _ChatCompletionStream_accumulateChatCompletion = function _ChatCompletionStream_accumulateChatCompletion2(chunk) {
      var _a2, _b, _c;
      let snapshot = __classPrivateFieldGet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
      const { choices, ...rest } = chunk;
      if (!snapshot) {
        snapshot = __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, {
          ...rest,
          choices: []
        }, "f");
      } else {
        Object.assign(snapshot, rest);
      }
      for (const { delta, finish_reason, index, logprobs = null, ...other } of chunk.choices) {
        let choice = snapshot.choices[index];
        if (!choice) {
          choice = snapshot.choices[index] = { finish_reason, index, message: {}, logprobs, ...other };
        }
        if (logprobs) {
          if (!choice.logprobs) {
            choice.logprobs = Object.assign({}, logprobs);
          } else {
            const { content: content2, ...rest3 } = logprobs;
            Object.assign(choice.logprobs, rest3);
            if (content2) {
              (_a2 = choice.logprobs).content ?? (_a2.content = []);
              choice.logprobs.content.push(...content2);
            }
          }
        }
        if (finish_reason)
          choice.finish_reason = finish_reason;
        Object.assign(choice, other);
        if (!delta)
          continue;
        const { content, function_call, role, tool_calls, ...rest2 } = delta;
        Object.assign(choice.message, rest2);
        if (content)
          choice.message.content = (choice.message.content || "") + content;
        if (role)
          choice.message.role = role;
        if (function_call) {
          if (!choice.message.function_call) {
            choice.message.function_call = function_call;
          } else {
            if (function_call.name)
              choice.message.function_call.name = function_call.name;
            if (function_call.arguments) {
              (_b = choice.message.function_call).arguments ?? (_b.arguments = "");
              choice.message.function_call.arguments += function_call.arguments;
            }
          }
        }
        if (tool_calls) {
          if (!choice.message.tool_calls)
            choice.message.tool_calls = [];
          for (const { index: index2, id, type, function: fn, ...rest3 } of tool_calls) {
            const tool_call = (_c = choice.message.tool_calls)[index2] ?? (_c[index2] = {});
            Object.assign(tool_call, rest3);
            if (id)
              tool_call.id = id;
            if (type)
              tool_call.type = type;
            if (fn)
              tool_call.function ?? (tool_call.function = { arguments: "" });
            if (fn?.name)
              tool_call.function.name = fn.name;
            if (fn?.arguments)
              tool_call.function.arguments += fn.arguments;
          }
        }
      }
      return snapshot;
    }, Symbol.asyncIterator)]() {
      const pushQueue = [];
      const readQueue = [];
      let done = false;
      this.on("chunk", (chunk) => {
        const reader = readQueue.shift();
        if (reader) {
          reader.resolve(chunk);
        } else {
          pushQueue.push(chunk);
        }
      });
      this.on("end", () => {
        done = true;
        for (const reader of readQueue) {
          reader.resolve(void 0);
        }
        readQueue.length = 0;
      });
      this.on("abort", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      this.on("error", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      return {
        next: async () => {
          if (!pushQueue.length) {
            if (done) {
              return { value: void 0, done: true };
            }
            return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
          }
          const chunk = pushQueue.shift();
          return { value: chunk, done: false };
        },
        return: async () => {
          this.abort();
          return { value: void 0, done: true };
        }
      };
    }
    toReadableStream() {
      const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
      return stream.toReadableStream();
    }
  };
  function finalizeChatCompletion(snapshot) {
    const { id, choices, created, model, system_fingerprint, ...rest } = snapshot;
    return {
      ...rest,
      id,
      choices: choices.map(({ message, finish_reason, index, logprobs, ...choiceRest }) => {
        if (!finish_reason)
          throw new OpenAIError(`missing finish_reason for choice ${index}`);
        const { content = null, function_call, tool_calls, ...messageRest } = message;
        const role = message.role;
        if (!role)
          throw new OpenAIError(`missing role for choice ${index}`);
        if (function_call) {
          const { arguments: args, name } = function_call;
          if (args == null)
            throw new OpenAIError(`missing function_call.arguments for choice ${index}`);
          if (!name)
            throw new OpenAIError(`missing function_call.name for choice ${index}`);
          return {
            ...choiceRest,
            message: { content, function_call: { arguments: args, name }, role },
            finish_reason,
            index,
            logprobs
          };
        }
        if (tool_calls) {
          return {
            ...choiceRest,
            index,
            finish_reason,
            logprobs,
            message: {
              ...messageRest,
              role,
              content,
              tool_calls: tool_calls.map((tool_call, i) => {
                const { function: fn, type, id: id2, ...toolRest } = tool_call;
                const { arguments: args, name, ...fnRest } = fn || {};
                if (id2 == null)
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].id
${str(snapshot)}`);
                if (type == null)
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].type
${str(snapshot)}`);
                if (name == null)
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.name
${str(snapshot)}`);
                if (args == null)
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.arguments
${str(snapshot)}`);
                return { ...toolRest, id: id2, type, function: { ...fnRest, name, arguments: args } };
              })
            }
          };
        }
        return {
          ...choiceRest,
          message: { ...messageRest, content, role },
          finish_reason,
          index,
          logprobs
        };
      }),
      created,
      model,
      object: "chat.completion",
      ...system_fingerprint ? { system_fingerprint } : {}
    };
  }
  function str(x) {
    return JSON.stringify(x);
  }

  // node_modules/openai/lib/ChatCompletionStreamingRunner.mjs
  var ChatCompletionStreamingRunner = class extends ChatCompletionStream {
    static fromReadableStream(stream) {
      const runner = new ChatCompletionStreamingRunner();
      runner._run(() => runner._fromReadableStream(stream));
      return runner;
    }
    static runFunctions(completions, params, options2) {
      const runner = new ChatCompletionStreamingRunner();
      const opts = {
        ...options2,
        headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runFunctions" }
      };
      runner._run(() => runner._runFunctions(completions, params, opts));
      return runner;
    }
    static runTools(completions, params, options2) {
      const runner = new ChatCompletionStreamingRunner();
      const opts = {
        ...options2,
        headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runTools" }
      };
      runner._run(() => runner._runTools(completions, params, opts));
      return runner;
    }
  };

  // node_modules/openai/resources/beta/chat/completions.mjs
  var Completions2 = class extends APIResource {
    runFunctions(body, options2) {
      if (body.stream) {
        return ChatCompletionStreamingRunner.runFunctions(this._client.chat.completions, body, options2);
      }
      return ChatCompletionRunner.runFunctions(this._client.chat.completions, body, options2);
    }
    runTools(body, options2) {
      if (body.stream) {
        return ChatCompletionStreamingRunner.runTools(this._client.chat.completions, body, options2);
      }
      return ChatCompletionRunner.runTools(this._client.chat.completions, body, options2);
    }
    stream(body, options2) {
      return ChatCompletionStream.createChatCompletion(this._client.chat.completions, body, options2);
    }
  };

  // node_modules/openai/resources/beta/chat/chat.mjs
  var Chat2 = class extends APIResource {
    constructor() {
      super(...arguments);
      this.completions = new Completions2(this._client);
    }
  };
  (function(Chat3) {
    Chat3.Completions = Completions2;
  })(Chat2 || (Chat2 = {}));

  // node_modules/openai/lib/AbstractAssistantStreamRunner.mjs
  var __classPrivateFieldSet4 = function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet4 = function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _AbstractAssistantStreamRunner_connectedPromise;
  var _AbstractAssistantStreamRunner_resolveConnectedPromise;
  var _AbstractAssistantStreamRunner_rejectConnectedPromise;
  var _AbstractAssistantStreamRunner_endPromise;
  var _AbstractAssistantStreamRunner_resolveEndPromise;
  var _AbstractAssistantStreamRunner_rejectEndPromise;
  var _AbstractAssistantStreamRunner_listeners;
  var _AbstractAssistantStreamRunner_ended;
  var _AbstractAssistantStreamRunner_errored;
  var _AbstractAssistantStreamRunner_aborted;
  var _AbstractAssistantStreamRunner_catchingPromiseCreated;
  var _AbstractAssistantStreamRunner_handleError;
  var AbstractAssistantStreamRunner = class {
    constructor() {
      this.controller = new AbortController();
      _AbstractAssistantStreamRunner_connectedPromise.set(this, void 0);
      _AbstractAssistantStreamRunner_resolveConnectedPromise.set(this, () => {
      });
      _AbstractAssistantStreamRunner_rejectConnectedPromise.set(this, () => {
      });
      _AbstractAssistantStreamRunner_endPromise.set(this, void 0);
      _AbstractAssistantStreamRunner_resolveEndPromise.set(this, () => {
      });
      _AbstractAssistantStreamRunner_rejectEndPromise.set(this, () => {
      });
      _AbstractAssistantStreamRunner_listeners.set(this, {});
      _AbstractAssistantStreamRunner_ended.set(this, false);
      _AbstractAssistantStreamRunner_errored.set(this, false);
      _AbstractAssistantStreamRunner_aborted.set(this, false);
      _AbstractAssistantStreamRunner_catchingPromiseCreated.set(this, false);
      _AbstractAssistantStreamRunner_handleError.set(this, (error) => {
        __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_errored, true, "f");
        if (error instanceof Error && error.name === "AbortError") {
          error = new APIUserAbortError();
        }
        if (error instanceof APIUserAbortError) {
          __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_aborted, true, "f");
          return this._emit("abort", error);
        }
        if (error instanceof OpenAIError) {
          return this._emit("error", error);
        }
        if (error instanceof Error) {
          const openAIError = new OpenAIError(error.message);
          openAIError.cause = error;
          return this._emit("error", openAIError);
        }
        return this._emit("error", new OpenAIError(String(error)));
      });
      __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_connectedPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_resolveConnectedPromise, resolve, "f");
        __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_rejectConnectedPromise, reject, "f");
      }), "f");
      __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_endPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_resolveEndPromise, resolve, "f");
        __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_rejectEndPromise, reject, "f");
      }), "f");
      __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_connectedPromise, "f").catch(() => {
      });
      __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_endPromise, "f").catch(() => {
      });
    }
    _run(executor) {
      setTimeout(() => {
        executor().then(() => {
          this._emit("end");
        }, __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_handleError, "f"));
      }, 0);
    }
    _addRun(run) {
      return run;
    }
    _connected() {
      if (this.ended)
        return;
      __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_resolveConnectedPromise, "f").call(this);
      this._emit("connect");
    }
    get ended() {
      return __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_ended, "f");
    }
    get errored() {
      return __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_errored, "f");
    }
    get aborted() {
      return __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_aborted, "f");
    }
    abort() {
      this.controller.abort();
    }
    on(event, listener) {
      const listeners = __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_listeners, "f")[event] || (__classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_listeners, "f")[event] = []);
      listeners.push({ listener });
      return this;
    }
    off(event, listener) {
      const listeners = __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_listeners, "f")[event];
      if (!listeners)
        return this;
      const index = listeners.findIndex((l) => l.listener === listener);
      if (index >= 0)
        listeners.splice(index, 1);
      return this;
    }
    once(event, listener) {
      const listeners = __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_listeners, "f")[event] || (__classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_listeners, "f")[event] = []);
      listeners.push({ listener, once: true });
      return this;
    }
    emitted(event) {
      return new Promise((resolve, reject) => {
        __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_catchingPromiseCreated, true, "f");
        if (event !== "error")
          this.once("error", reject);
        this.once(event, resolve);
      });
    }
    async done() {
      __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_catchingPromiseCreated, true, "f");
      await __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_endPromise, "f");
    }
    _emit(event, ...args) {
      if (__classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_ended, "f")) {
        return;
      }
      if (event === "end") {
        __classPrivateFieldSet4(this, _AbstractAssistantStreamRunner_ended, true, "f");
        __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_resolveEndPromise, "f").call(this);
      }
      const listeners = __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_listeners, "f")[event];
      if (listeners) {
        __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_listeners, "f")[event] = listeners.filter((l) => !l.once);
        listeners.forEach(({ listener }) => listener(...args));
      }
      if (event === "abort") {
        const error = args[0];
        if (!__classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_catchingPromiseCreated, "f") && !listeners?.length) {
          Promise.reject(error);
        }
        __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_rejectConnectedPromise, "f").call(this, error);
        __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_rejectEndPromise, "f").call(this, error);
        this._emit("end");
        return;
      }
      if (event === "error") {
        const error = args[0];
        if (!__classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_catchingPromiseCreated, "f") && !listeners?.length) {
          Promise.reject(error);
        }
        __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_rejectConnectedPromise, "f").call(this, error);
        __classPrivateFieldGet4(this, _AbstractAssistantStreamRunner_rejectEndPromise, "f").call(this, error);
        this._emit("end");
      }
    }
    async _threadAssistantStream(body, thread, options2) {
      return await this._createThreadAssistantStream(thread, body, options2);
    }
    async _runAssistantStream(threadId, runs, params, options2) {
      return await this._createAssistantStream(runs, threadId, params, options2);
    }
    async _runToolAssistantStream(threadId, runId, runs, params, options2) {
      return await this._createToolAssistantStream(runs, threadId, runId, params, options2);
    }
    async _createThreadAssistantStream(thread, body, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const runResult = await thread.createAndRun({ ...body, stream: false }, { ...options2, signal: this.controller.signal });
      this._connected();
      return this._addRun(runResult);
    }
    async _createToolAssistantStream(run, threadId, runId, params, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const runResult = await run.submitToolOutputs(threadId, runId, { ...params, stream: false }, { ...options2, signal: this.controller.signal });
      this._connected();
      return this._addRun(runResult);
    }
    async _createAssistantStream(run, threadId, params, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const runResult = await run.create(threadId, { ...params, stream: false }, { ...options2, signal: this.controller.signal });
      this._connected();
      return this._addRun(runResult);
    }
  };
  _AbstractAssistantStreamRunner_connectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_endPromise = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_listeners = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_ended = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_errored = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_aborted = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _AbstractAssistantStreamRunner_handleError = /* @__PURE__ */ new WeakMap();

  // node_modules/openai/lib/AssistantStream.mjs
  var __classPrivateFieldGet5 = function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet5 = function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _AssistantStream_instances;
  var _AssistantStream_events;
  var _AssistantStream_runStepSnapshots;
  var _AssistantStream_messageSnapshots;
  var _AssistantStream_messageSnapshot;
  var _AssistantStream_finalRun;
  var _AssistantStream_currentContentIndex;
  var _AssistantStream_currentContent;
  var _AssistantStream_currentToolCallIndex;
  var _AssistantStream_currentToolCall;
  var _AssistantStream_currentEvent;
  var _AssistantStream_currentRunSnapshot;
  var _AssistantStream_currentRunStepSnapshot;
  var _AssistantStream_addEvent;
  var _AssistantStream_endRequest;
  var _AssistantStream_handleMessage;
  var _AssistantStream_handleRunStep;
  var _AssistantStream_handleEvent;
  var _AssistantStream_accumulateRunStep;
  var _AssistantStream_accumulateMessage;
  var _AssistantStream_accumulateContent;
  var _AssistantStream_handleRun;
  var AssistantStream = class extends AbstractAssistantStreamRunner {
    constructor() {
      super(...arguments);
      _AssistantStream_instances.add(this);
      _AssistantStream_events.set(this, []);
      _AssistantStream_runStepSnapshots.set(this, {});
      _AssistantStream_messageSnapshots.set(this, {});
      _AssistantStream_messageSnapshot.set(this, void 0);
      _AssistantStream_finalRun.set(this, void 0);
      _AssistantStream_currentContentIndex.set(this, void 0);
      _AssistantStream_currentContent.set(this, void 0);
      _AssistantStream_currentToolCallIndex.set(this, void 0);
      _AssistantStream_currentToolCall.set(this, void 0);
      _AssistantStream_currentEvent.set(this, void 0);
      _AssistantStream_currentRunSnapshot.set(this, void 0);
      _AssistantStream_currentRunStepSnapshot.set(this, void 0);
    }
    [(_AssistantStream_events = /* @__PURE__ */ new WeakMap(), _AssistantStream_runStepSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_finalRun = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContentIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCallIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCall = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentEvent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunStepSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
      const pushQueue = [];
      const readQueue = [];
      let done = false;
      this.on("event", (event) => {
        const reader = readQueue.shift();
        if (reader) {
          reader.resolve(event);
        } else {
          pushQueue.push(event);
        }
      });
      this.on("end", () => {
        done = true;
        for (const reader of readQueue) {
          reader.resolve(void 0);
        }
        readQueue.length = 0;
      });
      this.on("abort", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      this.on("error", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      return {
        next: async () => {
          if (!pushQueue.length) {
            if (done) {
              return { value: void 0, done: true };
            }
            return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
          }
          const chunk = pushQueue.shift();
          return { value: chunk, done: false };
        },
        return: async () => {
          this.abort();
          return { value: void 0, done: true };
        }
      };
    }
    static fromReadableStream(stream) {
      const runner = new AssistantStream();
      runner._run(() => runner._fromReadableStream(stream));
      return runner;
    }
    async _fromReadableStream(readableStream, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      this._connected();
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      for await (const event of stream) {
        __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    toReadableStream() {
      const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
      return stream.toReadableStream();
    }
    static createToolAssistantStream(threadId, runId, runs, body, options2) {
      const runner = new AssistantStream();
      runner._run(() => runner._runToolAssistantStream(threadId, runId, runs, body, {
        ...options2,
        headers: { ...options2?.headers, "X-Stainless-Helper-Method": "stream" }
      }));
      return runner;
    }
    async _createToolAssistantStream(run, threadId, runId, params, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = { ...params, stream: true };
      const stream = await run.submitToolOutputs(threadId, runId, body, {
        ...options2,
        signal: this.controller.signal
      });
      this._connected();
      for await (const event of stream) {
        __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    static createThreadAssistantStream(body, thread, options2) {
      const runner = new AssistantStream();
      runner._run(() => runner._threadAssistantStream(body, thread, {
        ...options2,
        headers: { ...options2?.headers, "X-Stainless-Helper-Method": "stream" }
      }));
      return runner;
    }
    static createAssistantStream(threadId, runs, params, options2) {
      const runner = new AssistantStream();
      runner._run(() => runner._runAssistantStream(threadId, runs, params, {
        ...options2,
        headers: { ...options2?.headers, "X-Stainless-Helper-Method": "stream" }
      }));
      return runner;
    }
    currentEvent() {
      return __classPrivateFieldGet5(this, _AssistantStream_currentEvent, "f");
    }
    currentRun() {
      return __classPrivateFieldGet5(this, _AssistantStream_currentRunSnapshot, "f");
    }
    currentMessageSnapshot() {
      return __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f");
    }
    currentRunStepSnapshot() {
      return __classPrivateFieldGet5(this, _AssistantStream_currentRunStepSnapshot, "f");
    }
    async finalRunSteps() {
      await this.done();
      return Object.values(__classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f"));
    }
    async finalMessages() {
      await this.done();
      return Object.values(__classPrivateFieldGet5(this, _AssistantStream_messageSnapshots, "f"));
    }
    async finalRun() {
      await this.done();
      if (!__classPrivateFieldGet5(this, _AssistantStream_finalRun, "f"))
        throw Error("Final run was not received.");
      return __classPrivateFieldGet5(this, _AssistantStream_finalRun, "f");
    }
    async _createThreadAssistantStream(thread, params, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = { ...params, stream: true };
      const stream = await thread.createAndRun(body, { ...options2, signal: this.controller.signal });
      this._connected();
      for await (const event of stream) {
        __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    async _createAssistantStream(run, threadId, params, options2) {
      const signal = options2?.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = { ...params, stream: true };
      const stream = await run.create(threadId, body, { ...options2, signal: this.controller.signal });
      this._connected();
      for await (const event of stream) {
        __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if (stream.controller.signal?.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    static accumulateDelta(acc, delta) {
      for (const [key, deltaValue] of Object.entries(delta)) {
        if (!acc.hasOwnProperty(key)) {
          acc[key] = deltaValue;
          continue;
        }
        let accValue = acc[key];
        if (accValue === null || accValue === void 0) {
          acc[key] = deltaValue;
          continue;
        }
        if (key === "index" || key === "type") {
          acc[key] = deltaValue;
          continue;
        }
        if (typeof accValue === "string" && typeof deltaValue === "string") {
          accValue += deltaValue;
        } else if (typeof accValue === "number" && typeof deltaValue === "number") {
          accValue += deltaValue;
        } else if (isObj(accValue) && isObj(deltaValue)) {
          accValue = this.accumulateDelta(accValue, deltaValue);
        } else if (Array.isArray(accValue) && Array.isArray(deltaValue)) {
          if (accValue.every((x) => typeof x === "string" || typeof x === "number")) {
            accValue.push(...deltaValue);
            continue;
          }
        } else {
          throw Error(`Unhandled record type: ${key}, deltaValue: ${deltaValue}, accValue: ${accValue}`);
        }
        acc[key] = accValue;
      }
      return acc;
    }
  };
  _AssistantStream_addEvent = function _AssistantStream_addEvent2(event) {
    if (this.ended)
      return;
    __classPrivateFieldSet5(this, _AssistantStream_currentEvent, event, "f");
    __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleEvent).call(this, event);
    switch (event.event) {
      case "thread.created":
        break;
      case "thread.run.created":
      case "thread.run.queued":
      case "thread.run.in_progress":
      case "thread.run.requires_action":
      case "thread.run.completed":
      case "thread.run.failed":
      case "thread.run.cancelling":
      case "thread.run.cancelled":
      case "thread.run.expired":
        __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleRun).call(this, event);
        break;
      case "thread.run.step.created":
      case "thread.run.step.in_progress":
      case "thread.run.step.delta":
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
        __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleRunStep).call(this, event);
        break;
      case "thread.message.created":
      case "thread.message.in_progress":
      case "thread.message.delta":
      case "thread.message.completed":
      case "thread.message.incomplete":
        __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_handleMessage).call(this, event);
        break;
      case "error":
        throw new Error("Encountered an error event in event processing - errors should be processed earlier");
    }
  }, _AssistantStream_endRequest = function _AssistantStream_endRequest2() {
    if (this.ended) {
      throw new OpenAIError(`stream has ended, this shouldn't happen`);
    }
    if (!__classPrivateFieldGet5(this, _AssistantStream_finalRun, "f"))
      throw Error("Final run has not been received");
    return __classPrivateFieldGet5(this, _AssistantStream_finalRun, "f");
  }, _AssistantStream_handleMessage = function _AssistantStream_handleMessage2(event) {
    const [accumulatedMessage, newContent] = __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_accumulateMessage).call(this, event, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
    __classPrivateFieldSet5(this, _AssistantStream_messageSnapshot, accumulatedMessage, "f");
    __classPrivateFieldGet5(this, _AssistantStream_messageSnapshots, "f")[accumulatedMessage.id] = accumulatedMessage;
    for (const content of newContent) {
      const snapshotContent = accumulatedMessage.content[content.index];
      if (snapshotContent?.type == "text") {
        this._emit("textCreated", snapshotContent.text);
      }
    }
    switch (event.event) {
      case "thread.message.created":
        this._emit("messageCreated", event.data);
        break;
      case "thread.message.in_progress":
        break;
      case "thread.message.delta":
        this._emit("messageDelta", event.data.delta, accumulatedMessage);
        if (event.data.delta.content) {
          for (const content of event.data.delta.content) {
            if (content.type == "text" && content.text) {
              let textDelta = content.text;
              let snapshot = accumulatedMessage.content[content.index];
              if (snapshot && snapshot.type == "text") {
                this._emit("textDelta", textDelta, snapshot.text);
              } else {
                throw Error("The snapshot associated with this text delta is not text or missing");
              }
            }
            if (content.index != __classPrivateFieldGet5(this, _AssistantStream_currentContentIndex, "f")) {
              if (__classPrivateFieldGet5(this, _AssistantStream_currentContent, "f")) {
                switch (__classPrivateFieldGet5(this, _AssistantStream_currentContent, "f").type) {
                  case "text":
                    this._emit("textDone", __classPrivateFieldGet5(this, _AssistantStream_currentContent, "f").text, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
                    break;
                  case "image_file":
                    this._emit("imageFileDone", __classPrivateFieldGet5(this, _AssistantStream_currentContent, "f").image_file, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
                    break;
                }
              }
              __classPrivateFieldSet5(this, _AssistantStream_currentContentIndex, content.index, "f");
            }
            __classPrivateFieldSet5(this, _AssistantStream_currentContent, accumulatedMessage.content[content.index], "f");
          }
        }
        break;
      case "thread.message.completed":
      case "thread.message.incomplete":
        if (__classPrivateFieldGet5(this, _AssistantStream_currentContentIndex, "f") !== void 0) {
          const currentContent = event.data.content[__classPrivateFieldGet5(this, _AssistantStream_currentContentIndex, "f")];
          if (currentContent) {
            switch (currentContent.type) {
              case "image_file":
                this._emit("imageFileDone", currentContent.image_file, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
                break;
              case "text":
                this._emit("textDone", currentContent.text, __classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f"));
                break;
            }
          }
        }
        if (__classPrivateFieldGet5(this, _AssistantStream_messageSnapshot, "f")) {
          this._emit("messageDone", event.data);
        }
        __classPrivateFieldSet5(this, _AssistantStream_messageSnapshot, void 0, "f");
    }
  }, _AssistantStream_handleRunStep = function _AssistantStream_handleRunStep2(event) {
    const accumulatedRunStep = __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_accumulateRunStep).call(this, event);
    __classPrivateFieldSet5(this, _AssistantStream_currentRunStepSnapshot, accumulatedRunStep, "f");
    switch (event.event) {
      case "thread.run.step.created":
        this._emit("runStepCreated", event.data);
        break;
      case "thread.run.step.delta":
        const delta = event.data.delta;
        if (delta.step_details && delta.step_details.type == "tool_calls" && delta.step_details.tool_calls && accumulatedRunStep.step_details.type == "tool_calls") {
          for (const toolCall of delta.step_details.tool_calls) {
            if (toolCall.index == __classPrivateFieldGet5(this, _AssistantStream_currentToolCallIndex, "f")) {
              this._emit("toolCallDelta", toolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index]);
            } else {
              if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f")) {
                this._emit("toolCallDone", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
              }
              __classPrivateFieldSet5(this, _AssistantStream_currentToolCallIndex, toolCall.index, "f");
              __classPrivateFieldSet5(this, _AssistantStream_currentToolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index], "f");
              if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"))
                this._emit("toolCallCreated", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
            }
          }
        }
        this._emit("runStepDelta", event.data.delta, accumulatedRunStep);
        break;
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
        __classPrivateFieldSet5(this, _AssistantStream_currentRunStepSnapshot, void 0, "f");
        const details = event.data.step_details;
        if (details.type == "tool_calls") {
          if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f")) {
            this._emit("toolCallDone", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
            __classPrivateFieldSet5(this, _AssistantStream_currentToolCall, void 0, "f");
          }
        }
        this._emit("runStepDone", event.data, accumulatedRunStep);
        break;
      case "thread.run.step.in_progress":
        break;
    }
  }, _AssistantStream_handleEvent = function _AssistantStream_handleEvent2(event) {
    __classPrivateFieldGet5(this, _AssistantStream_events, "f").push(event);
    this._emit("event", event);
  }, _AssistantStream_accumulateRunStep = function _AssistantStream_accumulateRunStep2(event) {
    switch (event.event) {
      case "thread.run.step.created":
        __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
        return event.data;
      case "thread.run.step.delta":
        let snapshot = __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
        if (!snapshot) {
          throw Error("Received a RunStepDelta before creation of a snapshot");
        }
        let data = event.data;
        if (data.delta) {
          const accumulated = AssistantStream.accumulateDelta(snapshot, data.delta);
          __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = accumulated;
        }
        return __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
      case "thread.run.step.in_progress":
        __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
        break;
    }
    if (__classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id])
      return __classPrivateFieldGet5(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
    throw new Error("No snapshot available");
  }, _AssistantStream_accumulateMessage = function _AssistantStream_accumulateMessage2(event, snapshot) {
    let newContent = [];
    switch (event.event) {
      case "thread.message.created":
        return [event.data, newContent];
      case "thread.message.delta":
        if (!snapshot) {
          throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
        }
        let data = event.data;
        if (data.delta.content) {
          for (const contentElement of data.delta.content) {
            if (contentElement.index in snapshot.content) {
              let currentContent = snapshot.content[contentElement.index];
              snapshot.content[contentElement.index] = __classPrivateFieldGet5(this, _AssistantStream_instances, "m", _AssistantStream_accumulateContent).call(this, contentElement, currentContent);
            } else {
              snapshot.content[contentElement.index] = contentElement;
              newContent.push(contentElement);
            }
          }
        }
        return [snapshot, newContent];
      case "thread.message.in_progress":
      case "thread.message.completed":
      case "thread.message.incomplete":
        if (snapshot) {
          return [snapshot, newContent];
        } else {
          throw Error("Received thread message event with no existing snapshot");
        }
    }
    throw Error("Tried to accumulate a non-message event");
  }, _AssistantStream_accumulateContent = function _AssistantStream_accumulateContent2(contentElement, currentContent) {
    return AssistantStream.accumulateDelta(currentContent, contentElement);
  }, _AssistantStream_handleRun = function _AssistantStream_handleRun2(event) {
    __classPrivateFieldSet5(this, _AssistantStream_currentRunSnapshot, event.data, "f");
    switch (event.event) {
      case "thread.run.created":
        break;
      case "thread.run.queued":
        break;
      case "thread.run.in_progress":
        break;
      case "thread.run.requires_action":
      case "thread.run.cancelled":
      case "thread.run.failed":
      case "thread.run.completed":
      case "thread.run.expired":
        __classPrivateFieldSet5(this, _AssistantStream_finalRun, event.data, "f");
        if (__classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f")) {
          this._emit("toolCallDone", __classPrivateFieldGet5(this, _AssistantStream_currentToolCall, "f"));
          __classPrivateFieldSet5(this, _AssistantStream_currentToolCall, void 0, "f");
        }
        break;
      case "thread.run.cancelling":
        break;
    }
  };

  // node_modules/openai/resources/beta/threads/messages.mjs
  var Messages = class extends APIResource {
    create(threadId, body, options2) {
      return this._client.post(`/threads/${threadId}/messages`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    retrieve(threadId, messageId, options2) {
      return this._client.get(`/threads/${threadId}/messages/${messageId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    update(threadId, messageId, body, options2) {
      return this._client.post(`/threads/${threadId}/messages/${messageId}`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    list(threadId, query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list(threadId, {}, query);
      }
      return this._client.getAPIList(`/threads/${threadId}/messages`, MessagesPage, {
        query,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    del(threadId, messageId, options2) {
      return this._client.delete(`/threads/${threadId}/messages/${messageId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
  };
  var MessagesPage = class extends CursorPage {
  };
  (function(Messages2) {
    Messages2.MessagesPage = MessagesPage;
  })(Messages || (Messages = {}));

  // node_modules/openai/resources/beta/threads/runs/steps.mjs
  var Steps = class extends APIResource {
    retrieve(threadId, runId, stepId, options2) {
      return this._client.get(`/threads/${threadId}/runs/${runId}/steps/${stepId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    list(threadId, runId, query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list(threadId, runId, {}, query);
      }
      return this._client.getAPIList(`/threads/${threadId}/runs/${runId}/steps`, RunStepsPage, {
        query,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
  };
  var RunStepsPage = class extends CursorPage {
  };
  (function(Steps2) {
    Steps2.RunStepsPage = RunStepsPage;
  })(Steps || (Steps = {}));

  // node_modules/openai/resources/beta/threads/runs/runs.mjs
  var Runs = class extends APIResource {
    constructor() {
      super(...arguments);
      this.steps = new Steps(this._client);
    }
    create(threadId, body, options2) {
      return this._client.post(`/threads/${threadId}/runs`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers },
        stream: body.stream ?? false
      });
    }
    retrieve(threadId, runId, options2) {
      return this._client.get(`/threads/${threadId}/runs/${runId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    update(threadId, runId, body, options2) {
      return this._client.post(`/threads/${threadId}/runs/${runId}`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    list(threadId, query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list(threadId, {}, query);
      }
      return this._client.getAPIList(`/threads/${threadId}/runs`, RunsPage, {
        query,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    cancel(threadId, runId, options2) {
      return this._client.post(`/threads/${threadId}/runs/${runId}/cancel`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    async createAndPoll(threadId, body, options2) {
      const run = await this.create(threadId, body, options2);
      return await this.poll(threadId, run.id, options2);
    }
    createAndStream(threadId, body, options2) {
      return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options2);
    }
    async poll(threadId, runId, options2) {
      const headers = { ...options2?.headers, "X-Stainless-Poll-Helper": "true" };
      if (options2?.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options2.pollIntervalMs.toString();
      }
      while (true) {
        const { data: run, response } = await this.retrieve(threadId, runId, {
          ...options2,
          headers: { ...options2?.headers, ...headers }
        }).withResponse();
        switch (run.status) {
          case "queued":
          case "in_progress":
          case "cancelling":
            let sleepInterval = 5e3;
            if (options2?.pollIntervalMs) {
              sleepInterval = options2.pollIntervalMs;
            } else {
              const headerInterval = response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            await sleep(sleepInterval);
            break;
          case "requires_action":
          case "incomplete":
          case "cancelled":
          case "completed":
          case "failed":
          case "expired":
            return run;
        }
      }
    }
    stream(threadId, body, options2) {
      return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options2);
    }
    submitToolOutputs(threadId, runId, body, options2) {
      return this._client.post(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers },
        stream: body.stream ?? false
      });
    }
    async submitToolOutputsAndPoll(threadId, runId, body, options2) {
      const run = await this.submitToolOutputs(threadId, runId, body, options2);
      return await this.poll(threadId, run.id, options2);
    }
    submitToolOutputsStream(threadId, runId, body, options2) {
      return AssistantStream.createToolAssistantStream(threadId, runId, this._client.beta.threads.runs, body, options2);
    }
  };
  var RunsPage = class extends CursorPage {
  };
  (function(Runs2) {
    Runs2.RunsPage = RunsPage;
    Runs2.Steps = Steps;
    Runs2.RunStepsPage = RunStepsPage;
  })(Runs || (Runs = {}));

  // node_modules/openai/resources/beta/threads/threads.mjs
  var Threads = class extends APIResource {
    constructor() {
      super(...arguments);
      this.runs = new Runs(this._client);
      this.messages = new Messages(this._client);
    }
    create(body = {}, options2) {
      if (isRequestOptions(body)) {
        return this.create({}, body);
      }
      return this._client.post("/threads", {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    retrieve(threadId, options2) {
      return this._client.get(`/threads/${threadId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    update(threadId, body, options2) {
      return this._client.post(`/threads/${threadId}`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    del(threadId, options2) {
      return this._client.delete(`/threads/${threadId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    createAndRun(body, options2) {
      return this._client.post("/threads/runs", {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers },
        stream: body.stream ?? false
      });
    }
    async createAndRunPoll(body, options2) {
      const run = await this.createAndRun(body, options2);
      return await this.runs.poll(run.thread_id, run.id, options2);
    }
    createAndRunStream(body, options2) {
      return AssistantStream.createThreadAssistantStream(body, this._client.beta.threads, options2);
    }
  };
  (function(Threads2) {
    Threads2.Runs = Runs;
    Threads2.RunsPage = RunsPage;
    Threads2.Messages = Messages;
    Threads2.MessagesPage = MessagesPage;
  })(Threads || (Threads = {}));

  // node_modules/openai/lib/Util.mjs
  var allSettledWithThrow = async (promises) => {
    const results = await Promise.allSettled(promises);
    const rejected = results.filter((result) => result.status === "rejected");
    if (rejected.length) {
      for (const result of rejected) {
        console.error(result.reason);
      }
      throw new Error(`${rejected.length} promise(s) failed - see the above errors`);
    }
    const values = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        values.push(result.value);
      }
    }
    return values;
  };

  // node_modules/openai/resources/beta/vector-stores/files.mjs
  var Files = class extends APIResource {
    create(vectorStoreId, body, options2) {
      return this._client.post(`/vector_stores/${vectorStoreId}/files`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    retrieve(vectorStoreId, fileId, options2) {
      return this._client.get(`/vector_stores/${vectorStoreId}/files/${fileId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    list(vectorStoreId, query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list(vectorStoreId, {}, query);
      }
      return this._client.getAPIList(`/vector_stores/${vectorStoreId}/files`, VectorStoreFilesPage, {
        query,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    del(vectorStoreId, fileId, options2) {
      return this._client.delete(`/vector_stores/${vectorStoreId}/files/${fileId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    async createAndPoll(vectorStoreId, body, options2) {
      const file = await this.create(vectorStoreId, body, options2);
      return await this.poll(vectorStoreId, file.id, options2);
    }
    async poll(vectorStoreId, fileId, options2) {
      const headers = { ...options2?.headers, "X-Stainless-Poll-Helper": "true" };
      if (options2?.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options2.pollIntervalMs.toString();
      }
      while (true) {
        const fileResponse = await this.retrieve(vectorStoreId, fileId, {
          ...options2,
          headers
        }).withResponse();
        const file = fileResponse.data;
        switch (file.status) {
          case "in_progress":
            let sleepInterval = 5e3;
            if (options2?.pollIntervalMs) {
              sleepInterval = options2.pollIntervalMs;
            } else {
              const headerInterval = fileResponse.response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            await sleep(sleepInterval);
            break;
          case "failed":
          case "completed":
            return file;
        }
      }
    }
    async upload(vectorStoreId, file, options2) {
      const fileInfo = await this._client.files.create({ file, purpose: "assistants" }, options2);
      return this.create(vectorStoreId, { file_id: fileInfo.id }, options2);
    }
    async uploadAndPoll(vectorStoreId, file, options2) {
      const fileInfo = await this.upload(vectorStoreId, file, options2);
      return await this.poll(vectorStoreId, fileInfo.id, options2);
    }
  };
  var VectorStoreFilesPage = class extends CursorPage {
  };
  (function(Files3) {
    Files3.VectorStoreFilesPage = VectorStoreFilesPage;
  })(Files || (Files = {}));

  // node_modules/openai/resources/beta/vector-stores/file-batches.mjs
  var FileBatches = class extends APIResource {
    create(vectorStoreId, body, options2) {
      return this._client.post(`/vector_stores/${vectorStoreId}/file_batches`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    retrieve(vectorStoreId, batchId, options2) {
      return this._client.get(`/vector_stores/${vectorStoreId}/file_batches/${batchId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    cancel(vectorStoreId, batchId, options2) {
      return this._client.post(`/vector_stores/${vectorStoreId}/file_batches/${batchId}/cancel`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    async createAndPoll(vectorStoreId, body, options2) {
      const batch = await this.create(vectorStoreId, body);
      return await this.poll(vectorStoreId, batch.id, options2);
    }
    listFiles(vectorStoreId, batchId, query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.listFiles(vectorStoreId, batchId, {}, query);
      }
      return this._client.getAPIList(`/vector_stores/${vectorStoreId}/file_batches/${batchId}/files`, VectorStoreFilesPage, { query, ...options2, headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers } });
    }
    async poll(vectorStoreId, batchId, options2) {
      const headers = { ...options2?.headers, "X-Stainless-Poll-Helper": "true" };
      if (options2?.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options2.pollIntervalMs.toString();
      }
      while (true) {
        const { data: batch, response } = await this.retrieve(vectorStoreId, batchId, {
          ...options2,
          headers
        }).withResponse();
        switch (batch.status) {
          case "in_progress":
            let sleepInterval = 5e3;
            if (options2?.pollIntervalMs) {
              sleepInterval = options2.pollIntervalMs;
            } else {
              const headerInterval = response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            await sleep(sleepInterval);
            break;
          case "failed":
          case "cancelled":
          case "completed":
            return batch;
        }
      }
    }
    async uploadAndPoll(vectorStoreId, { files, fileIds = [] }, options2) {
      if (files === null || files.length == 0) {
        throw new Error("No files provided to process.");
      }
      const configuredConcurrency = options2?.maxConcurrency ?? 5;
      const concurrencyLimit = Math.min(configuredConcurrency, files.length);
      const client = this._client;
      const fileIterator = files.values();
      const allFileIds = [...fileIds];
      async function processFiles(iterator) {
        for (let item of iterator) {
          const fileObj = await client.files.create({ file: item, purpose: "assistants" }, options2);
          allFileIds.push(fileObj.id);
        }
      }
      const workers = Array(concurrencyLimit).fill(fileIterator).map(processFiles);
      await allSettledWithThrow(workers);
      return await this.createAndPoll(vectorStoreId, {
        file_ids: allFileIds
      });
    }
  };
  (function(FileBatches2) {
  })(FileBatches || (FileBatches = {}));

  // node_modules/openai/resources/beta/vector-stores/vector-stores.mjs
  var VectorStores = class extends APIResource {
    constructor() {
      super(...arguments);
      this.files = new Files(this._client);
      this.fileBatches = new FileBatches(this._client);
    }
    create(body, options2) {
      return this._client.post("/vector_stores", {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    retrieve(vectorStoreId, options2) {
      return this._client.get(`/vector_stores/${vectorStoreId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    update(vectorStoreId, body, options2) {
      return this._client.post(`/vector_stores/${vectorStoreId}`, {
        body,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    list(query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/vector_stores", VectorStoresPage, {
        query,
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
    del(vectorStoreId, options2) {
      return this._client.delete(`/vector_stores/${vectorStoreId}`, {
        ...options2,
        headers: { "OpenAI-Beta": "assistants=v2", ...options2?.headers }
      });
    }
  };
  var VectorStoresPage = class extends CursorPage {
  };
  (function(VectorStores2) {
    VectorStores2.VectorStoresPage = VectorStoresPage;
    VectorStores2.Files = Files;
    VectorStores2.VectorStoreFilesPage = VectorStoreFilesPage;
    VectorStores2.FileBatches = FileBatches;
  })(VectorStores || (VectorStores = {}));

  // node_modules/openai/resources/beta/beta.mjs
  var Beta = class extends APIResource {
    constructor() {
      super(...arguments);
      this.vectorStores = new VectorStores(this._client);
      this.chat = new Chat2(this._client);
      this.assistants = new Assistants(this._client);
      this.threads = new Threads(this._client);
    }
  };
  (function(Beta2) {
    Beta2.VectorStores = VectorStores;
    Beta2.VectorStoresPage = VectorStoresPage;
    Beta2.Chat = Chat2;
    Beta2.Assistants = Assistants;
    Beta2.AssistantsPage = AssistantsPage;
    Beta2.Threads = Threads;
  })(Beta || (Beta = {}));

  // node_modules/openai/resources/completions.mjs
  var Completions3 = class extends APIResource {
    create(body, options2) {
      return this._client.post("/completions", { body, ...options2, stream: body.stream ?? false });
    }
  };
  (function(Completions4) {
  })(Completions3 || (Completions3 = {}));

  // node_modules/openai/resources/embeddings.mjs
  var Embeddings = class extends APIResource {
    create(body, options2) {
      return this._client.post("/embeddings", { body, ...options2 });
    }
  };
  (function(Embeddings2) {
  })(Embeddings || (Embeddings = {}));

  // node_modules/openai/resources/files.mjs
  var Files2 = class extends APIResource {
    create(body, options2) {
      return this._client.post("/files", multipartFormRequestOptions({ body, ...options2 }));
    }
    retrieve(fileId, options2) {
      return this._client.get(`/files/${fileId}`, options2);
    }
    list(query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/files", FileObjectsPage, { query, ...options2 });
    }
    del(fileId, options2) {
      return this._client.delete(`/files/${fileId}`, options2);
    }
    content(fileId, options2) {
      return this._client.get(`/files/${fileId}/content`, { ...options2, __binaryResponse: true });
    }
    retrieveContent(fileId, options2) {
      return this._client.get(`/files/${fileId}/content`, {
        ...options2,
        headers: { Accept: "application/json", ...options2?.headers }
      });
    }
    async waitForProcessing(id, { pollInterval = 5e3, maxWait = 30 * 60 * 1e3 } = {}) {
      const TERMINAL_STATES = /* @__PURE__ */ new Set(["processed", "error", "deleted"]);
      const start = Date.now();
      let file = await this.retrieve(id);
      while (!file.status || !TERMINAL_STATES.has(file.status)) {
        await sleep(pollInterval);
        file = await this.retrieve(id);
        if (Date.now() - start > maxWait) {
          throw new APIConnectionTimeoutError({
            message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.`
          });
        }
      }
      return file;
    }
  };
  var FileObjectsPage = class extends Page {
  };
  (function(Files3) {
    Files3.FileObjectsPage = FileObjectsPage;
  })(Files2 || (Files2 = {}));

  // node_modules/openai/resources/fine-tuning/jobs/checkpoints.mjs
  var Checkpoints = class extends APIResource {
    list(fineTuningJobId, query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list(fineTuningJobId, {}, query);
      }
      return this._client.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/checkpoints`, FineTuningJobCheckpointsPage, { query, ...options2 });
    }
  };
  var FineTuningJobCheckpointsPage = class extends CursorPage {
  };
  (function(Checkpoints2) {
    Checkpoints2.FineTuningJobCheckpointsPage = FineTuningJobCheckpointsPage;
  })(Checkpoints || (Checkpoints = {}));

  // node_modules/openai/resources/fine-tuning/jobs/jobs.mjs
  var Jobs = class extends APIResource {
    constructor() {
      super(...arguments);
      this.checkpoints = new Checkpoints(this._client);
    }
    create(body, options2) {
      return this._client.post("/fine_tuning/jobs", { body, ...options2 });
    }
    retrieve(fineTuningJobId, options2) {
      return this._client.get(`/fine_tuning/jobs/${fineTuningJobId}`, options2);
    }
    list(query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/fine_tuning/jobs", FineTuningJobsPage, { query, ...options2 });
    }
    cancel(fineTuningJobId, options2) {
      return this._client.post(`/fine_tuning/jobs/${fineTuningJobId}/cancel`, options2);
    }
    listEvents(fineTuningJobId, query = {}, options2) {
      if (isRequestOptions(query)) {
        return this.listEvents(fineTuningJobId, {}, query);
      }
      return this._client.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/events`, FineTuningJobEventsPage, {
        query,
        ...options2
      });
    }
  };
  var FineTuningJobsPage = class extends CursorPage {
  };
  var FineTuningJobEventsPage = class extends CursorPage {
  };
  (function(Jobs2) {
    Jobs2.FineTuningJobsPage = FineTuningJobsPage;
    Jobs2.FineTuningJobEventsPage = FineTuningJobEventsPage;
    Jobs2.Checkpoints = Checkpoints;
    Jobs2.FineTuningJobCheckpointsPage = FineTuningJobCheckpointsPage;
  })(Jobs || (Jobs = {}));

  // node_modules/openai/resources/fine-tuning/fine-tuning.mjs
  var FineTuning = class extends APIResource {
    constructor() {
      super(...arguments);
      this.jobs = new Jobs(this._client);
    }
  };
  (function(FineTuning2) {
    FineTuning2.Jobs = Jobs;
    FineTuning2.FineTuningJobsPage = FineTuningJobsPage;
    FineTuning2.FineTuningJobEventsPage = FineTuningJobEventsPage;
  })(FineTuning || (FineTuning = {}));

  // node_modules/openai/resources/images.mjs
  var Images = class extends APIResource {
    createVariation(body, options2) {
      return this._client.post("/images/variations", multipartFormRequestOptions({ body, ...options2 }));
    }
    edit(body, options2) {
      return this._client.post("/images/edits", multipartFormRequestOptions({ body, ...options2 }));
    }
    generate(body, options2) {
      return this._client.post("/images/generations", { body, ...options2 });
    }
  };
  (function(Images2) {
  })(Images || (Images = {}));

  // node_modules/openai/resources/models.mjs
  var Models = class extends APIResource {
    retrieve(model, options2) {
      return this._client.get(`/models/${model}`, options2);
    }
    list(options2) {
      return this._client.getAPIList("/models", ModelsPage, options2);
    }
    del(model, options2) {
      return this._client.delete(`/models/${model}`, options2);
    }
  };
  var ModelsPage = class extends Page {
  };
  (function(Models2) {
    Models2.ModelsPage = ModelsPage;
  })(Models || (Models = {}));

  // node_modules/openai/resources/moderations.mjs
  var Moderations = class extends APIResource {
    create(body, options2) {
      return this._client.post("/moderations", { body, ...options2 });
    }
  };
  (function(Moderations2) {
  })(Moderations || (Moderations = {}));

  // node_modules/openai/index.mjs
  var _a;
  var OpenAI = class extends APIClient {
    constructor({ baseURL = readEnv("OPENAI_BASE_URL"), apiKey = readEnv("OPENAI_API_KEY"), organization = readEnv("OPENAI_ORG_ID") ?? null, project = readEnv("OPENAI_PROJECT_ID") ?? null, ...opts } = {}) {
      if (apiKey === void 0) {
        throw new OpenAIError("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
      }
      const options2 = {
        apiKey,
        organization,
        project,
        ...opts,
        baseURL: baseURL || `https://api.openai.com/v1`
      };
      if (!options2.dangerouslyAllowBrowser && isRunningInBrowser()) {
        throw new OpenAIError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");
      }
      super({
        baseURL: options2.baseURL,
        timeout: options2.timeout ?? 6e5,
        httpAgent: options2.httpAgent,
        maxRetries: options2.maxRetries,
        fetch: options2.fetch
      });
      this.completions = new Completions3(this);
      this.chat = new Chat(this);
      this.embeddings = new Embeddings(this);
      this.files = new Files2(this);
      this.images = new Images(this);
      this.audio = new Audio(this);
      this.moderations = new Moderations(this);
      this.models = new Models(this);
      this.fineTuning = new FineTuning(this);
      this.beta = new Beta(this);
      this.batches = new Batches(this);
      this._options = options2;
      this.apiKey = apiKey;
      this.organization = organization;
      this.project = project;
    }
    defaultQuery() {
      return this._options.defaultQuery;
    }
    defaultHeaders(opts) {
      return {
        ...super.defaultHeaders(opts),
        "OpenAI-Organization": this.organization,
        "OpenAI-Project": this.project,
        ...this._options.defaultHeaders
      };
    }
    authHeaders(opts) {
      return { Authorization: `Bearer ${this.apiKey}` };
    }
  };
  _a = OpenAI;
  OpenAI.OpenAI = _a;
  OpenAI.OpenAIError = OpenAIError;
  OpenAI.APIError = APIError;
  OpenAI.APIConnectionError = APIConnectionError;
  OpenAI.APIConnectionTimeoutError = APIConnectionTimeoutError;
  OpenAI.APIUserAbortError = APIUserAbortError;
  OpenAI.NotFoundError = NotFoundError;
  OpenAI.ConflictError = ConflictError;
  OpenAI.RateLimitError = RateLimitError;
  OpenAI.BadRequestError = BadRequestError;
  OpenAI.AuthenticationError = AuthenticationError;
  OpenAI.InternalServerError = InternalServerError;
  OpenAI.PermissionDeniedError = PermissionDeniedError;
  OpenAI.UnprocessableEntityError = UnprocessableEntityError;
  OpenAI.toFile = toFile;
  OpenAI.fileFromPath = fileFromPath;
  var { OpenAIError: OpenAIError2, APIError: APIError2, APIConnectionError: APIConnectionError2, APIConnectionTimeoutError: APIConnectionTimeoutError2, APIUserAbortError: APIUserAbortError2, NotFoundError: NotFoundError2, ConflictError: ConflictError2, RateLimitError: RateLimitError2, BadRequestError: BadRequestError2, AuthenticationError: AuthenticationError2, InternalServerError: InternalServerError2, PermissionDeniedError: PermissionDeniedError2, UnprocessableEntityError: UnprocessableEntityError2 } = error_exports;
  (function(OpenAI2) {
    OpenAI2.Page = Page;
    OpenAI2.CursorPage = CursorPage;
    OpenAI2.Completions = Completions3;
    OpenAI2.Chat = Chat;
    OpenAI2.Embeddings = Embeddings;
    OpenAI2.Files = Files2;
    OpenAI2.FileObjectsPage = FileObjectsPage;
    OpenAI2.Images = Images;
    OpenAI2.Audio = Audio;
    OpenAI2.Moderations = Moderations;
    OpenAI2.Models = Models;
    OpenAI2.ModelsPage = ModelsPage;
    OpenAI2.FineTuning = FineTuning;
    OpenAI2.Beta = Beta;
    OpenAI2.Batches = Batches;
    OpenAI2.BatchesPage = BatchesPage;
  })(OpenAI || (OpenAI = {}));
  var openai_default = OpenAI;

  // src/app.js
  document.addEventListener("DOMContentLoaded", function() {
    let openai;
    const editor = document.getElementById("editor");
    const preview = document.getElementById("preview");
    const promptsDiv = document.getElementById("prompts");
    const promptsContent = document.getElementById("promptsContent");
    const progressBar = document.getElementById("progressBar");
    const progressBarInner = progressBar.querySelector(".progress-bar");
    const autoSuggestToggle = document.getElementById("autoSuggestToggle");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const toggleButton = document.getElementById("toggleButton");
    const copyButton = document.getElementById("copyButton");
    const downloadButton = document.getElementById("downloadButton");
    const deleteButton = document.getElementById("deleteButton");
    const apiSettingsButton = document.getElementById("apiSettingsButton");
    const saveApiSettingsButton = document.getElementById("saveApiSettings");
    const apiServiceSelect = document.getElementById("apiService");
    const apiKeyInput = document.getElementById("apiKey");
    const rememberKeyCheckbox = document.getElementById("rememberKey");
    const warningText = document.getElementById("warningText");
    const modalElement = document.getElementById("apiSettingsModal");
    new bootstrap.Modal(modalElement);
    let timeout;
    let progressTimeout;
    let progressInterval;
    let saveTimeout;
    let isPreviewMode = false;
    let isDarkMode = false;
    let isAutoSuggestOn = true;
    let currentApiKey = null;
    let currentApiService = "openai";
    import_localforage.default.config({
      name: "WriteSuggest"
    });
    loadSavedText();
    loadApiSettings();
    loadToggleSettings();
    loadSavedPrompts();
    editor.addEventListener("input", handleInput);
    autoSuggestToggle.addEventListener("click", toggleAutoSuggest);
    darkModeToggle.addEventListener("click", toggleDarkMode);
    toggleButton.addEventListener("click", togglePreview);
    copyButton.addEventListener("click", copyToClipboard);
    downloadButton.addEventListener("click", downloadMarkdown);
    deleteButton.addEventListener("click", confirmDelete);
    apiSettingsButton.addEventListener("click", openApiSettingsModal);
    saveApiSettingsButton.addEventListener("click", saveApiSettings);
    editor.addEventListener("paste", handlePaste);
    rememberKeyCheckbox.addEventListener("change", function() {
      if (rememberKeyCheckbox.checked) {
        warningText.style.display = "block";
        warningText.classList.remove("text-muted");
        warningText.classList.add("text-danger");
      } else {
        warningText.style.display = "none";
        warningText.classList.remove("text-danger");
        warningText.classList.add("text-muted");
      }
    });
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      toggleDarkMode();
    }
    function handlePaste(e) {
      setTimeout(() => {
        handleInput();
        if (isAutoSuggestOn) {
          clearTimeout(timeout);
          showSuggestions();
        }
      }, 0);
    }
    function handleInput() {
      clearTimeout(timeout);
      clearTimeout(progressTimeout);
      clearInterval(progressInterval);
      resetProgressBar();
      const text = editor.value.trim();
      if (text.length > 0 && isAutoSuggestOn) {
        progressTimeout = setTimeout(startProgressBar, 2e3);
        timeout = setTimeout(showSuggestions, 5e3);
      } else {
        promptsContent.innerHTML = "";
      }
      saveTimeout = setTimeout(saveText, 1e3);
    }
    function startProgressBar() {
      progressBar.classList.remove("d-none");
      progressBarInner.style.width = "0%";
      progressBarInner.setAttribute("aria-valuenow", 0);
      let progress = 0;
      progressInterval = setInterval(() => {
        progress += 1;
        progressBarInner.style.width = `${progress}%`;
        progressBarInner.setAttribute("aria-valuenow", progress);
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 30);
    }
    function resetProgressBar() {
      progressBar.classList.add("d-none");
      progressBarInner.style.width = "0%";
      progressBarInner.setAttribute("aria-valuenow", 0);
    }
    function saveText() {
      import_localforage.default.setItem("savedText", editor.value).catch((err) => console.error("Error saving text:", err));
    }
    async function loadSavedText() {
      try {
        const savedText = await import_localforage.default.getItem("savedText");
        if (savedText) {
          editor.value = savedText;
          if (isAutoSuggestOn) {
            progressTimeout = setTimeout(startProgressBar, 2e3);
            timeout = setTimeout(showSuggestions, 5e3);
          }
        }
      } catch (err) {
        console.error("Error loading saved text:", err);
      }
    }
    async function loadToggleSettings() {
      try {
        const darkMode = await import_localforage.default.getItem("isDarkMode");
        if (darkMode !== null) {
          isDarkMode = darkMode;
          if (isDarkMode) {
            document.body.classList.add("dark-mode");
            darkModeToggle.innerHTML = '<i class="bi bi-sun"></i>';
            darkModeToggle.title = "Switch to Light Mode";
          }
        }
        const autoSuggest = await import_localforage.default.getItem("isAutoSuggestOn");
        if (autoSuggest !== null) {
          isAutoSuggestOn = autoSuggest;
          autoSuggestToggle.innerHTML = isAutoSuggestOn ? '<i class="bi bi-stop-circle"></i>' : '<i class="bi bi-magic"></i>';
          autoSuggestToggle.title = isAutoSuggestOn ? "Turn Off Auto Suggestions" : "Turn On Auto Suggestions";
        }
      } catch (err) {
        console.error("Error loading toggle settings:", err);
      }
    }
    async function loadSavedPrompts() {
      try {
        const savedPrompts = await import_localforage.default.getItem("savedPrompts");
        if (savedPrompts) {
          promptsContent.innerHTML = savedPrompts.map((prompt) => `<div>${prompt}</div>`).join("");
        }
      } catch (err) {
        console.error("Error loading saved prompts:", err);
      }
    }
    function savePrompts(prompts) {
      import_localforage.default.setItem("savedPrompts", prompts).catch((err) => console.error("Error saving prompts:", err));
    }
    function confirmDelete() {
      if (confirm("Are you sure you want to delete all text? This action cannot be undone.")) {
        editor.value = "";
        import_localforage.default.removeItem("savedText").then(() => console.log("Text deleted successfully")).catch((err) => console.error("Error deleting text:", err));
        promptsContent.innerHTML = "";
        resetProgressBar();
      }
    }
    function toggleAutoSuggest() {
      isAutoSuggestOn = !isAutoSuggestOn;
      autoSuggestToggle.innerHTML = isAutoSuggestOn ? '<i class="bi bi-stop-circle"></i>' : '<i class="bi bi-magic"></i >';
      autoSuggestToggle.title = isAutoSuggestOn ? "Turn Off Auto Suggestions" : "Turn On Auto Suggestions";
      import_localforage.default.setItem("isAutoSuggestOn", isAutoSuggestOn).catch((err) => console.error("Error saving auto-suggest setting:", err));
      if (isAutoSuggestOn) {
        progressTimeout = setTimeout(startProgressBar, 2e3);
        timeout = setTimeout(showSuggestions, 5e3);
      } else {
        clearTimeout(timeout);
        clearTimeout(progressTimeout);
        clearInterval(progressInterval);
        resetProgressBar();
        promptsContent.innerHTML = "";
      }
    }
    function togglePreview() {
      isPreviewMode = !isPreviewMode;
      if (isPreviewMode) {
        preview.innerHTML = marked.parse(editor.value);
        editor.classList.add("d-none");
        preview.classList.remove("d-none");
        toggleButton.innerHTML = '<i class="bi bi-pencil"></i>';
        toggleButton.title = "Edit";
      } else {
        editor.classList.remove("d-none");
        preview.classList.add("d-none");
        promptsDiv.style.display = "block";
        toggleButton.innerHTML = '<i class="bi bi-eye"></i>';
        toggleButton.title = "Preview";
      }
    }
    function toggleDarkMode() {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle("dark-mode");
      darkModeToggle.innerHTML = isDarkMode ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
      darkModeToggle.title = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
      import_localforage.default.setItem("isDarkMode", isDarkMode).catch((err) => console.error("Error saving dark mode setting:", err));
    }
    function downloadMarkdown() {
      const content = editor.value;
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    function copyToClipboard() {
      navigator.clipboard.writeText(editor.value).then(() => {
        const originalContent = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="bi bi-check-lg"></i>';
        copyButton.title = "Copied!";
        setTimeout(() => {
          copyButton.innerHTML = originalContent;
          copyButton.title = "Copy to Clipboard";
        }, 1e3);
      }).catch((err) => {
        console.error("Failed to copy: ", err);
      });
    }
    async function showSuggestions() {
      const text = editor.value.trim();
      if (text.length === 0) {
        promptsContent.innerHTML = "";
        resetProgressBar();
        document.getElementById("prompts").style.display = "none";
        return;
      }
      try {
        const suggestions = await getSuggestions(text);
        promptsContent.innerHTML = suggestions.map((suggestion) => `<div>${suggestion}</div>`).join("");
        savePrompts(suggestions);
        resetProgressBar();
      } catch (error) {
        console.error("Error getting suggestions:", error);
        promptsContent.innerHTML = "<div>Error fetching suggestions. Please check your API settings.</div>";
        resetProgressBar();
      }
    }
    async function getSuggestions(text) {
      if (!openai) {
        return ["Please set up your OpenAI API key in the settings."];
      }
      const recentText = text.slice(-500);
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an AI writing assistant. Your task is to provide three different short and simple prompts or questions to help the user continue their writing. Each suggestion should be no more than one sentence and easy to understand. Respond with a JSON array of strings without any additional formatting or code fences."
            },
            {
              role: "user",
              content: `Here is what I have written so far: "${text}".

Based on the recent part: "${recentText}", please provide three short and simple suggestions to help me continue writing as a JSON array of strings.`
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        });
        let suggestionsContent = response.choices[0].message.content.trim();
        if (suggestionsContent.startsWith("```") && suggestionsContent.endsWith("```")) {
          suggestionsContent = suggestionsContent.slice(3, -3).trim();
        }
        suggestionsContent = suggestionsContent.replace(/^[^\[]*/, "").replace(/[^\]]*$/, "");
        const suggestions = JSON.parse(suggestionsContent);
        return suggestions;
      } catch (error) {
        console.error("Error getting suggestions:", error);
        return [`Error: ${error.message}`];
      }
    }
    function openApiSettingsModal() {
      const modalElement2 = document.getElementById("apiSettingsModal");
      const modal = new bootstrap.Modal(modalElement2);
      modal.show();
    }
    async function saveApiSettings() {
      const apiKey = apiKeyInput.value;
      const rememberKey = rememberKeyCheckbox.checked;
      if (apiKey) {
        openai = new openai_default({ apiKey, dangerouslyAllowBrowser: true });
      }
      if (rememberKey) {
        const encryptedKey = await encryptApiKey(apiKey);
        await import_localforage.default.setItem("encryptedApiKey", encryptedKey);
      } else {
        await import_localforage.default.removeItem("encryptedApiKey");
      }
      const modalElement2 = document.getElementById("apiSettingsModal");
      const modal = bootstrap.Modal.getInstance(modalElement2);
      modal.hide();
    }
    async function loadApiSettings() {
      const encryptedKey = await import_localforage.default.getItem("encryptedApiKey");
      if (encryptedKey) {
        const apiKey = await decryptApiKey(encryptedKey);
        openai = new openai_default({ apiKey, dangerouslyAllowBrowser: true });
        rememberKeyCheckbox.checked = true;
        warningText.style.display = "block";
        warningText.classList.remove("text-muted");
        warningText.classList.add("text-danger");
      }
    }
    async function encryptApiKey(apiKey) {
      const encoder = new TextEncoder();
      const data = encoder.encode(apiKey);
      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );
      return {
        key: await window.crypto.subtle.exportKey("jwk", key),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
      };
    }
    async function decryptApiKey(encryptedData) {
      const key = await window.crypto.subtle.importKey(
        "jwk",
        encryptedData.key,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(encryptedData.iv) },
        key,
        new Uint8Array(encryptedData.data)
      );
      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    }
  });
})();
/*!
    localForage -- Offline Storage, Improved
    Version 1.10.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
//# sourceMappingURL=app.js.map
