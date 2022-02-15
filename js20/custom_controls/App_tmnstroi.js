/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2021
 
 * @class
 * @classdesc
	
 * @param {object} options
 */	
function App_tmnstroi(options){
	options = options || {};
	options.lang = "ru";
	App_tmnstroi.superclass.constructor.call(this,"tmnstroi",options);
}
extend(App_tmnstroi,App);

/* Constants */
App_tmnstroi.prototype.SERV_RESPONSE_MODEL_ID = "Response";
App_tmnstroi.prototype.EVENT_MODEL_ID = "Event";

/* private members */

/* protected*/


/* public methods */
App_tmnstroi.prototype.makeItemCurrent = function(elem){
	if (elem){
		var l = DOMHelper.getElementsByAttr("active", document.body, "class", true,"LI");
		for(var i=0;i<l.length;i++){
			DOMHelper.delClass(l[i],"active");
		}
		DOMHelper.addClass((elem.tagName.toUpperCase()=="LI")? elem:elem.parentNode,"active");
		if (elem.nextSibling){
			elem.nextSibling.style="display: block;";
		}
	}
}

App_tmnstroi.prototype.showMenuItem = function(item,c,f,t,extra,title){
	App_tmnstroi.superclass.showMenuItem.call(this,item,c,f,t,extra,title);
	this.makeItemCurrent(item);
}

App_tmnstroi.prototype.formatError = function(erCode,erStr){
	return (erStr +( (erCode)? (", код:"+erCode):"" ) );
}

