var path = require('path');
var fs = require('fs');	
var mkdirp = require("mkdirp");
var CDFile = function(filePath,sourcePath,destDir){


	this.getFilename = function(){
		return path.basename(this.filePath);
	};
	this.getFilenameWithoutExtension = function(){
		var extension = path.extname(this.filePath);
		return path.basename(this.filePath,extension);
	};

	this.getDestinationFileDir = function(){
		if(this.filePath.indexOf(this.sourcePath)>=0){
			var relativePath = this.filePath.substr(this.sourcePath.length);
			var dirName = relativePath.substr(0,relativePath.indexOf(this.fileName));
			return dirName;
		}
		else{
			return null;
		}
		return null;
	},

	this.getDestinationFilePath = function(){
		var dirName = this.destDir;
		if(this.relativeDir){
			dirName = this.destDir+"/"+this.relativeDir;
			if(!fs.existsSync(dirName)){
				mkdirp.sync(dirName);
			}
			dirName = this.destDir + "/" + this.relativeDir;
		}
		return dirName +this.fileNameNoExt+".html";;
	};
	
	//Outer dir
	this.destDir = destDir;
	this.filePath = filePath;
	this.sourcePath = sourcePath;
	this.fileName = this.getFilename();
	this.fileNameNoExt = this.getFilenameWithoutExtension();
	//relative to outer
	this.relativeDir = this.getDestinationFileDir();
	//absolute path
	this.destPath = this.getDestinationFilePath();
	
};

module.exports = CDFile;