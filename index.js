"use strict"

require("dotenv").config({ silent: true });

const app = require("./app");
const port = process.env.PORT || 8080;

app.get("/_ah/health", function health_check(req, res, next) {
    res.status(200).send("ok");
});

app.get("/_ah/start", function start_signal(req, res, next) {
    res.status(204).end();
});

app.get("/_ah/stop", function stop_signal(req, res, next) {
    res.status(204).end();
});

const httpServer = require("http").createServer(app);
httpServer.listen(port, function() {
    console.log("lambda-parse-cloudcode running on port " + port + ".");
});
