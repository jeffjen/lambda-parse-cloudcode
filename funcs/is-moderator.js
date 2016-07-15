"use strict"

const Parse = require("parse/node");

const ModeratorRoleName = "Moderators";

module.exports = function isModerator(user) {
    let query = new Parse.Query(Parse.Role);
    query.equalTo("name", ModeratorRoleName);
    query.equalTo("users", user);
    return query.first().
        then(function (result) {
            if (!result) {
                throw new Error("Forbidden");
            } else {
                user.isModerator = true;
                return user;
            }
        });
}
