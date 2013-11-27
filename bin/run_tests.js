var FS = require('fs')
  , PATH = require('path')

  , NODEUNIT = require('nodeunit')

  , testPath = PATH.resolve(process.argv[2])
  , fileMatcher = /test\.js$/
  , files


function readTree(dir) {
	var collection = []
	  , list = FS.readdirSync(dir)

	list.forEach(function (item) {
		var filepath = PATH.join(dir, item)
		  , stats = FS.statSync(filepath)

		if (stats.isDirectory()) {
			collection = collection.concat(readTree(filepath))
		} else if (stats.isFile() && fileMatcher.test(filepath)) {
			collection.push(PATH.relative(process.cwd(), filepath));
		}
	})

	return collection;
}

files = readTree(testPath);
NODEUNIT.reporters.default.run(files);