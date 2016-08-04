"use strict"

const firebase = require("firebase");
const Parse = require("parse-sdk/node");

const isModerator = require("./is-moderator");

const claims = {
    // provide additionl info for auth token
    moderator: true
};

function loginUser(req, context) {
    return Parse.Promise.as(req).
        then(function (req) {
            let username = req.body.username;

            let hasUsername = new Parse.Query(Parse.User);
            hasUsername.equalTo("username", username);

            let hasEmail = new Parse.Query(Parse.User);
            hasEmail.equalTo("email", username);

            return Parse.Query.or(hasUsername, hasEmail).first();
        }).
        then(function (user) {
            let password = req.body.password;
            if (user) {
                return Parse.User.logIn(user.get("username"), password);
            } else {
                throw new Error("user not found");
            }
        });
}

function generateJWT(login) {
    return Parse.Promise.as(login).
        then(function (login) {
            // login success!
            let auth = firebase.auth();
            let sToken = login.getSessionToken();
            let fToken;
            if (login.isModerator) {
                fToken = auth.createCustomToken(login.get("username"), claims);
            } else {
                fToken = auth.createCustomToken(login.get("username"));
            }
            return {
                createdAt: login.createdAt,
                objectId: login.id,
                sessionToken: sToken,
                firebaseToken: fToken,
            };
        });
}

module.exports = {
    loginAsMod: function loginAsMod(req, context) {
        return loginUser(req, context).then(isModerator).then(generateJWT);
    },
    login: function login(req, context) {
        return loginUser(req, context).then(generateJWT);
    }
};
