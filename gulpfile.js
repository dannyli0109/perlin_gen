const { src, dest, series, task, parallel, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const gulpSass = require("gulp-sass");
const dartSass = require("sass");
const sass = gulpSass(dartSass);
const concat = require("gulp-concat");


const stylePaths = ["src/**/*.scss"];
const srcPaths = ["src/**/*", "!src/working/**/*"]

function reload() {
    browserSync.reload();
}   

function buildStyles() {
    return src(stylePaths)
      .pipe(sass().on("error", sass.logError))
      .pipe(concat("build.css"))
      .pipe(dest("./src"));
  }
  

function watchScss() {
    watch(stylePaths, buildStyles);
  }
  
  function watchSrc() {
    watch(srcPaths).on("change", reload);
  }

  function serve() {
    browserSync.init({
      server: {
        baseDir: "./src"
      },
    });
  }
  
  exports.build = series(
    buildStyles
  );

  exports.default = series(
    exports.build,
    parallel(watchScss, watchSrc, serve)
  );