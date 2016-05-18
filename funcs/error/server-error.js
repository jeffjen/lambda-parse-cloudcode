"use strict"

const util = require("util");

const StandardHttpError = require("standard-http-error");

function ServerError(errorOrMessage) {
    let err = {
        code: 503,
        message: "unable to process",
        origin: {},
    }
    if (errorOrMessage instanceof StandardHttpError) {
        Object.assign(err, errorOrMessage);
        this.name = errorOrMessage.name || "ServerError";
    } else {
        err.origin = {
            code: errorOrMessage.code || 2,
            message: errorOrMessage.message || "Service Unavailable",
        };
        err.message = err.origin.message;
    }
    StandardHttpError.call(this, err.code, err.message, { origin: err.origin });
}

ServerError.prototype.name = "ServerError";

util.inherits(ServerError, StandardHttpError);

module.exports = ServerError;
