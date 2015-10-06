var exec = require('child_process').exec;
var fs = require('fs');
var cdhtmlmarkup = require("./htmlmarkup");
var CDFile = require("../classes/CDFile");

module.exports = {
	
	content : {},
	destPath:"",
	path : "",
	generate : function(files,argMap){
		if(argMap.destPath[argMap.destPath.length-1]=="/"){
			argMap.destPath = argMap.destPath.substr(0,argMap.destPath.length-2);
		}
		this.destPath = argMap.destPath;
		this.sourcePath = argMap.path;
		this.content = {};
		for(var i in files){
			var filePath = files[i];
			this.content[filePath]=new CDFile(filePath,this.sourcePath, this.destPath);
		}
		//console.log(this.content);
		for(var i in files){
			this.readFile(this.content[files[i]],this.writeFile);	
		}
	},


	writeFile: function(data,fileName,destFilePath){
		var self = this;
		fs.writeFile(destFilePath,cdhtmlmarkup.getHtmlMarkup(data,fileName) , function(err) {
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
	 		
	fs.readFile(filePath, 'utf8', function (err,data) {
		  if (err) {
		    console.log(err);
		    return null;
		  }
		  //console.log(data);
		  callBack(data,fileName,destFilePath);
		});
	
}
};