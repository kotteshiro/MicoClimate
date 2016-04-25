var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src("server/scripts/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("server/build/scripts"));
});
