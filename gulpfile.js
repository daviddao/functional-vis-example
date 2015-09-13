var gulp = require("gulp");
var babel = require("gulp-babel");
var ext = require('gulp-ext-replace');
var eol = require('gulp-eol');
gulp.task("build", function () {
  return gulp.src("./src/**/*.es6")
    .pipe(eol())                        // needed for babel input
    .pipe(babel({ modules: 'ignore' })) // make the exported values globals
    .on("error", function(err){
      console.log(err);
    })
    .pipe(ext('.js'))                   // from .es6 to .js
    .pipe(gulp.dest("./src"));
});
gulp.task("watch", function(){
    gulp.watch('src/**/*.es6', ['build'])
});
gulp.task("default", ['build', 'watch']);
