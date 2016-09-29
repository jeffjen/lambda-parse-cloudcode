"use strict"

const babel = require("gulp-babel");
const del = require("del");
const gulp = require("gulp");
const lambda = require("gulp-awslambda");
const path = require("path");
const rename = require("gulp-rename");
const shell = require("gulp-shell")
const zip = require("gulp-zip");

const dest = {
    app: "lib",
    lambda: "dist"
};
const paths = {
    app: [
        "src/**/*",
    ],
    src: [
        "package.json",
        ".npmrc",
        "lambda.js",
        "lib/**/*"
    ]
};

gulp.task("clean", function () {
    return del([ dest.app, dest.lambda ]);
});

gulp.task("app", function () {
    return gulp.src(paths.app).
        pipe(babel({
            "presets": [ "es2015" ]
        })).
        pipe(gulp.dest(dest.app));
});

gulp.task("lambda.npm.src", [ "app" ] , function () {
    return gulp.src(paths.src, { dot: true }).
        pipe(rename(function (p) {
            switch (p.basename) {
            default:
                p.dirname = path.join("lib", p.dirname);
                break;
            case ".npmrc":
            case "lambda":
            case "package":
                break;
            }
        })).
        pipe(gulp.dest(dest.lambda));
});

gulp.task("lambda.npm", [ "lambda.npm.src" ], shell.task([
    `cd ${dest.lambda} && npm install --production`
]));

gulp.task("lambda", [ "lambda.npm" ], function() {
    gulp.src([ `${dest.lambda}/**/*`, `!${dest.lambda}/app.zip` ]).
        pipe(zip("app.zip")).
        pipe(gulp.dest(dest.lambda));
});

gulp.task("default", [ "lambda" ]);
