var handlebars = require('handlebars');
var fs = require('fs');

module.exports = {
	  getHtmlMarkup : function(text,fileName){







		var htmlParagraphs = text.split(";").map(function(i){
			return i+";";
		}).filter(function(i){
			return (i.indexOf("require")>=0 || i.indexOf("import")>=0 ) && (i.indexOf("//")<0); 
		});
		

	  	var data = {
	  		"dependencies": htmlParagraphs
	  	};


		var html = "";

	  	var source = fs.readFileSync('./templates/require.html', 'utf-8');

	  	 

		  var template = handlebars.compile(source);
		  html = template(data);
		  console.log(html);



			return '<!DOCTYPE><html><title>'+fileName+'</title><body>'+html+'</body></html>';
		}
};