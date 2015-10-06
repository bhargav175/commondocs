#! /usr/bin/env node

var userArgs = process.argv.slice(2);
var argMap =  {};
var exec = require('child_process').exec;
var filegenerator = require('./utils/filegenerator.js');

userArgs.map(function(i,index){
	if(i === "--config"){
		argMap.config = userArgs[index+1];
	}
	if(i === "--path"){
		argMap.path = userArgs[index+1];
	}
	if(i === "--dest"){
		argMap.destPath = userArgs[index+1];
	}
})




//find $directory -type f -name "*.in"
console.log(argMap);
if(argMap.path && argMap.destPath){
	var child = exec('find '+argMap.path +' -type f -name "*.js"', function(err, stdout, stderr) {
	 	var files = stdout.split("\n");
	 	files.pop();
	 	filegenerator.generate(files,argMap);
	});	
}

