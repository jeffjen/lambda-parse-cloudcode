"use strict"

require("dotenv").config({ silent: true });

const CloudCode = require("./funcs").CloudCode;

module.exports.handle = function (event, context, callback) {
    const functionName = event.params.functionName;
    const func = CloudCode[functionName];
    if (func) {
        func(CloudCode.request(event), context)
            .then(function success(result) {
                callback(null, result)
            })
            .catch(function fail(err) {
                err = new CloudCode.error.ServerError(err);
                callback(JSON.stringify(err))
            });
    } else {
        var err = new CloudCode.error.MethodNotFoundError(functionName);
        callback(JSON.stringify(err));
    }
}
