/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/Controller_js20.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 
 * @class
 * @classdesc controller
 
 * @extends ControllerObjServer
  
 * @requires core/extend.js
 * @requires core/ControllerObjServer.js
  
 * @param {Object} options
 * @param {Model} options.listModelClass
 * @param {Model} options.objModelClass
 */ 

function SrvStatistics_Controller(options){
	options = options || {};
	SrvStatistics_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.add_get_statistics();
		
}
extend(SrvStatistics_Controller,ControllerObjServer);

			SrvStatistics_Controller.prototype.add_get_statistics = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('get_statistics',opts);
	
	this.addPublicMethod(pm);
}

		