"use strict"

const Parse = require("parse-sdk/node");

const ModeratorRoleName = "Moderators";

module.exports = function isModerator(user) {
    let query = new Parse.Query(Parse.Role);
    query.equalTo("name", ModeratorRoleName);
    query.equalTo("users", user);
    return query.first().
        then(function (result) {
            if (!result) {
                throw new Error("error/role-moderators-required");
            } else {
                user.isModerator = true;
                return user;
            }
        });
}
