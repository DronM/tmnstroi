/* Copyright (c) 2022
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocProcurementEdit(id,options){
	options = options || {};	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Поступление материалов:";
	}
	options.cmdInsert = (options.cmdInsert!=undefined)? options.cmdInsert:false;
	
	options.keyIds = options.keyIds || ["id"];
	
	//форма выбора из списка
	options.selectWinClass = DocProcurementList_Form;
	options.selectDescrIds = options.selectDescrIds || ["self_descr"];
	
	//форма редактирования элемента
	options.editWinClass = null;
	
	options.acMinLengthForQuery = 1;
	options.acController = new DocProcurement_Controller(options.app);
	options.acModel = new DocProcurementList_Model();
	options.acPatternFieldId = options.acPatternFieldId || "self_descr";
	options.acKeyFields = options.acKeyFields || [options.acModel.getField("id")];
	options.acDescrFields = options.acDescrFields || [options.acModel.getField("self_descr")];
	options.acICase = options.acICase || "1";
	options.acMid = options.acMid || "1";
	
	DocProcurementEdit.superclass.constructor.call(this,id,options);
}
extend(DocProcurementEdit,EditRef);

/* Constants */


/* private members */

/* protected*/


/* public methods */

