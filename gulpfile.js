var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var reload = browserSync.reload;
var prettify = require('gulp-html-prettify');
var autoprefixer = require('gulp-autoprefixer');
var gcmq = require('gulp-group-css-media-queries');
var csscomb = require('gulp-csscomb');
var minifycss = require('gulp-minify-css');
var zip = require('gulp-zip');


// jade
gulp.task('templates', function() {

	var files_local = {

	};

	return gulp.src('./app/templates/pages/*.jade')
		.pipe(jade({
			locals: files_local
		}))
		.pipe(prettify({
			brace_style: 'expand',
			indent_size: 1,
			indent_char: '\t',
			indent_inner_html: true,
			preserve_newlines: true
		}))
		.pipe(gulp.dest('./html/'));
});

// reload jade
gulp.task('jade-watch', ['templates'], reload);

// style (autoprefixer, css combo, sass )
gulp.task('sass', function () {
	return gulp.src('./app/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./html/assets/styles'))
		.pipe(autoprefixer({
			browsers: [ 'last 2 version', 'ie 9', 'ios 8', 'android 4' ],
			cascade: false
		}))
		.pipe(csscomb())
		.pipe(gcmq())
		.pipe(gulp.dest('./html/assets/styles'))
		.pipe(reload({stream: true}));
});

// copy files (robots.txt & favicons)
gulp.task('copy-resources', function() {
	gulp.src('./app/resources/**/*')
	.pipe(gulp.dest('./html/'));
});

// minify style
gulp.task('minify-css', function() {
	return gulp.src('./html/assets/styles/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('./html/assets/styles'));
});

// correct date
function correctNumber(number) {
	if ( number < 10 ) {
		number = '0' + number
	} else {
		number = number
	}
	return number;
}

// current date
 function getDateTime() {
	var now = new Date();
	var year = correctNumber(now.getFullYear());
	var month = correctNumber(now.getMonth() + 1);
	var day = correctNumber(now.getDate());

	return `${day}-${month}-${year}`;
};

// archive + date
gulp.task('zip', function(){
	var datetime = '-' + getDateTime();
	var zipName = 'html' + datetime + '.zip';
	return gulp.src(['html/**/*', '!html/*.zip'])
		.pipe(zip(zipName))
		.pipe(gulp.dest('html'));
});

// run tasks
gulp.task('default', ['sass', 'templates', 'copy-resources'], function () {
	browserSync({server: './html'});
	gulp.watch([
		'./app/scss/**/*.scss',
		'./app/scss/*.scss'],['sass']);
	gulp.watch([
		'./app/templates/layout/*.jade',
		'./app/templates/pages/*.jade',
		'./app/templates/scripts/*.jade',
		'./app/templates/blocks/*.jade'], ['jade-watch']);
});
