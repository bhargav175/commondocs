var exec = require('child_process').exec;
var fs = require('fs');
var CDHtmlmarkup = require("./CDHtmlmarkup");
var CDFile = require("../classes/CDFile");
var esprima = require('esprima');

module.exports = {
	
	destPath:"",
	path : "",
	stylesheet:"",
	generate : function(files,argMap){
		this.destPath = argMap.destPath;
		this.sourcePath = argMap.path;
		this.stylesheet = argMap.stylesheet;
		
		for(var i in files){
			var filePath = files[i];
			app.files[filePath]=new CDFile(filePath,this.sourcePath, this.destPath);
		}
		for(var i in files){
			this.readFile(app.files[files[i]],this.writeFile);	
		}
		console.log("reading done");
	},


	writeFile: function(data,file,destFilePath,stylesheet){
		var self = this;
		fs.writeFile(destFilePath, new CDHtmlmarkup(data,file,stylesheet).getHtmlMarkup() , function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("Writing "+destFilePath);
		}); 
				
},

readFile :function(file,callBack){
	var fileName = file.fileName;
	var filePath = file.filePath;
	var destFilePath = file.destPath;
	var stylesheet = this.stylesheet;
	 		
	fs.readFile(filePath, 'utf8', function (err,data) {
		  if (err) {
		    console.log(err);
		    return null;
		  }
		  //console.log(data);
		  
		  callBack(data,file,destFilePath,stylesheet);
		});
	
}
};