#! /usr/bin/env node

var userArgs = process.argv.slice(2);
var exec = require('child_process').exec;
var filegenerator = require('./utils/filegenerator.js');

CDProparr = [];

app = {
	argMap :  {
		//stylesheet : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'
		stylesheet:'/srv/deployed/web-app/emo/static/js/angular/bootstrap.min.css'

	},
	init : function(){
		var self = this;
		userArgs.map(function(i,index){
			if(i === "--config"){
				self.argMap.config = userArgs[index+1];
			}
			if(i === "--path"){
				self.argMap.path = userArgs[index+1];
			}
			if(i === "--dest"){
				self.argMap.destPath = userArgs[index+1];
			}
			if(i === "--stylesheet"){
				self.argMap.stylesheet = userArgs[index+1];
			}
		});

		

	},
	generateFiles : function(){
		//find $directory -type f -name "*.in"
		if(this.argMap.path && this.argMap.destPath){
			var self = this;
			var child = exec('find '+self.argMap.path +' -type f -name "*.js"', function(err, stdout, stderr) {
			 	var files = stdout.split("\n");
			 	files.pop();
			 	filegenerator.generate(files,self.argMap);
			});	
		}
	},
	directores : [],
	files : []

};


app.init();

app.generateFiles();
