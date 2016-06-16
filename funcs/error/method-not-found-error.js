"use strict"

const util = require("util");

const StandardHttpError = require("standard-http-error");

function MethodNotFoundError(methodName) {
    const ParseError = {
        code: 141,
        error: "FunctionNotFound",
        message: "FunctionNotFound",
    };
    StandardHttpError.call(this, 404, "FunctionNotFound", { origin: ParseError });
}

MethodNotFoundError.prototype.name = "MethodNotFoundError";

util.inherits(MethodNotFoundError, StandardHttpError);

module.exports = MethodNotFoundError;
