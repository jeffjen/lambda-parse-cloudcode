"use strict"

const _ = require("lodash");

const firebase = require("firebase");
const Parse = require("parse/node");
const randomstring = require("randomstring");

module.exports = {
    sso: function sso(req, context) {
        var userMeta;
        var id_token = req.query.id_token || req.body.id_token;
        if (!id_token) {
            return firebase.Promise.reject(new Error("Required parameter `id_token` missing"));
        }
        return firebase.auth().
            verifyIdToken(id_token).
            then(function decoded(data) {
                userMeta = data;
                let query = new Parse.Query(Parse.User);
                return query.equalTo("username", data.user_id).first();
            }).
            then(function hit(user) {
                if (user) {
                    let autogen = randomstring.generate();
                    user.set("password", autogen);
                    return user.save(null, { useMasterKey: true }).
                        then(function (user) {
                            return user.logIn(user.username, autogen);
                        });
                } else {
                    let identities = _.mapKeys(userMeta.firebase.identities, (v, k) => k.replace(/\./g, "_"));
                    let user = new Parse.User({
                        displayName: userMeta.name,
                        username: userMeta.user_id,
                        email: userMeta.email || null,
                        emailVerified: (userMeta.email_verified) ? true : false,
                        identities: identities,
                        password: randomstring.generate(),
                        picture: userMeta.picture || null,
                    });
                    return user.signUp(null, { useMasterKey: true });
                }
            }).
            then(function done(user) {
                return {
                    createdAt: user.createdAt,
                    objectId: user.id,
                    sessionToken: user.getSessionToken()
                };
            });
    }
};
