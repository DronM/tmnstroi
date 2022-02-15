/* Copyright (c) 2016, 2021
 *	Andrey Mikhalevich, Katren ltd.
 */
function UserProfile_View(id,options){	

	options = options || {};
	
	options.cmdOkAsync = false;
	options.cmdOk = false;
	options.cmdCancel = false;
	
	var self = this;
	options.addElement = function(){
		this.addElement(new UserNameEdit(id+":name",{
			"events":{
				"keyup":function(){
					self.getControlSave().setEnabled(true);
				}
			}
			
		}));	

		this.addElement(new EditPassword(id+":pwd",{
			"labelCaption":"Пароль:",
			"events":{
				"keyup":function(){
					self.checkPass();	
				}
			}
		}));	
		this.addElement(new EditPassword(id+":pwd_confirm",{
			"labelCaption":"Подтверждение пароля:",
			"events":{
				"keyup":function(){
					self.checkPass();	
				}
			}
		}));	

		this.addElement(new EditEmail(id+":email",{
			"labelCaption":"Эл.почта:",
			"events":{
				"keyup":function(){
					self.getControlSave().setEnabled(true);
				}
			}		
		}));	

		this.addElement(new EditString(id+":tel_ext",{
			"maxLength":10,
			"labelCaption":"Внутр.номер:",
			"events":{
				"keyup":function(){
					self.getControlSave().setEnabled(true);
				}
			}		
		}));	
		this.addElement(new EditPhone(id+":phone_cel",{
			"labelCaption":"Мобильный телефон:",
			"events":{
				"keyup":function(){
					self.getControlSave().setEnabled(true);
				}
			}		
		}));	

		this.addElement(new Enum_locales(id+":locale_id",{
			"labelCaption":"Локаль:",
			"required":true
		}));	

		this.addElement(new TimeZoneLocaleEdit(id+":time_zone_locales_ref",{
		}));
		this.addElement(new EditString(id+":name_full",{
			"maxLength":200,
			"labelCaption":"ФИО:",
			"events":{
				"keyup":function(){
					self.getControlSave().setEnabled(true);
				}
			}		
		}));	

	}
	
	UserProfile_View.superclass.constructor.call(this,id,options);

	//****************************************************
	var contr = new User_Controller();
	
	//read
	this.setReadPublicMethod(contr.getPublicMethod("get_profile"));
	this.m_model = options.models.UserProfile_Model;
	
	//read
	this.setDataBindings([
		new DataBinding({"control":this.getElement("id"),"model":this.m_model})
		,new DataBinding({"control":this.getElement("name"),"model":this.m_model})
		,new DataBinding({"control":this.getElement("name_full"),"model":this.m_model})
		,new DataBinding({"control":this.getElement("email"),"model":this.m_model})
		,new DataBinding({"control":this.getElement("phone_cel"),"model":this.m_model})
		,new DataBinding({"control":this.getElement("tel_ext"),"model":this.m_model})
		,new DataBinding({"control":this.getElement("locale_id"),"model":this.m_model})
		,new DataBinding({"control":this.getElement("time_zone_locales_ref")})
	]);

	//write
	this.setController(contr);
	this.getCommand(this.CMD_OK).setBindings([
		new CommandBinding({"control":this.getElement("id")})
		,new CommandBinding({"control":this.getElement("name")})
		,new CommandBinding({"control":this.getElement("name_full")})
		,new CommandBinding({"control":this.getElement("email")})
		,new CommandBinding({"control":this.getElement("phone_cel")})
		,new CommandBinding({"control":this.getElement("tel_ext")})
		,new CommandBinding({"control":this.getElement("locale_id")})
		,new CommandBinding({"control":this.getElement("time_zone_locales_ref"),"fieldId":"time_zone_locale_id"})
	]);
	
	this.getControlSave().setEnabled(false);
}
extend(UserProfile_View,ViewObjectAjx);


UserProfile_View.prototype.TXT_PWD_ER = "Пароли не совпадают";


UserProfile_View.prototype.checkPass = function(){
	var pwd = this.getElement("pwd").getValue();
	if (pwd && pwd.length){
		var pwd_conf = this.getElement("pwd_confirm").getValue();
		if (pwd_conf && pwd_conf.length && pwd!=pwd_conf){
			this.getElement("pwd_confirm").setNotValid(this.TXT_PWD_ER);
			this.getControlSave().setEnabled(false);
		}
		else if (pwd_conf && pwd_conf.length){
			this.getElement("pwd_confirm").setValid();
			if (!this.getControlSave().getEnabled()){
				this.getControlSave().setEnabled(true);
			}
		}
		else if ((!pwd_conf || !pwd_conf.length) && this.getControlSave().getEnabled()){
			this.getControlSave().setEnabled(false);
		}
	}
}

/*
UserProfile_View.prototype.onSaveOk = function(resp){
	UserProfile_View.superclass.onSaveOk.call(this,resp);
	
	window.showNote(this.NOTE_DATA_SAVED,null,3000);
}
*/
