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

EXPORT.error = {
    MethodNotFoundError: require("./error/method-not-found-error"),

    ServerError: require("./error/server-error"),
}


EXPORT.request = function request(event) {
    event.__proto__ = express.request;
    return event;
}
