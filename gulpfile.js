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
        "src/**/*"
    ],
    lambda: {
        lib: "lib/**/*",
        meta: [
            "package.json",
            ".npmrc",
        ],
        src: [
            "cloudcode.js",
            "lambda.js",
            "lambda.config.js"
        ]
    }
};

gulp.task("clean", function () {
    return del([ dest.app, dest.lambda ]);
});

gulp.task("app", function () {
    return gulp.src(paths.app).
        pipe(babel({
            presets: [ "es2015" ],
            plugins: [ "inline-package-json", "transform-inline-environment-variables", "transform-runtime" ]
        })).
        pipe(babel({
            plugins: [ "minify-dead-code-elimination" ],
        })).
        pipe(gulp.dest(dest.app));
});

gulp.task("lambda.npm.lib", [ "app" ] , function () {
    return gulp.src(paths.lambda.lib, { dot: true }).
        pipe(gulp.dest(dest.lambda + "/lib"));
});

gulp.task("lambda.npm.meta", function () {
    return gulp.src(paths.lambda.meta, { dot: true }).
        pipe(gulp.dest(dest.lambda));
});

gulp.task("lambda.npm.src", [ "lambda.npm.lib", "lambda.npm.meta" ] , function () {
    return gulp.src(paths.lambda.src, { dot: true }).
        pipe(babel({
            presets: [ "es2015" ],
            plugins: [ "inline-package-json", "transform-inline-environment-variables", "transform-runtime" ]
        })).
        pipe(babel({
            plugins: [ "minify-dead-code-elimination" ],
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
