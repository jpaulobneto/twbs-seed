var browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	csscomb = require('gulp-csscomb'),
	del = require('del'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	imagemin = require('gulp-imagemin'),
	nib = require('nib'),
	reload = browserSync.reload,
	runSequence = require('run-sequence'),
	size = require('gulp-size'),
	stylus = require('gulp-stylus'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch');

var src = 'src',
	dist = 'dist',
	dirs = {
		js: src + '/assets/js',
		css: src + '/assets/css',
		img: src + '/assets/img',
		styl: src + '/assets/stylus',
		vend: src + '/assets/vendor'
	},
	build = {
		js: dist + '/assets/js',
		css: dist + '/assets/css',
		img: dist + '/assets/img',
		styl: dist + '/assets/stylus',
		vend: dist + '/assets/vendor'
	};

// 'full' or 'assets'
var distMode = 'full',
	minJs = true;

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
		'cleanByDistMode',
		['stylus', 'stylus:ie', 'concat'],
		'copyByDistMode',
		// 'csscomb:dist',
		['clean:sprite', 'uglify'],
		'imagemin',
		'clean:release',
		'copy:vendors',
		cb
	);
});

gulp.task('clean:release', function(cb) {
	return del([
		build.styl,
		build.js + '/**/*',
		'!' + build.js + '/scripts.js',
		build.vend
	], cb);
});

gulp.task('clean:sprite', function(cb) {
	return del([
		build.img + '/sprite/hd',
		build.img + '/sprite/standard'
	], cb);
});

gulp.task('cleanByDistMode', function(cb) {
	switch (distMode) {
		case 'assets':
			return del(dist + '/assets', cb);
			break;
		default:
			return del(dist, cb);
	}
});

gulp.task('concat', function() {
	return gulp.src([
		// Plugins
		dirs.js + '/plugins.js',
		// Vendors
		dirs.vend + '/bootstrap-stylus/js/transition.js',
		dirs.vend + '/bootstrap-stylus/js/alert.js',
		dirs.vend + '/bootstrap-stylus/js/button.js',
		dirs.vend + '/bootstrap-stylus/js/carousel.js',
		dirs.vend + '/bootstrap-stylus/js/collapse.js',
		dirs.vend + '/bootstrap-stylus/js/dropdown.js',
		dirs.vend + '/bootstrap-stylus/js/modal.js',
		dirs.vend + '/bootstrap-stylus/js/tooltip.js',
		dirs.vend + '/bootstrap-stylus/js/popover.js',
		dirs.vend + '/bootstrap-stylus/js/scrollspy.js',
		dirs.vend + '/bootstrap-stylus/js/tab.js',
		dirs.vend + '/bootstrap-stylus/js/affix.js',
		// Main
		dirs.js + '/main.js',
		// Modules
		dirs.js + '/modules/**/*.js'
	])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(dirs.js))
		.pipe(reload({stream: true}));
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

gulp.task('csscomb:dist', function() {
	return gulp.src([
		build.css + '/main.css',
		build.css + '/main-ie.css'
	])
		.pipe(csscomb())
		.pipe(gulp.dest(build.css));
});

gulp.task('default', ['browser-sync'], function() {
	gulp.watch(dirs.styl + '/**/*.styl', ['stylus']);
	gulp.watch([
		dirs.js + '/plugins.js',
		dirs.js + '/main.js',
		dirs.js + '/modules/**/*.js'
	], ['concat']);
	gulp.watch(src + '/**/*.html', ['browser-reload']);
});

gulp.task('imagemin', function () {
	return gulp.src(build.img + '/**/*.{svg,png,jpg,jpeg,gif}')
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(build.img))
		.pipe(size({title: 'imagemin', showFiles: true}));
});

gulp.task('stylus', function() {
	return gulp.src(dirs.styl + '/main.styl')
		.pipe(stylus({
			use: nib(),
			compress: true,
			linenos: false
		}))
		.pipe(gulp.dest(dirs.css))
		.pipe(reload({stream: true}));;
});

gulp.task('stylus:ie', function() {
	return gulp.src(dirs.styl + '/main-ie.styl')
		.pipe(stylus({
			use: nib(),
			compress: true,
			linenos: false
		}))
		.pipe(gulp.dest(dirs.css))
		.pipe(reload({stream: true}));;
});

gulp.task('uglify', function() {
	if (minJs) {
		return gulp.src(build.js + '/scripts.js')
			.pipe(uglify().on('error', gutil.log))
			.pipe(gulp.dest(build.js));
	}
});
