/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2022
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function OKTMOEdit(id,options){
	options = options || {};
	options.model = new OKTMO_Model();
	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "ОКТМО:";
		options.title = options.title || "ОКТМО";
	}
	
	options.keyIds = options.keyIds || ["id"];
	options.modelKeyFields = [options.model.getField("id")];
	options.modelDescrFields = [options.model.getField("name")];
	
	var contr = new OKTMO_Controller();
	options.readPublicMethod = contr.getPublicMethod("get_list");
	
	OKTMOEdit.superclass.constructor.call(this,id,options);
	
}
extend(OKTMOEdit,EditSelectRef);

