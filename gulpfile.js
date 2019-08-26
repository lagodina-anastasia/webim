var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    concatCss = require('gulp-concat-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require("gulp-svg-symbols"),
    cheerio = require('gulp-cheerio'),
    includer = require('gulp-html-ssi'),
    upmodul = require("gulp-update-modul"),
    del = require('del');
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('src/css/styles'))
});
gulp.task('css-min', ['sass'], function () {
    return gulp.src(['src/css/styles/*.css', 'src/images/svg-symbols.css'])
        .pipe(concatCss("styles.min.css"))
        .pipe(gulp.dest('src/css'));
});
gulp.task('scripts', function () {
    return gulp.src([
        'src/addons/*.js',
        'src/js/scripts/*.js'
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('src/js'));
});
gulp.task('img', function () {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images'));
});
gulp.task('svg', function () {
    gulp.src('src/images/svg/*.svg')
        .pipe(svgSprite())
        .pipe(gulp.dest('src/images'));
});
gulp.task('htmlSSI', function () {
    gulp.src('./src/html/**/*.html')
        .pipe(includer())
        .pipe(gulp.dest('./src'));
});
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./src"
        },
        notify: false
    });
});
gulp.task('watch', ['browser-sync', 'css-min', 'scripts', 'htmlSSI'], function () {
    gulp.watch('src/sass/**/*.scss', ['css-min']);
    gulp.watch('src/css/styles/*.css', ['css-min']);
    gulp.watch('src/js/scripts/*.js', ['scripts']);
    gulp.watch('src/html/**/*.html', ['htmlSSI']);
    gulp.watch('src/js/scripts.min.js', browserSync.reload);
    gulp.watch('src/*.html', browserSync.reload);
});
gulp.task('clean', function () {
    return del.sync('dist');
});
gulp.task('build', ['clean'], function () {
    var fonts = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    var images = gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images'));
    var buildImages = gulp.src(['dist/images/**/*.*', '!dist/images/**/*.svg', '!dist/images/**/*.css'])
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images'));
    var buildHtml = gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
    var buildCss = gulp.src(['src/css/styles/*.css', 'src/images/svg-symbols.css'])
        .pipe(concatCss("styles.min.css"))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
    var buildScripts = gulp.src([
        'src/addons/*.js',
        'src/js/scripts/*.js'
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('clear', function () {
    return cache.clearAll();
});
gulp.task('update', function () {
    gulp.src('package.json')
        .pipe(upmodul('latest', 'false'));
});
gulp.task('default', ['watch']);