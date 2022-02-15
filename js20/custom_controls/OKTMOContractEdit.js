/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2022
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function OKTMOContractEdit(id,options){
	options = options || {};
	options.model = new OKTMOContractList_Model();
	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Контракт:";
	}
	
	options.keyIds = options.keyIds || ["id"];
	options.modelKeyFields = [options.model.getField("id")];
	options.modelDescrFields = [options.model.getField("name")];
	
	var contr = new OKTMOContract_Controller();
	options.readPublicMethod = contr.getPublicMethod("get_list");
	
	OKTMOContractEdit.superclass.constructor.call(this,id,options);
	
}
extend(OKTMOContractEdit,EditSelectRef);

