var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');
var cdhtmlmarkup = require("./htmlmarkup");
module.exports = {
	getFilename : function(filePath){
		var extension = path.extname(filePath);
		return path.basename(filePath,extension);
	},

	generate : function(file,destPath){
		this.readFile(file,this.writeFile,destPath);
	},
	writeFile: function(data,fileName,destPath){
		var self = this;
		var child = exec('ls -a '+destPath, function(err, stdout, stderr) { 
				if(err){
					return console.log(err);
				}
				if(stderr){
					return console.log(stderr);
				}
				var destFilePath = destPath+"/"+fileName+".html";

				fs.writeFile(destFilePath,cdhtmlmarkup.getHtmlMarkup(data,fileName) , function(err) {
				    if(err) {
				        return console.log(err);
				    }

				    console.log("Writing "+destFilePath);
				}); 
				
		 });
},

readFile :function(filePath,callBack,destPath){
	var fileName = this.getFilename(filePath);
	 		
	fs.readFile(filePath, 'utf8', function (err,data) {
		  if (err) {
		    console.log(err);
		    return null;
		  }
		  //console.log(data);
		  callBack(data,fileName,destPath);
		});
	
}
};