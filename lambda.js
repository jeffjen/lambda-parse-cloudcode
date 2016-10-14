"use strict"

const config = require("./lambda.config");
require("./lib/funcs")(config);

module.exports.handle = require("./cloudcode");
