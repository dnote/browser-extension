const fs = require("fs");
const gulp = require("gulp");
const gulpLoadPlugins = require("gulp-load-plugins");
const del = require("del");
const runSequence = require("run-sequence");
const replace = require("gulp-replace");
const es = require("event-stream");
const source = require("vinyl-source-stream");
const browserify = require("browserify");
const gulpif = require("gulp-if");

const $ = gulpLoadPlugins();

const target = process.env.TARGET || "firefox";
const isProduction = process.env.NODE_ENV === "PRODUCTION";

gulp.task("extras", () => {
  return gulp
    .src(
      [
        "src/*.*",
        "src/_locales/**",
        "!src/scripts.babel",
        "!src/*.json",
        "!src/*.html",
      ],
      {
        base: "app",
        dot: true
      }
    )
    .pipe(gulp.dest(`dist/${target}`));
});

function lint(files, options) {
  return () => {
    return gulp
      .src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task(
  "lint",
  lint("src/scripts/**/*.js", {
    env: { es6: true }
  })
);

gulp.task("images", () => {
  return gulp
    .src("src/images/**/*")
    .pipe(
      $.if(
        $.if.isFile,
        $.imagemin({
          progressive: true,
          interlaced: true,
          // don't remove IDs from SVGs, they are often used
          // as hooks for embedding and styling
          svgoPlugins: [{ cleanupIDs: false }]
        })
      )
    )
    .pipe(gulp.dest(`dist/${target}/images`));
});

gulp.task("styles", () => {
  return gulp
    .src("src/styles/*.css")
    .pipe(gulp.dest(`dist/${target}/styles`));
});

gulp.task("html", ["styles"], () => {
  return gulp.src("src/*.html").pipe(gulp.dest(`dist/${target}`));
});

gulp.task("babel", ["manifest"], () => {
  let files = ["popup.js"];
  let manifest = require(`./dist/${target}/manifest.json`);

  let tasks = files.map(file => {
    return (
      browserify({
        entries: "./src/scripts/" + file,
        debug: true
      })
        .transform("babelify", {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties"]
        })
        .bundle()
        .pipe(source(file))
        // inject variables
        .pipe(
          replace(
            "__API_ENDPOINT__",
            isProduction ? "https://api.dnote.io" : "http://127.0.0.1:5000"
          )
        )
        .pipe(
          replace(
            "__WEB_URL__",
            isProduction ? "https://dnote.io" : "http://127.0.0.1:3000"
          )
        )
        .pipe(replace("__VERSION__", manifest.version))
        .pipe(gulp.dest(`dist/${target}/scripts`))
    );
  });

  return es.merge.apply(null, tasks);
});

gulp.task("clean", del.bind(null, [".tmp", `dist/${target}`]));

gulp.task("watch", ["html", "lint", "babel", "styles", "images"], () => {
  $.livereload.listen();

  gulp
    .watch([
      "src/*.html",
      "src/scripts/**/*.js",
      "src/images/**/*",
      "src/styles/**/*"
    ])
    .on("change", $.livereload.reload);

  gulp.watch("src/scripts/**/*.js", ["lint", "babel"]);
  gulp.watch("src/*.html", ["html"]);
  gulp.watch("manifests/**/*.json", ["manifest"]);
});

gulp.task("size", () => {
  return gulp.src("dist/**/*").pipe($.size({ title: "build", gzip: true }));
});

gulp.task("package", function() {
  let manifest = require(`./dist/${target}/manifest.json`);

  return gulp
    .src(`dist/${target}/**`)
    .pipe($.zip("dnote-" + manifest.version + ".zip"))
    .pipe(gulp.dest(`package/${target}`));
});

gulp.task("manifest", () => {
  const pkg = JSON.parse(fs.readFileSync("./package.json"));

  return gulp
    .src(`manifests/${target}/manifest.json`)
    .pipe(replace("__VERSION__", pkg.version))
    .pipe(gulp.dest(`dist/${target}`));
});

gulp.task("build", cb => {
  runSequence(
    "manifest",
    "lint",
    "babel",
    ["html", "extras", "images"],
    "size",
    cb
  );
});

gulp.task("default", ["clean"], cb => {
  runSequence("build", cb);
});
