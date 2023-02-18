"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var express = require("express");
var minify = require("express-minify");
// const MainRoute = require("./routes/index");
// const driver = require("./routes/driver");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var mysql = require("mysql2");
var crypto = require("crypto");
var bcrypt = require("bcrypt");
var multer = require("multer");
var path = require("path");
var Chart = require('chart.js/auto');
var Canvas = require('canvas');
var app = express();
app.use(minify({
  cache: false,
  uglifyJsModule: null,
  errorHandler: null,
  jsMatch: /javascript/,
  cssMatch: /css/,
  jsonMatch: /json/,
  sassMatch: /scss/,
  lessMatch: /less/,
  stylusMatch: /stylus/,
  coffeeScriptMatch: /coffeescript/
}));
app.use("/uploads", express["static"](path.join(__dirname, "uploads")));

//------ Routes -------//
app.set("view engine", "ejs");
app.use(express["static"]("public"));
app.get('/', function (req, res) {
  res.render('index.ejs');
});
app.get('/driver', function (req, res) {
  res.render('driver_lgn_reg.ejs');
});
app.get('/logadmin', function (req, res) {
  res.render("admin/logadmin.ejs");
});
app.get('/admin/tabledb', function (req, res) {
  res.render("admin/tables-datatables.ejs");
});
app.get('/BecomeDriver', function (req, res) {
  res.render('driver_info.ejs');
});
//--------- Login Auth ---------- //
app.use(express.urlencoded({
  extended: true
}));
var secretKey = crypto.randomBytes(32).toString("hex");
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Bustguy123+",
//   database: "userDb",
// });
var connection = mysql.createConnection({
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b23c8a045bfb66",
  password: "a2b3cd99",
  database: "heroku_e89598fb25b1a5e"
});
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore({
    host: "eu-cdbr-west-03.cleardb.net",
    user: "b23c8a045bfb66",
    password: "a2b3cd99",
    database: "heroku_e89598fb25b1a5e"
  }),
  cookie: {
    secure: false,
    maxAge: 30 * 60 * 1000
  }
}));
app.post("/login_driver", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var driver_check, email, pswd, query, results, driver, match, _query, _results, _driver, _match;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          driver_check = req.body.driver_check;
          email = req.body.email;
          pswd = req.body.password;
          if (!driver_check) {
            _context.next = 26;
            break;
          }
          query = "SELECT * FROM drivers WHERE email = '".concat(email, "'");
          _context.prev = 5;
          _context.next = 8;
          return connection.promise().query(query);
        case 8:
          results = _context.sent;
          if (!(results[0].length > 0)) {
            _context.next = 17;
            break;
          }
          driver = results[0][0];
          _context.next = 13;
          return bcrypt.compare(pswd, driver.password);
        case 13:
          match = _context.sent;
          if (match) {
            req.session.loggedin = true;
            req.session.userId = results[0][0].id;
            res.redirect("/dashboard");
          } else {
            res.send("Incorrect email and/or password");
          }
          _context.next = 18;
          break;
        case 17:
          res.send("Incorrect email and/or password");
        case 18:
          _context.next = 24;
          break;
        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](5);
          console.error(_context.t0);
          res.send("An error occurred while checking the login information");
        case 24:
          _context.next = 46;
          break;
        case 26:
          _query = "SELECT * FROM clients WHERE email = '".concat(email, "' AND password ='").concat(pswd, "'");
          _context.prev = 27;
          _context.next = 30;
          return connection.promise().query(_query);
        case 30:
          _results = _context.sent;
          if (!(_results[0].length > 0)) {
            _context.next = 39;
            break;
          }
          _driver = _results[0][0];
          _context.next = 35;
          return bcrypt.compare(pswd, _driver.password);
        case 35:
          _match = _context.sent;
          if (_match) {
            req.session.loggedin = true;
            req.session.userId = _results[0].id;
            res.redirect("/clients");
          } else {
            res.send("Incorrect email and/or password");
          }
          _context.next = 40;
          break;
        case 39:
          res.send("Incorrect email and/or password");
        case 40:
          _context.next = 46;
          break;
        case 42:
          _context.prev = 42;
          _context.t1 = _context["catch"](27);
          console.error(_context.t1);
          res.send("An error occurred while checking the login information");
        case 46:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 20], [27, 42]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get("/dashboard", function (req, res) {
  if (req.session.loggedin) {
    connection.query("SELECT * FROM drivers WHERE id = ?", [req.session.userId], function (error, results, fields) {
      if (error) throw error;
      // console.log(results[0].profile_pic);
      // console.log(results[0]);
      data = results[0];
      res.render("dashboard.ejs", {
        fname: data.f_name,
        lname: data.l_name,
        age: data.age,
        email: data.email,
        num: data.phone_number,
        cin: data.cin,
        adress: data.adresse,
        username: data.username,
        image: data.profile_pic
      });
    });
  } else {
    res.redirect("/driver");
  }
});
//----------- visitors ----------//
app.use(function (req, res, next) {
  if (!req.session.visitorId) {
    // Generate a unique visitor ID and store it in the session
    req.session.visitorId = Math.floor(Math.random() * 1000000);
    // Update the visitor count in the database
    connection.query("UPDATE userdata SET visitors = visitors + 1 WHERE id = 1", function (error, results, fields) {
      if (error) {
        console.error("Error updating visitor count in database", error);
      }
    });
  }
  next();
});
//-------------- update infos ---------------//
var storagee = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "public/images");
  },
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
var uploadd = multer({
  storage: storagee
});
app.post("/userinfo", uploadd.array("myFile", 4), function (req, res) {
  if (req.session.loggedin) {
    var email = req.body.email;
    var fname = req.body.f_name;
    var lname = req.body.l_name;
    var age = req.body.age;
    var num = req.body.num;
    // const cin = req.body.cin;
    var username = fname + lname;
    var sql = "UPDATE drivers SET username = ?, f_name = ?, l_name = ?, age = ?, phone_number = ?,  email = ? , pic1 = ?, pic2 = ?, pic3 = ?, pic4 = ? WHERE id = ?";
    var values = [username, fname, lname, age, num, email];
    for (var i = 0; i < 4; i++) {
      if (req.files[i]) {
        values.push("/images/" + req.files[i].filename);
      } else {
        values.push(null);
      }
    }
    values.push(req.session.userId);
    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log("User got updated!");
      res.redirect("/dashboard");
    });
  }
});
//-------------- insert image --------------//
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});
var upload = multer({
  storage: storage
}).single("image");
app.post("/upload", function (req, res) {
  // Check if a user is logged in
  if (!req.session.userId) {
    return res.status(401).send({
      error: "Unauthorized. Please log in first."
    });
  }
  upload(req, res, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }
    var image = req.file;
    console.log("Received image:", image);
    // Save the image to the database
    var sql = "UPDATE drivers SET profile_pic = ? WHERE id = ?";
    connection.query(sql, [image.filename, req.session.userId], function (err, result) {
      if (err) throw err;
      res.status(200).send({
        status: "success"
      });
    });
  });
});

//-------------- Register Auth ------------//
app.post("/register", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var driver_check, f_name, email, password, checksql, chechvalue, sql, values;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          driver_check = req.body.driver_check;
          f_name = req.body.f_name;
          email = req.body.email;
          _context2.next = 5;
          return bcrypt.hash(req.body.password, 10);
        case 5:
          password = _context2.sent;
          checksql = "SELECT * FROM drivers WHERE email = ?";
          chechvalue = [email];
          if (driver_check) {
            connection.query(checksql, chechvalue, function (err, result) {
              if (err) throw err;
              if (result.length) {
                console.log("Email already in use. Please choose a different email.");
                res.redirect("/driver");
              } else {
                console.log("checked");
                var sql = "INSERT INTO drivers (f_name, email, password) VALUES (?,?,?)";
                var values = [f_name, email, password];
                connection.query(sql, values, function (err, result) {
                  if (err) throw err;
                  console.log("User registered successfully!");
                  req.session.loggedin = true;
                  req.session.userId = result.insertId;
                  connection.query("UPDATE userdata SET created_acc = created_acc + 1 WHERE id = 1", function (error, resultss, fields) {
                    if (error) {
                      console.error("Error updating created_acc count in database", error);
                    }
                  });
                  res.redirect("/driver");
                });
              }
            });
          } else {
            console.log("not checked");
            sql = "INSERT INTO clients (f_name, email, password) VALUES (?,?,?)";
            values = [f_name, email, password];
            connection.query(sql, values, function (err, result) {
              if (err) throw err;
              console.log("User registered successfully!");
              req.session.loggedin = true;
              console.log(result);
              req.session.userId = result.id;
              connection.query("UPDATE userdata SET created_acc = created_acc + 1 WHERE id = 1", function (error, resultss, fields) {
                if (error) {
                  console.error("Error updating created_acc count in database", error);
                }
              });
              res.redirect("/clients");
            });
          }
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

//-------------- clients -----------------//
app.get("/clients", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          connection.query("SELECT * FROM drivers", function (error, result) {
            if (error) throw error;
            res.render("clients.ejs", {
              drivers: result
            });
          });
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
app.get("/clients/:id", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          connection.query("SELECT * FROM drivers WHERE id = ?", [req.params.id], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
              console.log(result[0]);
              res.render("client-detail.ejs", {
                driver: result
              });
            } else {
              res.status(404).send("Driver not found");
            }
          });
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

//------------- SuperAdmin ---------------//
// Load the data and render the page
app.get('/admin', function (req, res) {
  connection.query('SELECT * FROM userdata', function (err, result) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    var visitorCount = result[0].visitors;
    var accountCount = result[0].created_acc;
    var canvas = Canvas.createCanvas(500, 500);
    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['All-time visitors', 'Created accounts'],
        datasets: [{
          label: 'Count',
          data: [visitorCount, accountCount],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    var chartUrl = canvas.toDataURL();
    res.render('Admin/index.ejs', {
      visitors: result[0].visitors,
      Drivers: result[0].created_acc,
      clients: result[0].clients,
      chart: chartUrl
    });
  });
});
app.post("/log", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var username, pass, query, results, driver;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          username = req.body.username;
          pass = req.body.psd;
          query = "SELECT * FROM sadmin WHERE username = '".concat(username, "' AND password = '").concat(pass, "'");
          _context5.prev = 3;
          _context5.next = 6;
          return connection.promise().query(query);
        case 6:
          results = _context5.sent;
          if (results[0].length > 0) {
            driver = results[0][0];
            req.session.admin = true;
            // req.session.userId = results[0][0].id;
            res.redirect("/admin");
          } else {
            res.send("Incorrect username and/or password");
          }
          _context5.next = 14;
          break;
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](3);
          console.error(_context5.t0);
          res.send("An error occurred while checking the login information");
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[3, 10]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
//---------- Server is on ---------//
app.listen(process.env.PORT || 1000, function () {
  console.log("Server is On!!");
});