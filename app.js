"use strict"

require("dotenv").config({ silent: true });

const express = require("express");

const CloudCode = require("./funcs").CloudCode;
const middleware = require("./funcs").middleware;

const app = module.exports = express();

app.get("/_ah/health", function health_check(req, res, next) {
    res.status(200).send("ok");
});

app.get("/_ah/start", function start_signal(req, res, next) {
    res.status(204).end();
});

app.get("/_ah/stop", function stop_signal(req, res, next) {
    res.status(204).end();
});

app.use("/parse/functions", middleware);

app.use(function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
    } else {
        // Cast unexpected error to ServerError
        err = new CloudCode.error.ServerError(err);
        // barf at user
        res.status(err.code).json(err.origin);
    }
});
