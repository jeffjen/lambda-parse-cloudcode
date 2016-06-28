"use strict"

const express = require("express");
const Parse = require("parse/node");

// Initialize Parse SDK
Parse.initialize(
    process.env.APP_ID,
    process.env.JAVASCRIPT_KEY,
    process.env.MASTER_KEY,
    {
        "X-Gateway-Token": process.env.GATEWAY_TOKEN || ""
    }
);

// Set Parse API Endpoint
Parse.serverURL = process.env.ADVERTISE_CLIENT_URL;

var EXPORT = module.exports;

const CloudCode = EXPORT.CloudCode = {};

CloudCode.error = {
    MethodNotFoundError: require("./error/method-not-found-error"),

    ServerError: require("./error/server-error"),
}

CloudCode.request = function request(event) {
    event.__proto__ = express.request;
    return event;
}

let deps = [
    "./firebase-single-sign-on"
];
// Initialize functions
deps.forEach((fn) => Object.assign(CloudCode, require(fn)));

CloudCode.define = function define(name, fn) {
    if (name in CloudCode) {
        throw new Error("Function " + name + " already defined");
    } else {
        CloudCode[name] = fn;
    }
}

// Build express app middleware
EXPORT.middleware = require("./middleware").build(CloudCode);

// Export Parse middleware helper
EXPORT.become = require("./middleware").become;
EXPORT.sanitize = require("./middleware").sanitize;

// Restrict use of Parse SDK
EXPORT.Parse = Parse;
