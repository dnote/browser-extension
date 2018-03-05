import gulp from "gulp";
import gulpLoadPlugins from "gulp-load-plugins";
import del from "del";
import runSequence from "run-sequence";
import es from "event-stream";
import source from "vinyl-source-stream";
import browserify from "browserify";

const $ = gulpLoadPlugins();

const target = process.env.TARGET || "firefox";

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
    return gulp.src(files).pipe($.eslint(options)).pipe($.eslint.format());
  };
}

gulp.task(
  "lint",
  lint("src/scripts/**/*.js", {
    env: { es6: true }
  })
);

// gulp.task("images", () => {
//   return gulp
//     .src("src/images/**/*")
//     .pipe(
//       $.if(
//         $.if.isFile,
//         $.cache(
//           $.imagemin({
//             progressive: true,
//             interlaced: true,
//             // don't remove IDs from SVGs, they are often used
//             // as hooks for embedding and styling
//             svgoPlugins: [{ cleanupIDs: false }]
//           })
//         ).on("error", function(err) {
//           console.log(err);
//           this.end();
//         })
//       )
//     )
//     .pipe(gulp.dest(`dist/${target}/images`));
// });

gulp.task("styles", () => {
  return gulp
    .src("src/styles.scss/*.scss")
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
    .pipe(gulp.dest("src/styles"));
});

gulp.task("html", ["styles"], () => {
  return gulp.src("src/*.html").pipe(gulp.dest(`dist/${target}`));
});

gulp.task("babel", () => {
  let files = [
    "background.js",
    "contentscript.js",
    "popup.js",
    "livereload.js"
  ];

  let tasks = files.map(file => {
    return browserify({
      entries: "./src/scripts/" + file,
      debug: true
    })
      .transform("babelify", { presets: ["es2015"] })
      .bundle()
      .pipe(source(file))
      .pipe(gulp.dest(`dist/${target}/scripts`));
  });

  return es.merge.apply(null, tasks);
});

gulp.task("clean", del.bind(null, [".tmp", "dist"]));

gulp.task("watch", ["lint", "babel", "styles"], () => {
  $.livereload.listen();

  gulp
    .watch([
      "src/*.html",
      "src/scripts/**/*.js",
      "src/images/**/*",
      "src/styles/**/*",
      "src/_locales/**/*.json"
    ])
    .on("change", $.livereload.reload);

  gulp.watch("src/scripts.babel/**/*.js", ["lint", "babel"]);
  gulp.watch("src/styles.scss/**/*.scss", ["styles"]);
});

gulp.task("size", () => {
  return gulp.src("dist/**/*").pipe($.size({ title: "build", gzip: true }));
});

gulp.task("package", function() {
  var manifest = require("./dist/manifest.json");
  return gulp
    .src("dist/**")
    .pipe($.zip("HN Profile Card-" + manifest.version + ".zip"))
    .pipe(gulp.dest("package"));
});

gulp.task("build", cb => {
  runSequence("lint", "babel", ["html", "extras"], "size", cb);
});

gulp.task("default", ["clean"], cb => {
  runSequence("build", cb);
});
