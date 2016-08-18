"use strict"

const event = require("./event");
const lambda = require("./lambda");

lambda.handle(event, {}, function report(err, data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
