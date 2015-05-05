var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	browserSync = require('browser-sync'),
	del = require('del'),
	reload = browserSync.reload,
	runSequence = require('run-sequence');

var src = 'src',
	dist = 'dist',
	dirs = {
		css: src + '/assets/css',
		html: src + '/assets/html',
		img: src + '/assets/img',
		js: src + '/assets/js',
		sass: src + '/assets/sass',
		vend: src + '/assets/vendor'
	},
	build = {
		css: dist + '/assets/css',
		img: dist + '/assets/img',
		js: dist + '/assets/js',
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

gulp.task('build', function(cb) {
	runSequence(
		'cleanByDistMode', ['styles', 'concat'],
		'copyByDistMode', ['clean:sprite'],
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

gulp.task('concat', function() {
	return gulp.src([
			// Plugins
			dirs.js + '/plugins.js',
			// Vendors
			dirs.vend + '/bootstrap-sass-official/assets/javascripts/bootstrap.js',
			dirs.vend + '/**/*jquery.mask.min.js',
			dirs.vend + '/**/*retina.min.js',
			// Main
			dirs.js + '/main.js',
			// Modules
			dirs.js + '/modules/**/*.js'
		])
		.pipe($.plumber())
		.pipe($.concat('scripts.js'))
		.pipe($.if(minJs, $.uglify().on('error', console.error.bind(console, 'Uglify error:'))))
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
	gulp.watch(src + '/**/*.html').on('change', reload);
});

gulp.task('html', function() {
	return gulp.src(dirs.html + '/*.tpl.html')
		.pipe($.fileInclude())
		.pipe($.rename({
			extname: ''
		}))
		.pipe($.rename({
			extname: '.html'
		}))
		.pipe(gulp.dest(src));
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

