var fs = require('fs');
var path = require('path');
var posixPath = path.posix;

var gulp = require('gulp');
var gutil = require("gulp-util");
var rimraf = require('rimraf');
var vftp = require( 'vinyl-ftp' );
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var imageisux = require('gulp-imageisux');
var imageisuxPoll = require('gulp-imageisux-poll');
var webpackStream = require('webpack-stream');
var replace = require('gulp-replace');
var fileInline = require('gulp-file-inline');
var gulpIgnore = require('gulp-ignore');

/**
 * Change to your deploy configs.
 */
var deployConfig = {
	test: { 					// Publish mode. Default: 'test'
		htmlFtp: 't_c',		// Ftp name uesed to upload html files. Required
		htmlRoot: 'test',		// Root dir where keep html files. Default: ''
		assetFtp: 't_c', 	// Same as htmlFtp. Default: 'img'
		assetRoot: 'test',	// Same as htmlRoot
		revision: false,		// If append revision to asset path. Default: true
		withHash: false        // If build "vendor" file with hash. Default: true. Equals to "js/vendor.[chunkhash].js"
	},
	pro: {
		htmlFtp: 'c_m',
		assetRoot: 'apps'
	}
};

var projectName = JSON.parse(fs.readFileSync('package.json', 'utf-8')).name;
var profile = JSON.parse(fs.readFileSync('.profile', 'utf-8'));
var publishMode = gutil.env.p ? 'pro' : 'test';
var publishConfig = global.publish = initPublishConfig(publishMode);
var webpackConfig = require('./webpack.config.prod');
var webpackStats;  // Record webpack build stats

// Set build env. Important!
process.env.NODE_ENV = 'production';

/**
 * Tasks
 */
gulp.task('clean', function(callback) {
	rimraf('dist', function(err) {
		if (err) throw new gutil.PluginError("clean", err);
		callback();
	});
});

// Compile js/css/img by webpack
gulp.task('assets', ['clean'], function() {
	var conn = createConnection(publishConfig.assetFtp);

	return gulp.src('src/js/index.js')
		.pipe(webpackStream(webpackConfig, null, function(err, stats) {
			webpackStats = stats.toJson({
				chunks: true,
				modules: true,
				chunkModules: true,
				reasons: true,
				cached: true,
				cachedAssets: true
			});

			fs.writeFile('./analyse.log', JSON.stringify(webpackStats, null, 2));
		}))
		.pipe(gulp.dest('dist'))
		.pipe(gulpIgnore.exclude(['**/*.map', '**/{img,img/**}']))
		.pipe(conn.dest(publishConfig.assetDir));
});

// Replace assets' path in html files
gulp.task('html', ['assets'], function() {
	var apr = publishConfig.assetPathRevised;
	var conn = createConnection(publishConfig.htmlFtp);

	return gulp.src('src/*.html')
		.pipe(htmlreplace({
			css: {
				src: apr + 'css',
				tpl: '<link rel="stylesheet" href="%s/%f.css">'
			},
			js: {
				src: apr + 'js',
				tpl: '<script src="%s/%f.js"></script>'
			}
		}))
		.pipe(fileInline({
			js: {
				filter: function(tag) {
					return tag.indexOf(' data-inline="true"') > 0;
				}
			}
		}))
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyJS: true, minifyCSS: true }))
		.pipe(gulp.dest('dist'))
		.pipe(gulp.dest('backup/' + publishConfig.revision))
		// .pipe(conn.dest(publishConfig.htmlDir)); // todo
});

// Optimize images
gulp.task('isux', function() {
	var dest = '_min';

	rimraf.sync('dist/img/' + dest);
	return gulp.src(['dist/img/*'])
		.pipe(imageisux('/_min/', false))
		.pipe(imageisuxPoll(dest));
});

gulp.task('img', function () {
	var conn = createConnection(publishConfig.assetFtp);

	gulp.src(['dist/img/**'], { buffer: false })
		.pipe(conn.dest(publishConfig.assetDir + '/img'));
});

gulp.task('mocks', function () {
	var conn = createConnection(publishConfig.assetFtp);

	gulp.src(['src/mocks/**'], { buffer: false })
		.pipe(conn.dest(publishConfig.assetDir + '/mocks'));
});

// Start
gulp.task('default', ['html'], function() {
	gutil.log('Done!');
	gutil.log('HTML published at ' + gutil.colors.inverse(publishConfig.htmlPath));
	gutil.log('Assets deployed at ' + gutil.colors.inverse(publishConfig.assetPathRevised));
});


/**
 * Utils
 */
function initPublishConfig(mode) {
	var dc = deployConfig[mode],
		revision = dc.revision === false ? '' : Date.now() + '',
		hash = dc.withHash !== false,

		assetFtp = profile.ftp[dc.assetFtp || 'img'],
		assetRoot = dc.assetRoot || '',
		assetDir = posixPath.join('/', assetRoot, projectName),
		assetPath = assetFtp.origin + assetDir + '/',
		assetPathRevised = assetFtp.origin + posixPath.join(assetDir, revision, '/'),

		htmlFtp = profile.ftp[dc.htmlFtp],
		htmlRoot = dc.htmlRoot || '',
		htmlDir = posixPath.join('/', htmlRoot, projectName),
		htmlPath = htmlFtp.origin + htmlDir + '/';

	return {
		revision: revision,
		hash: hash,

		assetFtp: assetFtp,
		assetDir: assetDir,
		assetPath: assetPath,
		assetPathRevised: assetPathRevised,

		htmlFtp: htmlFtp,
		htmlDir: htmlDir,
		htmlPath: htmlPath
	};
}

function createConnection(ftpConfig) {
	var options = {
		host: ftpConfig.host,
		port: ftpConfig.port,
		user: ftpConfig.username,
		password: ftpConfig.password,
		parallel: 5
	};

	if ( ftpConfig.secure ) {
		options.secure = true;
		options.secureOptions = {
			requestCert: true,
			rejectUnauthorized: false
		}
	}

	return vftp.create(options);
}