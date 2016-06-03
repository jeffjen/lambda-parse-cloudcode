"use strict"

const app = require("./app");
const port = process.env.PORT || 8080;

const httpServer = require("http").createServer(app);
httpServer.listen(port, function() {
    console.log("lambda-parse-cloudcode running on port " + port + ".");
});
