"use strict"

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Parse = require("parse-sdk/node");

function become(sessionToken) {
    if (sessionToken) {
        let query = new Parse.Query(Parse.Session);
        return query.equalTo("sessionToken", sessionToken).include("user").first({ useMasterKey: true }).then(function (session) {
            if (session) {
                return session.get("user");
            } else {
                throw new Error("No such user");
            }
        });
    } else {
        return Parse.Promise.resolve(null);
    }
}
module.exports.become = become;

function sanitize(req, res, next) {
    req.applicationId = req.get("X-Parse-Application-Id") || req.body["_ApplicationId"] || null;
    delete req.body["_ApplicationId"];
    req.clientVersion = req.get("X-Parse-Client-Version") || req.body["_ClientVersion"] || null;
    delete req.body["_ClientVersion"];
    req.installationId = req.get("X-Parse-Installation-Id") || req.body["_InstallationId"] || null;
    delete req.body["_InstallationId"];
    req.masterKey = req.get("X-Parse-Master-Key") || req.body["_MasterKey"] || null;
    delete req.body["_MasterKey"];
    req.sessionToken = req.get("X-Parse-Session-Token") || req.body["_SessionToken"] || null;
    delete req.body["_SessionToken"];
    // Continue to the next middleware
    next && next();
}
module.exports.sanitize = sanitize;

module.exports.build = function build(CloudCode) {
    const router = express.Router();

    // Enable all CORS aceess
    router.use(cors());

    // Parse request body by json
    router.use(bodyParser.json({ type: "*/*" }));

    // Sanitize and retrieve Parse related paramaters
    router.use(sanitize);

    router.use(function obtainUser(req, res, next) {
        become(req.sessionToken).
            then(function success(user) {
                req.user = user;
                next();
            }).
            catch(function fail(err) {
                req.user = null;
                next();
            });
    });

    router.post("/:functionName", function handleFunction(req, res, next) {
        const functionName = req.params.functionName;
        const func = CloudCode[functionName];
        if (func) {
            func(req, {}).
                then(function success(result) {
                    res.status(200).json({result: result});
                }).
                catch(function fail(err) {
                    next(new CloudCode.error.ServerError(err));
                });
        } else {
            next(new CloudCode.error.MethodNotFoundError(functionName));
        }
    });

    return router;
}
