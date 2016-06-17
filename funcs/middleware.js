"use strict"

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

module.exports.build = function build(CloudCode) {
    const router = express.Router();

    // Enable all CORS aceess
    router.use(cors());

    router.use(bodyParser.json({ type: "*/*" }));

    router.post("/:functionName", function handleFunction(req, res, next) {
        const functionName = req.params.functionName;
        const func = CloudCode[functionName];
        if (func) {
            func(req, {})
                .then(function success(result) {
                    res.status(200).json({result: result});
                })
                .catch(function fail(err) {
                    next(new CloudCode.error.ServerError(err));
                });
        } else {
            next(new CloudCode.error.MethodNotFoundError(functionName));
        }
    });

    return router;
}
