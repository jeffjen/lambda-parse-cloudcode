"use strict"

require("dotenv").config({ silent: true });

const CloudCode = require("./funcs").CloudCode;
const become = require("./funcs").become;
const sanitize = require("./funcs").sanitize;

module.exports.handle = function (event, context, callback) {
    const functionName = event.params.functionName;
    const func = CloudCode[functionName];
    if (func) {
        const req = CloudCode.request(event);
        sanitize(req);
        become(req).
            then(function current(user) {
                req.user = user;
                return func(req, context);
            }).
            then(function success(result) {
                callback(null, {result: result})
            }).
            catch(function fail(err) {
                err = new CloudCode.error.ServerError(err);
                callback(JSON.stringify(err))
            });
    } else {
        var err = new CloudCode.error.MethodNotFoundError(functionName);
        callback(JSON.stringify(err));
    }
}
