const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(gulp.dest("docs/css"))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("docs/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// JS

const js = () => {
  return gulp.src("source/js/*.js")
    .pipe(sourcemap.init())
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("docs/js"))
    .pipe(sync.stream());
}

exports.js = js;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("docs"));
}

// Copy

const copy = (done) => {
  gulp
		.src(
			[
				'source/fonts/*.{ttf,woff2,woff}',
				'source/*.ico',
				'source/img/**/*.{jpg,png,svg,gif,webp}',
				'source/css/*.css',
				'source/js/**/*.js',
			],
			{
				base: 'source',
			}
		)
		.pipe(gulp.dest('docs'));
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("docs");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "docs"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(js, reload));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    js,
    html,
    copy
  ));

exports.build = build;

// Default

exports.default = gulp.series(
  build,
  gulp.series(
    server,
    watcher
  ));
