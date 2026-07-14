let express = require("express"),
  http = require("http"),
  app = require("express")(),
  server = http.createServer(app),
  bodyParser = require("body-parser");

require('util').isDate = require('util').isDate || function (obj) { return Object.prototype.toString.call(obj) === '[object Date]'; };
require('util').isRegExp = require('util').isRegExp || function (obj) { return Object.prototype.toString.call(obj) === '[object RegExp]'; };
console.log("[SERVER] NeDB polyfills applied");

const PORT = process.env.PORT || 8001;

console.log("[SERVER] Initializing Express server...");
console.log("[SERVER] Port:", PORT);
console.log("[SERVER] APPDATA:", process.env.APPDATA);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    console.log('[SERVER]', req.method, req.url);
    next();
});

app.all("/*", function(req, res, next) {
 
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.get("/", function(req, res) {
  res.send("POS Server Online.");
});

app.use("/api/inventory", require("./api/inventory"));
app.use("/api/customers", require("./api/customers"));
app.use("/api/categories", require("./api/categories"));
app.use("/api/settings", require("./api/settings"));
app.use("/api/users", require("./api/users"));
app.use("/api", require("./api/transactions"));

console.log("[SERVER] All API routes mounted");

server.listen(PORT, '127.0.0.1', () => console.log(`[SERVER] Listening on PORT ${PORT}`));

server.on('error', function (err) {
    console.error('[SERVER] Server error:', err.message);
});
