"use strict"

module.exports = (function configureFunc(config) {
    const express = require("express");
    const firebase = require("firebase");
    const Parse = require("parse-sdk/node");

    // Initialize Parse SDK
    Parse.initialize(config.parse.appID, config.parse.javascriptKey, config.parse.masterKey);

    // Set Parse API Endpoint
    Parse.serverURL = config.parse.serverURL;

    // Enforce no retry at server side
    Parse.CoreManager.set("REQUEST_ATTEMPT_LIMIT", 1);

    // Export (Global) CloudCode function mapper and request hijacker
    const CloudCode = global.CloudCode = {};

    CloudCode.error = {
        MethodNotFoundError: require("./error/method-not-found-error"),
        ServerError: require("./error/server-error"),
    };

    CloudCode.request = function request(event) {
        for (let k in event.headers) {
            event.headers[k.toLowerCase()] = event.headers[k];
            delete event.headers[k];
        }
        event.__proto__ = express.request;
        return event;
    }

    CloudCode.define = function define(name, fn) {
        if (name in CloudCode) {
            throw new Error("Function " + name + " already defined");
        } else {
            CloudCode[name] = fn;
        }
    }

    // Build express app middleware
    const middleware = require("./middleware").build(CloudCode);

    // Export middleware helper
    const become = require("./middleware").become;
    const sanitize = require("./middleware").sanitize;
    const isModerator = require("./is-moderator");

    if (config.firebase) {
        const privateKey = config.firebase.privateKey.replace(/\\n/g, "\n");
        firebase.initializeApp({
            serviceAccount: {
                projectId: config.firebase.projectId,
                clientEmail: config.firebase.clientEmail,
                privateKey: privateKey
            },
            databaseURL: config.firebase.databaseURL
        });
        const deps = [
            "./firebase-login-custom-token",
            "./firebase-single-sign-on"
        ];
        // Initialize functions
        deps.forEach((fn) => Object.assign(CloudCode, require(fn)));
    }

    // Export symbols/reference
    return {
        CloudCode,
        middleware,
        become,
        sanitize,
        isModerator
    };
})();

