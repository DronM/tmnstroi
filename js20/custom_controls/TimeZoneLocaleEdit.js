/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2021
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function TimeZoneLocaleEdit(id,options){
	options = options || {};
	options.model = new TimeZoneLocale_Model();
	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Часовой пояс:";
	}
	
	options.keyIds = options.keyIds || ["id"];
	options.modelKeyFields = [options.model.getField("id")];
	options.modelDescrFields = [options.model.getField("name")];
	
	var contr = new TimeZoneLocale_Controller();
	options.readPublicMethod = contr.getPublicMethod("get_list");
	
	TimeZoneLocaleEdit.superclass.constructor.call(this,id,options);
	
}
extend(TimeZoneLocaleEdit,EditSelectRef);

