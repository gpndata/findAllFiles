/**
 * @module framework/Utils/Find
 */

var when = require('when');
whenNode = require('when/node');
var fs = require('fs');
var path = require('path');

/**
 * Find and list all files in `directory`. Recurses to sub-directories.
 * 
 * @name module framework/Utils/Find.allFiles
 * @static
 * @param {string} directory
 * @returns {promise} Promise, which resolves to array containing list of all
 * files in `directory`
 */
function findAllFiles(dir, blacklist_regex){
	var already_loaded_dirs = [];
	function add_directory(dir){
		var all_files = [];
		return whenNode.call(fs.realpath, dir).then(function(real_dir){
			if(already_loaded_dirs.indexOf(real_dir) !== -1){
				return [];
			}
			already_loaded_dirs.push(real_dir);
			return whenNode.call(fs.readdir, dir).then(function(files){
				files = files.map(function(file){
					return path.join(dir, file);
				});
				if(blacklist_regex){
					files = files.filter(function(file){
						return !file.match(blacklist_regex);
					});
				}
				return when.map(files, function(file){
					return whenNode.call(fs.stat, file).then(function(stat){
						stat.file = file;
						return stat;
					});
				}).then(function(stats){
					stats.forEach(function(stat){
						if(stat.isFile()){
							all_files.push(stat.file);
						} else if(stat.isDirectory()) {
							all_files.push(add_directory(stat.file));
						}
					});
					return when.all(all_files).then(function(all_files){
						// hack that will transform [['bar', 'foo'], 'baz', 'spam'] to 
						// ['bar', 'foo', 'baz', 'spam']
						return Array.prototype.concat.apply([], all_files);
					});
				});
			});
		});
	}
	return whenNode.call(fs.stat, dir).then(function(stat){
		if(stat.isFile()){
			return [dir];
		} else {
			return add_directory(dir);
		}
	});
}

module.exports = findAllFiles;

