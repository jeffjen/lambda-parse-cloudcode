"use strict"

const express = require("express");
const firebase = require("firebase");
const Parse = require("parse-sdk/node");

// Initialize Parse SDK
Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);

// Set Parse API Endpoint
Parse.serverURL = process.env.ADVERTISE_CLIENT_URL;

const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
firebase.initializeApp({
    serviceAccount: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
    },
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

var EXPORT = module.exports;

const CloudCode = EXPORT.CloudCode = global.CloudCode = {};

CloudCode.error = {
    MethodNotFoundError: require("./error/method-not-found-error"),

    ServerError: require("./error/server-error"),
}

CloudCode.request = function request(event) {
    for (let k in event.headers) {
        event.headers[k.toLowerCase()] = event.headers[k];
        delete event.headers[k];
    }
    event.__proto__ = express.request;
    return event;
}

let deps = [
    "./firebase-login-custom-token",
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
EXPORT.isModerator = global.isModerator = require("./is-moderator");

// Restrict use of Parse SDK
EXPORT.Parse = global.Parse = Parse;
