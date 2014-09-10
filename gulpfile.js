var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var coffee = require('gulp-coffee');
var spritesmith = require('gulp.spritesmith');
var pleeease = require('gulp-pleeease');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');

/* ----------------------------------------------------------------------------------
　config
---------------------------------------------------------------------------------- */
var root = "htdocs",
    config = {
   "path" : {
      "htdocs"    : root,
      "sass"      : root+"/common/compile/sass",
      "css"       : root+"/common/css",
      "coffee"    : root+"/common/compile/coffee",
      "js"        : root+"htdocs/common/js/"
   }
}

/* ----------------------------------------------------------------------------------
　Sass
---------------------------------------------------------------------------------- */

//watch task
gulp.task('sass', function () {
    gulp.src(config.path.sass+'/*')
        .pipe(sass({
        	style: 'expanded', //Output style. Can be nested, compact, compressed, expanded.
        	sourcemap: false,
        	sourcemapPath: '../scss'
        }))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest(config.path.css));
});

/* ----------------------------------------------------------------------------------
　Coffee Bulid
---------------------------------------------------------------------------------- */
gulp.task('coffee', function(){
    gulp.src(config.path.coffee+'/*.coffee') //coffeescriptがある場所
        .pipe(coffee())
        .pipe(gulp.dest(config.path.js));// htdocs/common/js/フォルダ内に吐き出す。        
});

/* ----------------------------------------------------------------------------------
　pleeease (Autoprefixer & css)
---------------------------------------------------------------------------------- */
gulp.task('ple', function() {
   gulp.src(config.path.css+'/style.css')
    .pipe(pleeease({
        fallbacks: {
            autoprefixer: ['last 4 versions', 'Android 2.3'], //ベンダープレフィックス
		    variables: true,
		    filters: true,
		    rem: false,
		    pseudoElements: true
        },
        optimizers: {
            minifier: false //圧縮の有無 true/false
        }
    }))
    .pipe(gulp.dest('./htdocs/common/css/'));
});

/* ----------------------------------------------------------------------------------
　SpriteSmith
---------------------------------------------------------------------------------- */
gulp.task('sprite', function () {
  var spriteData = gulp.src('htdocs/common/img/sprite/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png', //sprite img name
    cssName: '_sprite.scss', //生成されるscss
    algorithm: 'top-down', //top-down (default), left-right, diagonal, alt-diagonal, and binary-tree
    imgPath: '/img/sprite.png', //生成されるscssに記載されるパス
    cssFormat: 'scss', //フォーマット
    cssVarMap: function (sprite) {
      sprite.name = 'sprite-' + sprite.name;//VarMap(生成されるScssにいろいろな変数の一覧を生成)
    }
  }));
  spriteData.img.pipe(gulp.dest('htdocs/common/img/')); //imgNameで指定したスプライト画像の保存先
  spriteData.css.pipe(gulp.dest('htdocs//common/compile/sass/')); //cssNameで指定したcssの保存先
});

/* ----------------------------------------------------------------------------------
　ImageMin
---------------------------------------------------------------------------------- */
gulp.task('imagemin', function () {
    gulp.src('htdocs/common/img/*')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 3,
            optipng : true,
            gifsicle : false,
            jpegtran : true,
            svgo : false
        })) 
    .pipe(gulp.dest('htdocs/common/img/'));
});

/* ----------------------------------------------------------------------------------
　Livereload
---------------------------------------------------------------------------------- */
gulp.task('webserver', function() {
  gulp.src('htdocs/')
    .pipe(webserver({
      livereload: true,
      host: 'gulp_test', //Default:localhost
      port: '' //Default:8000
    }));
});


/* ----------------------------------------------------------------------------------
　JS build
---------------------------------------------------------------------------------- */
gulp.task('usemin', function() {
  gulp.src('htdocs/index.html')
    .pipe(usemin({
      js: [uglify()]
    }))
    .pipe(gulp.dest('htdocs/test'));
});

/* sample mark up
<!-- build:css style.css -->
<link rel="stylesheet" href="css/clear.css"/>
<link rel="stylesheet" href="css/main.css"/>
<!-- endbuild -->

<!-- build:js js/lib.js -->
<script src="../lib/angular-min.js"></script>
<script src="../lib/angular-animate-min.js"></script>
<!-- endbuild -->

<!-- build:js1 js/app.js -->
<script src="js/app.js"></script>
<script src="js/controllers/thing-controller.js"></script>
<script src="js/models/thing-model.js"></script>
<script src="js/views/thing-view.js"></script>
<!-- endbuild -->
*/

/*　圧縮のみ
gulp.task('compress', function() {
  gulp.src('htdocs/common/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('htdocs/common/js/build/'));
});
*/

/* ----------------------------------------------------------------------------------
　Default task
---------------------------------------------------------------------------------- */
gulp.task('watch', function() {
	gulp.watch(config.path.sass+'**/*.scss', ['sass']);
	gulp.watch(config.path.coffee+'/*.coffee', ['coffee']);
  gulp.watch(config.path.css+'/style.css', ['ple']);
});

/* ----------------------------------------------------------------------------------
　Default task
---------------------------------------------------------------------------------- */
gulp.task('default', function() {
  gulp.run('webserver');
  gulp.run('sprite');
  gulp.run('imagemin');
  gulp.run('usemin');
  gulp.run('watch');
});