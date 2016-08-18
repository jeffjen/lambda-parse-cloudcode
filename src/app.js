"use strict"

const express = require("express");
const app = module.exports = express();

const CloudCode = require("./funcs").CloudCode;
const middleware = require("./funcs").middleware;

app.use("/parse/functions", middleware);

app.use(function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        // NOOP
    } else {
        // Cast unexpected error to ServerError
        err = new CloudCode.error.ServerError(err);
        // barf at user
        res.status(err.code).json(err.origin);
    }
});
