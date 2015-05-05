var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    del = require('del'),
    reload = browserSync.reload,
    runSequence = require('run-sequence');

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
        'cleanByDistMode', ['styles', 'concat'],
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

gulp.task('styles', function() {
    return gulp.src(dirs.sass + '/main.scss')
        .pipe($.cssGlobbing({
            extensions: ['.scss']
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested', // libsass doesn't support expanded yet
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.postcss([
            require('autoprefixer-core')({
                browsers: ['last 1 version']
            })
        ]))
        .pipe($.sourcemaps.write())
        .pipe($.if(minCss, $.csso()))
        .pipe(gulp.dest(dirs.css))
        .pipe(reload({
            stream: true
        }));
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
        .pipe($.plumber())
        .pipe($.concat('scripts.js'))
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
            dirs.vend + '/**/*jquery.min.js'
        ])
        .pipe(gulp.dest(build.vend));
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch(dirs.sass + '/**/*.scss', ['styles']);
    gulp.watch([
        dirs.js + '/plugins.js',
        dirs.js + '/main.js',
        dirs.js + '/modules/**/*.js'
    ], ['concat']);
    gulp.watch(src + '/**/*.html', ['browser-reload']);
});

gulp.task('imagemin', function() {
    return gulp.src(build.img + '/**/*.{svg,png,jpg,jpeg,gif}')
        .pipe($.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(build.img))
        .pipe($.size({
            title: 'imagemin',
            showFiles: true
        }));
});

gulp.task('uglify', function(cb) {
    return gulp.src(dirs.js + '/scripts.js')
        .pipe($.if(minJs, $.uglify().on('error', console.error.bind(console, 'Uglify error:'))))
        .pipe(gulp.dest(build.js));
});
