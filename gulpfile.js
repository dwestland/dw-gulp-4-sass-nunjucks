const { src, dest, watch, series, on } = require('gulp');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const nunjucksRender = require('gulp-nunjucks-render');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const terser = require('gulp-terser');

// Nunjucks Task
function nunjucks(cb) {
  src("src/pages/**/*.html")
    .pipe(
      nunjucksRender({
        path: ["src/templates/"]
      })
    )
    .pipe(dest("dist"));
  cb();
}

// Sass Task
function scssTask(){
  return src('src/scss/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('src/js/*.js', { sourcemaps: true })
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: 'dist'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('src/**/*.html', series(nunjucks, browsersyncReload));
  watch(['src/scss/**/*.scss', 'src/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  nunjucks,
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);
