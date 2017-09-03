var gulp = require('gulp');
var bower = require('bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jscsstylish = require('gulp-jscs-stylish');
var ngAnnotate = require('gulp-ng-annotate');
var bytediff = require('gulp-bytediff');
var inject = require('gulp-inject');
var minimist = require('minimist');
var replace = require('gulp-replace');

var appPath = './www/js/';
var homePagePath = './www/templates/home';
var moduleInsertPoint = '// autoRegisterModule';
var autoGenerateTabItem = '<!-- autoGenerateTabItem -->';

var knownOptions = {
  string: [
    'vpath', 'modelname', 'type', 'display'
  ],
  default: {
    vpath: '**', modelname: 'demo', type: 'list', display: ''
  }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('default', ['sass', 'validate', 'minifyjs']);

gulp.task('sass', function (done) {
  gulp.src('./scss/!(ionic.app).scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/assets/global/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/assets/global/css/'));

  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/lib/ionic/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/lib/ionic/css/'))
    .on('end', done);
});

gulp.task('validate', function () {
  gulp.src('./www/templates/' + options.vpath + '/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jscs('.jscsrc'))
    .pipe(jscsstylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minifyjs', function () {
  gulp.src([
    './www/js/app.js',
    './www/templates/**/*.module.js',
    './www/templates/**/!(*.module)*.js'
  ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./www/assets/global/js'))
    .pipe(ngAnnotate({
      add: true
    }))
    .pipe(bytediff.start())
    .pipe(uglify({mangle: true}))
    .pipe(rename({extname: '.min.js'}))
    .pipe(bytediff.stop())
    .pipe(gulp.dest('./www/assets/global/js'));
});

gulp.task('watch', function () {
  gulp.watch(['sass', 'minifyjs']);
});

gulp.task('index', function () {
  var target = gulp.src('./www/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src([
    './www/js/app.js',
    './www/templates/**/*.module.js',
    './www/templates/**/!(*.module)*.js',
    './www/lib/ionic/css/ionic.app.css',
    './www/assets/global/css/app.css'
  ], {read: false});

  return target
    .pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./www'));
});

gulp.task('buildindex', function () {
  var target = gulp.src('./www/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src([
    './www/assets/global/js/app.min.js',
    './www/lib/ionic/css/ionic.app.min.css',
    './www/assets/global/css/app.min.css'
  ], {read: false});

  return target
    .pipe(inject(sources, {relative: true}))
    .pipe(gulp.dest('./www'));
});

gulp.task('generate', function () {
  gulp.src('./model/' + options.type + '/!(*.route).*')
    .pipe(rename(function (path) {
      var baseName = path.basename;
      if (path.extname === '.js') {
        var fileNames = baseName.split('.');
        path.basename = options.modelname + '.' + fileNames[1];
      } else if (path.extname === '.html') {
        path.basename = options.modelname;
      }
    }))
    .pipe(replace('Model', options.modelname))
    .pipe(gulp.dest('./www/templates/' + options.modelname));

  var stateName = '';
  var viewName = '';
  if (options.display === 'tab') {
    stateName = 'home.' + options.modelname;
    viewName = options.modelname;
  } else {
    stateName = options.modelname;
    viewName = 'main-content';
  }

  gulp.src('./model/' + options.type + '/model.route.js')
    .pipe(rename(function (path) {
      var baseName = path.basename;
      var fileNames = baseName.split('.');
      path.basename = options.modelname + '.' + fileNames[1];
    }))
    .pipe(replace('Model', options.modelname))
    .pipe(replace('StateName', stateName))
    .pipe(replace('ViewName', viewName))
    .pipe(gulp.dest('./www/templates/' + options.modelname));

  gulp.src(appPath + '/app.js')
    .pipe(replace(moduleInsertPoint, ',\r\n    \'app.' + options.modelname + '\'' + moduleInsertPoint))
    .pipe(gulp.dest(appPath));

  if (options.display === 'tab') {
    var tabItem = '' +
      '<ion-tab title="' + options.modelname + '" ' +
      'icon-on="ion-ios-cloud" ' +
      'icon-off="ion-ios-cloud-outline" ' +
      'href="#/app/home/' + options.modelname + '">' +
      '<ion-nav-view name="' + options.modelname + '"></ion-nav-view>' +
      '</ion-tab>';
    gulp.src(homePagePath + '/home.html')
      .pipe(replace(autoGenerateTabItem, tabItem + '\r\n    ' + autoGenerateTabItem))
      .pipe(gulp.dest(homePagePath));
  }
});

gulp.task('build', ['sass', 'validate', 'minifyjs', 'buildindex']);
