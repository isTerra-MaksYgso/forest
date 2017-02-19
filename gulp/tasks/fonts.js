/*'use strict';

module.exports = function() {
  $.gulp.task('fontgen', function() {
    return $.gulp.src('./source/fonts/*.{ttf,otf}')
		.pipe($.gp.fontgen({
			dest: $.config.root + '/assets/fonts'
		}));
	})
};
// .pipe($.gulp.dest($.config.root + '/assets/css'))*/