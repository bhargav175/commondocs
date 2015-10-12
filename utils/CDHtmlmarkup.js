var handlebars = require('handlebars');
var fs = require('fs');
var CDHtmlMarkupService = require('./services/CDHtmlMarkupService');
var espree = require('espree');
var colors = require('colors/safe');
var escodegen = require('escodegen');

function getChildNodes(node){
	var nodeArr= [];
	if(!node){
		return nodeArr;
	}
	Object.keys(node).map(function(i){
		if(CDProparr.indexOf(i)<0){
			CDProparr.push(i);
		}
		if(typeof node[i] == "object"){
			nodeArr.push(node[i]);
		}
	});
	return nodeArr;
}

function getTemplate(node,nodeTemplates){
	if(!node){
		return "";
	}
	if(node.type && node.type==="VariableDeclaration"){
		node.sampleString = JSON.stringify(node.declarations[0],null,4);
		return nodeTemplates[1](node);
	}
	return "";
}


function getChildNodesTemplate(nodeArr,nodeTemplates){
		var template = "";
		nodeArr.map(function(i){
			var childNodes = getChildNodes(i);
			if(childNodes.length>0){
			  template += (getTemplate(i,nodeTemplates) + getChildNodesTemplate(childNodes,nodeTemplates));
			}else{
			  template += getTemplate(i,nodeTemplates);
			}
			return i;
		});
		return template;
	    
}

var CDHtmlMarkup = function(text,file,stylesheet){
	  
	  CDHtmlMarkupService.call(this);
	  this.text = text;
	  this.file = file;
	  this.stylesheet = '<link rel="stylesheet" href="'+stylesheet+'"/>';

	  this.getHtmlMarkup = function(){

	  	var dependencyLines = this.getDependencyLines();
	  	var sourceCode = this.getSource();
	  	this.tokenize();
	  	var fnList = this.getFunctions();
	  	var inlineCommentsList = this.getInlineComments();
	  	var blockCommentsList = [];
	  	var ast = "", astObj={}, genObj = {};
	  	try{
	  		astObj = espree.parse(text, { sourceType: 'module', ecmaFeatures:{ jsx : true}} );
	  		ast = JSON.stringify(astObj,null,4);
	  		genObj = escodegen.generate(astObj);

	  	}catch(e){
	  		console.log(e);
	  	}
	  	if(ast.length){
	  		console.log(colors.cyan(this.file.fileName));
	  	}
	  	var data = {
	  		"dependencies": dependencyLines,
	  		//"sourceCode":sourceCode,
	  		//"sourceCode":ast,
	  		"sourceCode":genObj,
	  		"functions":fnList,
	  		"objects":[],
	  		"inlineComments":inlineCommentsList,
	  		"blockComments":blockCommentsList,
	  		"exports":{},
	  		"warnings":{}
	  	};
		var dependencyHtml = "", sourceCodeHtml="", fnHtml= "", inlineCommentHtml ="", nodeHtml = "";
	  	var dependencyTemplateSrc = fs.readFileSync('./templates/require.html', 'utf-8');
	  	var dependencyTemplate = handlebars.compile(dependencyTemplateSrc);
		dependencyHtml = dependencyTemplate(data);

		var sourceCodeTemplateSrc = fs.readFileSync('./templates/sourceCode.html', 'utf-8');
	  	var sourceCodeTemplate = handlebars.compile(sourceCodeTemplateSrc);
		sourceCodeHtml = sourceCodeTemplate(data);

		var fnTemplateSrc = fs.readFileSync('./templates/function.html', 'utf-8');
	  	var fnTemplate = handlebars.compile(fnTemplateSrc);
		fnHtml = fnTemplate(data);

		var inlineCommentsTemplateSrc = fs.readFileSync('./templates/inline_comments.html', 'utf-8');
	  	var inlineCommentsTemplate = handlebars.compile(inlineCommentsTemplateSrc);
		inlineCommentHtml = inlineCommentsTemplate(data);

		var nodeTemplateSrc = fs.readFileSync('./templates/esprimanode.html', 'utf-8');
	  	var commonTemplate = handlebars.compile(nodeTemplateSrc);
		
		var varDeclarationTemplateSrc = fs.readFileSync('./templates/nodetypes/VariableDeclaration.html', 'utf-8');
	  	var varDeclarationTemplate = handlebars.compile(varDeclarationTemplateSrc);
	  	var astTemplates = [];
	  	astTemplates.push(commonTemplate);
	  	astTemplates.push(varDeclarationTemplate);
		  //console.log(html);

	    
		nodeHtml = getChildNodesTemplate([astObj],astTemplates);

			return '<!DOCTYPE><html><head><title>'+file.filePath+'</title></head>'+this.stylesheet
			+'<body><div class="navbar navbar-default"></div><div class="container">'
			+dependencyHtml
			//+ nodeHtml
			+ sourceCodeHtml
			//+fnHtml
			//+inlineCommentHtml
			+'</div></body></html>';
		};
		
};



module.exports = CDHtmlMarkup;