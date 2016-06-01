"use strict"

const firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: {
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
    },
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const Parse = require("parse/node");
const randomstring = require("randomstring");
module.exports = {
    sso: function sso(req, context) {
        var userMeta;
        return firebase.auth().
            verifyIdToken(req.query.id_token).
            then(function decoded(data) {
                userMeta = data;
                let query = new Parse.Query(Parse.User);
                return query.equalTo("uid", data.user_id).first();
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
                    let user = new Parse.User({
                        username: userMeta.email,
                        email: userMeta.email,
                        emailVerified: true,
                        identities: userMeta.identities,
                        password: randomstring.generate(),
                        picture: userMeta.picture,
                        uid: userMeta.user_id,
                    });
                    return user.signUp();
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
