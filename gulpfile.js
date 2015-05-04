var browserSync = require('browser-sync'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    del = require('del'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload,
    runSequence = require('run-sequence'),
    size = require('gulp-size'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

var src = 'src',
    dist = 'dist',
    dirs = {
        js: src + '/assets/js',
        css: src + '/assets/css',
        img: src + '/assets/img',
        sass: src + '/assets/sass',
        vend: src + '/assets/vendor'
    },
    build = {
        js: dist + '/assets/js',
        css: dist + '/assets/css',
        img: dist + '/assets/img',
        sass: dist + '/assets/sass',
        vend: dist + '/assets/vendor'
    };

// 'full' or 'assets'
var distMode = 'assets',
    minCss = false,
    minJs = false;

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: src
        },
        port: 9000
    });
});

// Reload all Browsers
gulp.task('browser-reload', function() {
    browserSync.reload();
});

gulp.task('build', function(cb) {
    runSequence(
        'cleanByDistMode', ['compass', 'concat'],
        'copyByDistMode', ['clean:sprite', 'uglify'],
        'imagemin',
        'clean:release',
        'copy:vendors',
        cb
    );
});

gulp.task('clean:release', function(cb) {
    return del([
        build.sass,
        build.js + '/**/*',
        '!' + build.js + '/scripts.js',
        build.vend
    ], {
        force: true
    }, cb);
});

gulp.task('clean:sprite', function(cb) {
    return del([
        build.img + '/sprite/hd',
        build.img + '/sprite/standard'
    ], {
        force: true
    }, cb);
});

gulp.task('cleanByDistMode', function(cb) {
    switch (distMode) {
        case 'assets':
            return del(dist + '/assets', {
                force: true
            }, cb);
            break;
        default:
            return del(dist, {
                force: true
            }, cb);
    }
});

gulp.task('compass', function() {
    var config = {
        css: dirs.css,
        sass: dirs.sass,
        image: dirs.img,
        javascript: dirs.js
    };

    if (minCss) {
        return gulp.src([
                dirs.sass + '/main.scss',
                //dirs.sass + '/main-ie.scss',
            ])
            .pipe(plumber({
                errorHandler: function(error) {
                    console.log(error.message);
                    this.emit('end');
                }
            }))
            .pipe(compass(config))
            .on('error', gutil.log)
            .pipe(csso())
            .pipe(gulp.dest(dirs.css))
            .pipe(reload({
                stream: true
            }));
    } else {
        return gulp.src([
                dirs.sass + '/main.scss',
                //dirs.sass + '/main-ie.scss',
            ])
            .pipe(plumber({
                errorHandler: function(error) {
                    console.log(error.message);
                    this.emit('end');
                }
            }))
            .pipe(compass(config))
            .on('error', gutil.log)
            .pipe(gulp.dest(dirs.css))
            .pipe(reload({
                stream: true
            }));
    }
});

gulp.task('concat', function() {
    return gulp.src([
            // Plugins
            dirs.js + '/plugins.js',
            // Vendors
            dirs.vend + '/bootstrap-sass-official/assets/javascripts/bootstrap.js',
            // Main
            dirs.js + '/main.js',
            // Modules
            dirs.js + '/modules/**/*.js'
        ])
        .pipe(plumber())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(dirs.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('copyByDistMode', function() {
    switch (distMode) {
        case 'assets':
            return gulp.src([
                    src + '/assets/**/*'
                ])
                .pipe(gulp.dest(dist + '/assets'));
            break;
        default:
            return gulp.src([
                    src + '/**/*'
                ])
                .pipe(gulp.dest(dist));
    }
});

gulp.task('copy:vendors', function() {
    return gulp.src([
            dirs.vend + '/**/*jquery.min.js',
            dirs.vend + '/**/*jquery.mask.min.js',
            dirs.vend + '/**/*retina.min.js'
        ])
        .pipe(gulp.dest(build.vend));
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch(dirs.sass + '/**/*.scss', ['compass']);
    gulp.watch([
        dirs.js + '/plugins.js',
        dirs.js + '/main.js',
        dirs.js + '/modules/**/*.js'
    ], ['concat']);
    gulp.watch(src + '/**/*.html', ['browser-reload']);
});

gulp.task('imagemin', function() {
    return gulp.src(build.img + '/**/*.{svg,png,jpg,jpeg,gif}')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(build.img))
        .pipe(size({
            title: 'imagemin',
            showFiles: true
        }));
});

gulp.task('uglify', function(cb) {
    if (minJs) {
        return gulp.src(dirs.js + '/scripts.js')
            .pipe(uglify().on('error', gutil.log))
            .pipe(gulp.dest(build.js));
    } else {
        return gulp.src(dirs.js + '/scripts.js')
            .pipe(gulp.dest(build.js));
    }
});
