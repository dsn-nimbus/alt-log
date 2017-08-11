const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('build', () => {
  runSequence(
    'lint',
    'del',
    'js'
  )
})

gulp.task('del', () => {
  return del(['dist']);
})

gulp.task('lint', () => {
  return gulp.src('src/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
})

gulp.task('js', () => {
  return gulp.src('src/*.js')
  .pipe(babel({presets: [
                'es2015',
                'babili'
  ]}))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist/'))
})
