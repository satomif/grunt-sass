'use strict';
var path = require('path');
var eachAsync = require('each-async');
var assign = require('object-assign');
var sass = require('node-sass');

module.exports = function (grunt) {
	grunt.verbose.writeln('\n' + sass.info + '\n');

	grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
		eachAsync(this.files, function (el, i, next) {
			var opts = this.options({
				precision: 10
			});

			el.src.forEach(function(src) {
				grunt.log.error('src file:' + src + '\n');

				if (!src || path.basename(src)[0] === '_') {
					next();
					return;
				}

				var dest = src.replace("scss","css");
				if (!el.dest) {
					if (opts.destDir) {
						var buff = src.split('/');
						var file = buff[buff.length-1];
						var dest = opts.destDir + file.replace("scss","css");
					} else {
						var dest = el.dest;
						dest = src.replace("scss","css");
					}
				}
				grunt.log.error('dest file:' + dest + '\n');

				sass.render(assign({}, opts, {
					file: src,
					outFile: dest
				}), function (err, res) {
					if (err) {
						grunt.log.error(err.message + '\n  ' + 'Line ' + err.line + '  Column ' + err.column + '  ' + path.relative(process.cwd(), err.file) + '\n');
						grunt.warn('');
						next(err);
						return;
					}

					grunt.file.write(dest, res.css);

					if (opts.sourceMap) {
						grunt.file.write(this.options.sourceMap, res.map);
					}

					next();
				});
			});
		}.bind(this), this.async());
	});
};

