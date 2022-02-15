/* Copyright (c) 2016
 *	Andrey Mikhalevich, Katren ltd.
 */
function UserDialog_View(id,options){	

	options = options || {};
	options.controller = new User_Controller();
	options.model = (options.models&&options.models.UserDialog_Model)? options.models.UserDialog_Model : new UserDialog_Model();

	options.addElement = function(){
		this.addElement(new UserNameEdit(id+":name"));

		this.addElement(new Enum_role_types(id+":role",{
			"labelCaption":"Роль:",
			"required":true
		}));	
		
		this.addElement(new EditEmail(id+":email",{
			"labelCaption":"Эл.почта:"
		}));	

		this.addElement(new EditPhone(id+":phone_cel",{
			"labelCaption":"Моб.телефон:"
		}));
		
		this.addElement(new EditString(id+":name_full",{
			"maxLength":"200",
			"labelCaption":"ФИО:"
		}));

		this.addElement(new OKTMOEdit(id+":oktmo_ref",{
		}));
		
	}	
	
	UserDialog_View.superclass.constructor.call(this,id,options);
	
	//****************************************************	
	
	//read
	var r_bd = [
		new DataBinding({"control":this.getElement("name")}),
		new DataBinding({"control":this.getElement("name_full")}),
		new DataBinding({"control":this.getElement("role"),"field":this.m_model.getField("role_id")}),
		new DataBinding({"control":this.getElement("oktmo_id"),"field":this.m_model.getField("oktmo_ref")}),
		new DataBinding({"control":this.getElement("email")})
	];
	this.setDataBindings(r_bd);
	
	//write
	this.setWriteBindings([
		new CommandBinding({"control":this.getElement("name")}),
		new CommandBinding({"control":this.getElement("name_full")}),
		new CommandBinding({"control":this.getElement("role"),"fieldId":"role_id"}),
		new CommandBinding({"control":this.getElement("oktmo_id"),"fieldId":"oktmo_ref"}),
		new CommandBinding({"control":this.getElement("email")})
	]);
}
extend(UserDialog_View,ViewObjectAjx);
