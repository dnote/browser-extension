import fs from "fs";
import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import del from "del";
import runSequence from "run-sequence";
import replace from "gulp-replace";
import es from "event-stream";
import source from "vinyl-source-stream";
import browserify from "browserify";
import gulpif from "gulp-if";

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
        "!src/styles.scss"
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
    .src("src/styles/*.scss")
    .pipe($.plumber())
    .pipe(
      $.sass
        .sync({
          outputStyle: "expanded",
          precision: 10,
          includePaths: ["."]
        })
        .on("error", $.sass.logError)
    )
    .pipe(gulp.dest(`dist/${target}/styles`));
});

gulp.task("html", ["styles"], () => {
  return gulp.src("src/*.html").pipe(gulp.dest(`dist/${target}`));
});

gulp.task("babel", ["manifest"], () => {
  let files = ["contentscript.js", "popup.js"];
  let manifest = require(`./dist/${target}/manifest.json`);

  let tasks = files.map(file => {
    return (
      browserify({
        entries: "./src/scripts/" + file,
        debug: true
      })
        .transform("babelify", {
          presets: ["es2015", "es2017", "stage-0", "react"]
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
  gulp.watch("src/styles/**/*.scss", ["styles"]);
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
