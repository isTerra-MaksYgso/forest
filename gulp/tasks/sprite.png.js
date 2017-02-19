'use strict';

module.exports = function() {
	$.gulp.task('sprite:png', function () {
	    return $.gulp.src('./source/sprite/spritePNG/*.png')
			.pipe($.gp.spritesmith({
	            imgName: 'sprite.png',
                styleName: 'sprite.scss',
                imgPath: $.config.root + '/assets/img/sprite.png',
                padding: 70
	        }))
			.pipe($.gulp.dest($.config.root + '/assets/img'));
	})
};
