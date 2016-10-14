"use strict"

module.exports = {
    parse: {
        appID: process.env.APP_ID,
        javascriptKey: null,
        masterKey: process.env.MASTER_KEY,
        serverURL: process.env.ADVERTISE_CLIENT_URL
    },
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        databaseURL: process.env.FIREBASE_DATABASE_URL
    }
};
