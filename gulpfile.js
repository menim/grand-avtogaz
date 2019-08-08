var gulp = require ('gulp');

var sass = require ('gulp-sass');
var browserSync = require ('browser-sync').create ();

//concatate css or js files
var useref = require ('gulp-useref');

var uglify = require ('gulp-uglify');
var gulpIf = require ('gulp-if');

//minify css
var cssnano = require ('gulp-cssnano');

var imagemin = require ('gulp-imagemin');

var cache = require ('gulp-cache');

//deleted files that are no longer useed
var del = require ('del');

//help run gulp tasks in sequence
var runSequence = require ('run-sequence');

var autoprefixer = require ('gulp-autoprefixer');

var babel = require ('gulp-babel');

var svgSprite = require ('gulp-svg-sprite'),
  svgmin = require ('gulp-svgmin'),
  cheerio = require ('gulp-cheerio'),
  replace = require ('gulp-replace');

var realFavicon = require ('gulp-real-favicon');
var fs = require ('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task ('generate-favicon', function (done) {
  realFavicon.generateFavicon (
    {
      masterPicture: 'img/favicon.png',
      dest: 'dist/img/favicons',
      iconsPath: '/',
      design: {
        ios: {
          pictureAspect: 'noChange',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true,
          },
        },
        desktopBrowser: {},
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: '#da532c',
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false,
            },
          },
        },
        androidChrome: {
          pictureAspect: 'noChange',
          themeColor: '#ffffff',
          manifest: {
            display: 'standalone',
            orientation: 'notSet',
            onConflict: 'override',
            declared: true,
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false,
          },
        },
        safariPinnedTab: {
          pictureAspect: 'silhouette',
          themeColor: '#5bbad5',
        },
      },
      settings: {
        scalingAlgorithm: 'Mitchell',
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false,
      },
      markupFile: FAVICON_DATA_FILE,
    },
    function () {
      done ();
    }
  );
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task ('inject-favicon-markups', function () {
  return gulp
    .src (['dist/*.html'])
    .pipe (
      realFavicon.injectFaviconMarkups (
        JSON.parse (fs.readFileSync (FAVICON_DATA_FILE)).favicon.html_code
      )
    )
    .pipe (gulp.dest ('dist'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task ('check-for-favicon-update', function (done) {
  var currentVersion = JSON.parse (fs.readFileSync (FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates (currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
});

gulp.task ('svgSpriteBuild', function () {
  return (gulp
      .src ('img/svg/*.svg')
      //minify svg
      .pipe (
        svgmin ({
          js2svg: {
            pretty: true,
          },
        })
      )
      // remove all fill, style and stroke declarations in out shapes
      .pipe (
        cheerio ({
          run: function ($) {
            $ ('[fill]').removeAttr ('fill');
            $ ('[stroke]').removeAttr ('stroke');
            $ ('[style]').removeAttr ('style');
          },
          parserOptions: {xmlMode: true},
        })
      )
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe (replace ('&gt;', '>'))
      //build svg sprite
      .pipe (
        svgSprite ({
          mode: {
            symbol: {
              sprite: 'sprite.svg',
              render: {
                scss: {
                  dest: '../../../sass/abstracts/_sprite.scss',
                },
              },
            },
          },
        })
      )
      .pipe (gulp.dest ('img/svg/')) );
});

gulp.task ('toES6', function () {
  gulp
    .src ('js/*.js')
    .pipe (
      babel ({
        presets: ['env'],
      })
    )
    .pipe (gulp.dest ('js'));
});

gulp.task ('prefix', function () {
  gulp
    .src ('css/*.css')
    .pipe (
      autoprefixer ({
        browsers: ['last 5 version'],
        cascade: false,
      })
    )
    .pipe (gulp.dest ('dist/css'));
});

gulp.task ('clean:dist', function () {
  return del.sync ('dist');
});

gulp.task ('fontsToDist', function () {
  return gulp.src ('fonts/*.+(woff|woff2)').pipe (gulp.dest ('dist/fonts'));
});

gulp.task ('imgToDist', function () {
  return gulp.src ('img/**/**/*.+(png|jpg|svg)').pipe (gulp.dest ('dist/img'));
});

gulp.task ('images', function () {
  return gulp
    .src ('images/**/*.+(png|jpg|gif|svg)')
    .pipe (
      cache (
        imagemin ({
          interlaced: true,
        })
      )
    )
    .pipe (gulp.dest ('dist/images'));
});

gulp.task ('useref', function () {
  return gulp
    .src ('*.html')
    .pipe (useref ())
    .pipe (gulpIf ('*.js', uglify ()))
    .pipe (gulpIf ('css/**/**/*.css', cssnano ()))
    .pipe (gulp.dest ('dist'));
});

gulp.task ('cssminify', function () {
  return gulp
    .src ('dist/css/*.css')
    .pipe (cssnano ())
    .pipe (gulp.dest ('dist/css'));
});

gulp.task ('browserSync', function () {
  browserSync.init ({
    server: {
      baseDir: '../grand-avtogaz',
    },
  });
});

gulp.task ('sass', function () {
  return gulp
    .src ('sass/**/*.scss')
    .pipe (sass ())
    .pipe (gulp.dest ('css'))
    .pipe (
      browserSync.reload ({
        stream: true,
      })
    );
});

gulp.task ('watch', ['browserSync', 'sass'], function () {
  gulp.watch ('sass/**/*.scss', ['sass']);
  gulp.watch ('*.html', browserSync.reload);
  gulp.watch ('js/**/*.js', browserSync.reload);
});

gulp.task ('build', function (callback) {
  runSequence (
    'clean:dist',
    ['imgToDist', 'fontsToDist', 'sass', 'prefix', 'useref', 'cssminify'],
    callback
  );
});

gulp.task ('default', function (callback) {
  runSequence (['sass', 'browserSync', 'watch'], callback);
});
