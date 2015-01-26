var assert = require('assert');
var path = require('path');
var findAllFiles = require('../index.js');;

describe('findAllFiles', function(){
	it('should find all files in the given directory', function(){
		return findAllFiles(path.join(__dirname, '../test-assets/find')).then(function(files){
			files.sort();
			var target = [
				'test-assets/find/a/aa/aaa.txt',
				'test-assets/find/b/ba.txt',
				'test-assets/find/b/bb.txt',
				'test-assets/find/c/sym/csyma.txt'
			];
			target = target.map(function(entry){
				return path.resolve(__dirname, '../', entry);
			});
			assert.deepEqual(files,target);
		});
	});
	it('should skip blacklisted files', function(){
		return findAllFiles(path.join(__dirname, '../test-assets/find-blacklist'), /\/blacklisted\//).then(function(files){
			var target = [
				'test-assets/find-blacklist/whitelisted.test'
			];
			target = target.map(function(entry){
				return path.resolve(__dirname, '../', entry);
			});
			assert.deepEqual(files,target);
		});
	})
});
