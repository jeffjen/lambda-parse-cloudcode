"use strict"

require("dotenv").config({ silent: true });

const express = require("express");

const CloudCode = require("./funcs");

const app = module.exports = express();

app.post("/parse/functions/:functionName", function handleFunction(req, res, next) {
    const functionName = req.params.functionName
    const func = CloudCode[functionName];
    if (func) {
        func(req, {})
            .then(function success(result) {
                res.status(200).json(result);
            })
            .catch(function fail(err) {
                next(new CloudCode.error.ServerError(err));
            });
    } else {
        next(new CloudCode.error.MethodNotFoundError(functionName));
    }
});

app.get("/_ah/health", function health_check(req, res, next) {
    res.status(200).send("ok");
});

app.get("/_ah/start", function start_signal(req, res, next) {
    res.status(204).end();
});

app.get("/_ah/stop", function stop_signal(req, res, next) {
    res.status(204).end();
});

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
