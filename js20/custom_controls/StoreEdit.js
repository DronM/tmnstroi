/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2022
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function StoreEdit(id,options){
	options = options || {};
	options.model = new StoreList_Model();
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Место хранения:";
	}
	
	options.keyIds = options.keyIds || ["store_id"];
	options.modelKeyFields = [options.model.getField("id")];
	options.modelDescrFields = [options.model.getField("name")];
	
	var contr = new Store_Controller();
	options.readPublicMethod = contr.getPublicMethod("get_list");
	
	StoreEdit.superclass.constructor.call(this,id,options);
	
}
extend(StoreEdit,EditSelectRef);

