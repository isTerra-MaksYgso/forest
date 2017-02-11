'use strict';

module.exports = function() {
	$.gulp.task('copy:file', function() {
  	return $.gulp.src('./source/{fonts}/**/*.*')
     	.pipe($.gp.flatten())
    	.pipe($.gulp.dest($.config.root + '/assets/fonts'));
  	});
};