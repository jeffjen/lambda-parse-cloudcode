"use strict"

const firebase = require("firebase");
const Parse = require("parse/node");

const claims = {
    // provide additionl info for auth token
    moderator: true
};

module.exports = {
    loginAsMod: function loginAsMod(req, context) {
        let username = req.body.username;
        let password = req.body.password;

        let hasUsername = new Parse.Query(Parse.User);
        hasUsername.equalTo("username", username);

        let hasEmail = new Parse.Query(Parse.User);
        hasEmail.equalTo("email", username);

        let query = Parse.Query.or(hasUsername, hasEmail);

        return query.first().
            then(function (user) {
                if (user) {
                    return Parse.User.logIn(user.get("username"), password);
                } else {
                    throw new Error("user not found");
                }
            }).
            then(function (login) {
                // login success!
                let auth = firebase.auth();
                let sToken = login.getSessionToken();
                let fToken = auth.createCustomToken(login.get("username"), claims);
                return {
                    createdAt: login.createdAt,
                    objectId: login.id,
                    sessionToken: sToken,
                    firebaseToken: fToken,
                }
            });
    }
};
