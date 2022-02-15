/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Enumerator class. Created from template build/templates/js/Enum_js.xsl. !!!DO NOT MODIFY!!!
 
 * @extends EditSelect
 
 * @requires core/extend.js
 * @requires controls/EditSelect.js
 
 * @param string id 
 * @param {object} options
 */

function Enum_role_types(id,options){
	options = options || {};
	options.addNotSelected = (options.addNotSelected!=undefined)? options.addNotSelected:true;
	options.options = [{"value":"admin",
"descr":this.multyLangValues[window.getApp().getLocale()+"_"+"admin"],
checked:(options.defaultValue&&options.defaultValue=="admin")}
];
	
	Enum_role_types.superclass.constructor.call(this,id,options);
	
}
extend(Enum_role_types,EditSelect);

Enum_role_types.prototype.multyLangValues = {"ru_admin":"Администратор"
};


