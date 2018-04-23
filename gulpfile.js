var gulp = require('gulp');
var rigger = require('gulp-rigger'); //объединяет несколько файлов в один
var browserSync = require('browser-sync').create(); //запускает сервер
var sass = require('gulp-sass'); // scss компилиурет в scc
var cssnano = require('gulp-cssnano'); //минификация css
var autoprefixer = require('gulp-autoprefixer');
var del = require('del'); //удаляет содержимое dist перед запуском
var htmlmin = require('gulp-htmlmin'); //минификация html
var imagemin = require('gulp-imagemin'); //оптимизация картинок
var mmq = require('gulp-merge-media-queries'); //объеденяет медиа запросы


gulp.task('html', ()=> {
    return gulp.src('./src/index.html')
    .pipe(rigger())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
        stream:true
    })); 
});

gulp.task('css', function () {
    return gulp.src('./src/sass/styles.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
        }))
        .pipe(mmq({
            log: false
          }))
      .pipe(rigger())
      .pipe(cssnano())
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.reload({
        stream:true
        })); 
  });

  gulp.task('js', ()=> {
    return gulp.src('./src/js/main.js')
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({
        stream:true
    })); 
});

  gulp.task('img', () =>
    gulp.src('./src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);

gulp.task('watch', function() {
    gulp.watch('./src/**/*.html', ['html'])
    gulp.watch('./src/**/*.scss', ['css']);
    gulp.watch('./src/**/*.js', ['js']);
    // gulp.watch('./src/sass/**/*.scss', ['css']);
    //первый аргумент - то, за какими файлами мы следим
    //второй аргумент - то, что нужн осделать, когда эти файлы меняются
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('del', function () {
    return del.sync('./dist');
});

gulp.task('build',['html', 'css',  'img']);
gulp.task('start', ['del','build','js','server','watch']);

