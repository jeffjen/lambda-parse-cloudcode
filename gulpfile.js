"use strict"

const del = require("del");
const gulp = require("gulp");
const zip = require("gulp-zip");

let dest = {
    app: "lib",
    lambda: "dist"
};
let paths = {
    app: "./src/**",
    lambda: [
        ".env",
        "package.json",
        "cloudcode.js",
        "lambda.js",
        "lib/**",
        "node_modules/**",
        "!node_modules/del/",
        "!node_modules/del/**",
        "!node_modules/gulp/",
        "!node_modules/gulp/**",
        "!node_modules/gulp-zip/",
        "!node_modules/gulp-zip/**",
    ]
};

gulp.task("clean", function () {
    return del([ dest.app, dest.lambda ]);
});

gulp.task("app", function () {
    gulp.src(paths.app).
        pipe(gulp.dest(dest.app));
});

gulp.task("lambda", function() {
    gulp.src(paths.lambda, { base: "." })
        .pipe(zip("app.zip"))
        .pipe(gulp.dest(dest.lambda));
});

gulp.task("default", [ "app", "lambda" ]);
