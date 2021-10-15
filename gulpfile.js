const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemap = require('gulp-sourcemaps');
const sync = require("browser-sync").create(); 
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat'); 
const deleteCss = require('gulp-clean-css'); 
const uglify = require('gulp-uglify-es').default;
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp');
const svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
const htmlmin = require('gulp-htmlmin');
const del = require("del");

sass.compiler = require('node-sass'); 

// Styles

const styles = () => {
    return gulp.src('app/scss/main.scss')
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(deleteCss())
        .pipe(concat('application.css'))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('public/css/'))
        .pipe(sync.stream())
}
exports.styles = styles;

// JS

const js = () => {
    return gulp.src(['app/js/plugins.js', 'app/js/main.js'])
        .pipe(sourcemap.init())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('public/js/'))
}

exports.js = js;

//Images

const images = () => {
    return gulp.src('app/assets/img/*.{jpg,png,svg}')
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.mozjpeg({ progressive: true }),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('public/assets/img'))
}
exports.images = images;

// Webp
const createWebp = () => {
    return gulp.src('app/assets/img/*.{png,jpg}')
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest('public/assets/img'))
}
exports.createWebp = createWebp;

// Sprite
const sprite = () => {
    return gulp.src("app/assets/img/**/to-sprite-*.svg")
      .pipe(svgstore())
      .pipe(rename("sprite.svg"))
      .pipe(gulp.dest("public/assets/img"))
}

exports.sprite = sprite;

// Html

const html = () => {
    return gulp.src('app/assets/**/*.html')
        .pipe(posthtml([include()]))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public/'))
        .pipe(sync.stream())
}

exports.html = html;

// Server
const server = (done) => {
    sync.init({
      server: {
        baseDir: 'public'
      },
      cors: true,
      notify: false,
      ui: false,
      open: true
    });
    done();
}
exports.server = server;

// Watcher

const watcher = () => {
    gulp.watch('app/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('app/js/**/*.*', gulp.series('js'));
    gulp.watch('app/assets/img/**/*.{jpg,png,svg}', gulp.series('images', 'createWebp', 'sprite'));
    gulp.watch('app/assets/**/*.html', gulp.series('html'));
}
exports.default = gulp.series(
    styles, html, js, server, watcher
)
// Clean
const clean = () => {
    return del('public');
}
exports.clean = clean;


// Copy

const copy = () => {
    return gulp.src([
        "app/assets/fonts/**/*.{woff,woff2,ttf}",
        "app/*.ico",
      ], {
          base: "app"
      })
      .pipe(gulp.dest('public'));
}
exports.copy = copy;

// Build

const build = gulp.series(
    clean,
    images,
    createWebp,
    sprite,
    copy,
    styles,
    js,
    html
)

exports.build = build;

// Start

const start = gulp.series(
    build,
    server,
    watcher
)

exports.start = start;