
var CDHtmlMarkupService = function(){
	this.getLines = function(){
			return this.text.split(";").map(function(i){
				return i+";".replace(/\s\s+/g,' ');
			});
		};
	this.getDependencyLines = function(){
		return this.getLines().filter(function(i){
			return (i.indexOf("require")>=0 || i.indexOf("import")>=0 ) && (i.indexOf("//")<0); 
		}).map(function(i){
			var words = i.split(" ");
			var word = "";
			if(i.indexOf("require")>=0){
				for(var w in words){
					word = words[w];
					if(word.indexOf("require") ==0 || word.indexOf("Require")==0){
						word = word.substr("require".length).replace(/\"|\'|\(|\)|;/g,"");
						break;
					}
				}
				return "Requires " + word;
			}else{
				var fromWord = words.indexOf("from");
				if(fromWord<0){
					fromWord = words.indexOf("From");
				}
				if(fromWord >=0 && (fromWord<words.length-1)){
					return "Imports " + words[fromWord+1].replace(/\"|\'|\(|\)|;/g,"");
				}
				return "Imports "+words ;
			}
		});
	};
	this.tokenize = function(){
		var tokens = ["\n",";"];
		var blocks = ["{","}"];
		var lineBreaks = 0, semicolons=0;


		var blockStack = [];
		
		for(var i in this.text){
			var ch = this.text[i];
			var index = tokens.indexOf(ch);
			if(index>=0){
			   switch(index){
			   		case 0:
			   			lineBreaks+=1;
			   			break;
			   		default:
			   			semicolons+=1;
			   }

			}

			

			
		   	

		}
		console.log("lineBreaks ",lineBreaks);
		console.log("semicolons ",semicolons);
	};
	this.getFunctions = function(){
		var str = this.text;
		var pattern = new RegExp(/function\s*\(.*\)\s*{[\s\S]*}/g);
		//the stack
		var initList = this.text.match(pattern) || [];
		//the final list
		// console.log(initList);
		// var fnList = initList.slice();
		// while(initList.length>0){
		// 	var str = initList.shift();
		// 	if(str)	{
		// 		console.log(str);
		// 		var fns = str.match(pattern) || [];
		// 		 for(var i in fns){
		// 		 	initList.push(fns[i]);
		// 		 	fnList.push(fns[i]);
		// 		 }	
		// 	}
			 
		// }
		return initList;
	},
	this.getInlineComments = function(){
		var str = this.text;
		var pattern = new RegExp(/\s*\/\/.*/g);
		//the stack
		var initList = this.text.match(pattern) || [];
		console.log("inlinecomments"+initList.length);
		return initList;

	},
	this.getBlockComments= function(){
		// var str = this.text;
		// var pattern = new RegExp(/\/\*.*\n*.*\*\//g);
		// //the stack
		// var blockList = this.text.match(pattern) || [];
		// if(blockList.length){
		// console.log("blockcomments"+blockList.length);
			
		// }
		// return blockList;
	},
	this.getSource = function(){
		return this.text;
	};
}
module.exports = CDHtmlMarkupService;