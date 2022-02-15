<?php
require_once(FRAME_WORK_PATH.'basic_classes/ViewHTMLXSLT.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelStyleSheet.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelJavaScript.php');

require_once(FRAME_WORK_PATH.'basic_classes/ModelTemplate.php');
require_once(USER_CONTROLLERS_PATH.'Constant_Controller.php');
require_once(USER_CONTROLLERS_PATH.'MainMenuConstructor_Controller.php');


			
if (file_exists('models/MainMenu_Model_admin.php')){
require_once('models/MainMenu_Model_admin.php');
}
		
class ViewBase extends ViewHTMLXSLT {	

	protected static function getMenuClass(){
		//USER_MODELS_PATH
		$menu_class = NULL;
		$fl = NULL;
		if (file_exists($fl = OUTPUT_PATH.'MainMenu_Model_'.$_SESSION['user_id'].'.php')){
			$menu_class = 'MainMenu_Model_'.$_SESSION['user_id'];
		}
		else if (file_exists($fl = OUTPUT_PATH.'MainMenu_Model_'.$_SESSION['role_id'].'_'.$_SESSION['user_id'].'.php')){
			$menu_class = 'MainMenu_Model_'.$_SESSION['role_id'].'_'.$_SESSION['user_id'];
		}
		else if (file_exists($fl = OUTPUT_PATH.'MainMenu_Model_'.$_SESSION['role_id'].'.php')){
			$menu_class = 'MainMenu_Model_'.$_SESSION['role_id'];
		}
		if (!is_null($menu_class) && !is_null($fl)){
			require_once($fl);
		}
		return $menu_class;
	}

	protected function addMenu(&$models){
		if (isset($_SESSION['role_id'])){
			//USER_MODELS_PATH
			$menu_class = self::getMenuClass();
			if (is_null($menu_class)){
				//no menu exists yet
				if (!$GLOBALS['dbLink']){
					throw new Exception('Db link for addMenu is not defined!');
				}
				
				$contr = new MainMenuConstructor_Controller($GLOBALS['dbLink']);
				$contr->genMenuForUser($_SESSION['user_id'], $_SESSION['role_id']);
				$menu_class = self::getMenuClass();
				if (is_null($menu_class)){
					throw new Exception('No menu found!');
				}				
			}
			$models['mainMenu'] = new $menu_class();
		}	
	}
	
	protected function addConstants(&$models){
		if (isset($_SESSION['role_id'])){
			if (!$GLOBALS['dbLink']){
				throw new Exception('Db link for addConstants is not defined!');
			}
		
			$contr = new Constant_Controller($GLOBALS['dbLink']);
			$list = array('doc_per_page_count','grid_refresh_interval');
			$models['ConstantValueList_Model'] = $contr->getConstantValueModel($list);						
		}	
	}

	public function __construct($name){
		parent::__construct($name);
		
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/Limitless v1.4/layout_1/LTR/default/assets/css/icons/icomoon/styles.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/Limitless v1.4/layout_1/LTR/default/assets/css/bootstrap.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/Limitless v1.4/layout_1/LTR/default/assets/css/core.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/Limitless v1.4/layout_1/LTR/default/assets/css/components.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/Limitless v1.4/layout_1/LTR/default/assets/css/colors.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/Limitless v1.4/layout_1/LTR/default/assets/css/icons/fontawesome/styles.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.standalone.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'custom-css/style.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'custom-css/print.css'));
	
		if (!DEBUG){
			$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/jquery-1.12.4/jquery-1.12.4.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-3.3.6/bootstrap.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.ru.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/Bush-jquery.maskedinput/jquery.maskedinput.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/bower_components/metisMenu/dist/metisMenu.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/bower_components/raphael/raphael-min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/bower_components/morrisjs/morris.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/dist/js/sb-admin-2.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/jshash-2.2/md5-min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/mustache/mustache.min.js'));
			$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'lib.js'));
			$script_id = VERSION;
		}
		else{		
			
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/jquery-1.12.4/jquery-1.12.4.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-3.3.6/bootstrap.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.ru.min.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/Bush-jquery.maskedinput/jquery.maskedinput.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/bower_components/metisMenu/dist/metisMenu.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/bower_components/raphael/raphael-min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/bower_components/morrisjs/morris.min.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/startbootstrap-sb-admin-2-1.0.8/dist/js/sb-admin-2.js'));
	
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/jshash-2.2/md5-min.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/mustache/mustache.min.js'));

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/DragnDrop/DragMaster.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/DragnDrop/DragObject.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/DragnDrop/DropTarget.js'));		

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/extend.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/App.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/AppWin.js'));				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/CommonHelper.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/DOMHelper.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/DateHelper.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/EventHelper.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FatalException.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/DbException.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/VersException.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ConstantManager.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/CookieManager.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ServConnector.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Response.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ResponseXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ResponseJSON.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/PublicMethod.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/PublicMethodServer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ControllerObj.js'));				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ControllerObjServer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ControllerObjClient.js'));
				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelObjectXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelServRespXML.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelObjectJSON.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelServRespJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelXMLTree.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Validator.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorString.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorBool.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorEnum.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorArray.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorEmail.js'));								
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Field.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldString.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldEnum.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldBool.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldDateTimeTZ.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldBigInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldSmallInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldPassword.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldText.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldInterval.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldJSONB.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldArray.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelFilter.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/RefType.js'));		
		
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/rs_ru.js'));
	}

		
				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/DataBinding.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Command.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/CommandBinding.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Control.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Control.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ControlContainer.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ControlContainer.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewAjxList.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ErrorControl.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Calculator.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Calculator.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Button.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCtrl.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonEditCtrl.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonEditCtrl.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCalc.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonCalc.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCalendar.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonCalendar.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonClear.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonClear.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCmd.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonExpToExcel.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonExpToExcel.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonExpToPDF.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonExpToPDF.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonOpen.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonOpen.rs_ru.js'));
	}
				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonInsert.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonInsert.rs_ru.js'));
	}
				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonPrint.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonPrint.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonPrintList.js'));		
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonPrintList.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonSelectRef.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonSelectRef.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonSelectDataType.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonSelectDataType.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonMakeSelection.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonMakeSelection.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonToggle.js'));		
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Label.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Edit.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Edit.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditString.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditText.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditNum.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditMoney.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPhone.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditEmail.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPercent.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditTime.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPassword.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditCheckBox.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditContainer.js'));		
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditContainer.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRadioGroup.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRadio.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelect.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelectRef.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditSelectRef.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelectOption.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelectOptionRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRadioGroupRef.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditRadioGroupRef.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PrintObj.js'));				
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ControlForm.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/HiddenKey.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditModalDialog.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditModalDialog.rs_ru.js'));
	}
				
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumn.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnBool.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnPhone.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnByte.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnEnum.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnRef.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCell.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHead.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellFoot.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellPhone.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCellPhone.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellDetailToggle.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCellDetailToggle.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridHead.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridRow.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridFoot.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridBody.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Grid.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Grid.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridSearchInf.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridSearchInf.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/VariantStorage.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCommands.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmd.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdContainer.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdContainer.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdContainerAjx.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdContainerDOC.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdInsert.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdInsert.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdEdit.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdEdit.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdCopy.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdCopy.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdDelete.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdDelete.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdColManager.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdColManager.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdPrint.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdPrint.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdRefresh.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdRefresh.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdPrintObj.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdSearch.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdSearch.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdExport.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdExport.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdAllCommands.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdAllCommands.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdDOCUnprocess.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdDOCUnprocess.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdDOCShowActs.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdDOCShowActs.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdRowUp.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdRowUp.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdRowDown.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdRowDown.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilter.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilter.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilterView.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilterView.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilterSave.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilterSave.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilterOpen.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilterOpen.rs_ru.js'));
	}


		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColManager.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColManager.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColParam.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColParam.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColVisibility.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColVisibility.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColOrder.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColOrder.rs_ru.js'));
	}
		
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/VariantStorageSaveView.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/VariantStorageSaveView.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/VariantStorageOpenView.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/VariantStorageOpenView.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridAjx.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/TreeAjx.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridAjxDOCT.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridAjxMaster.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCommandsAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCommandsAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCommandsDOC.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCommandsDOC.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridPagination.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridPagination.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridFilter.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridFilter.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPeriodDate.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditPeriodDate.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPeriodDateTime.js'));		
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ConstantGrid.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ConstantGrid.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonOK.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonOK.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonSave.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonSave.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCancel.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonCancel.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewObjectAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewObjectAjx.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridEditInlineAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridEditInlineAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewDOC.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewDOC.rs_ru.js'));
	}
		

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowPrint.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowPrint.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowQuestion.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowQuestion.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowSearch.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowSearch.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowForm.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowForm.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowFormObject.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowFormObject.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowFormModalBS.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowFormModalBS.rs_ru.js'));
	}
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowMessage.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowTempMessage.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHeadDOCProcessed.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHeadDOCDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHeadDOCNumber.js'));								
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/actb.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/actb.rs_ru.js'));
	}

				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/RepCommands.js'));	
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/RepCommands.rs_ru.js'));
	}
			
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewReport.js'));	
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewReport.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PopUpMenu.js'));								
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PopOver.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PeriodSelect.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/PeriodSelect.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowAbout.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowAbout.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/MainMenuTree.js'));		
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/MainMenuTree.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/BigFileUploader.js'));		
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/BigFileUploader.rs_ru.js'));
	}


		
		
		
		

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/ViewList_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/MainMenuConstructor_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/User_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/UserList_Form.js'));
		

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/User_Controller.js'));
		
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/Login_View.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/MainMenuConstructorList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/MainMenuConstructor_View.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ViewList_View.js'));						
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/About_View.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ConstantList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ProjectManager_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/LoginList_View.js'));
				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserProfile_View.js'));
				
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'tmpl/App.templates.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/App_tmnstroi.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ViewSectionSelect.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ViewEditRef.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserNameEdit.js'));		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserEditRef.js'));

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/rs_common_ru.js'));		
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/TimeZoneLocale_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/User_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Session_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Login_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/LoginList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ConstantList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/View_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ViewList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ViewSectionList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuConstructor_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuConstructorList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuConstructorDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuContent_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/VariantStorage_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/VariantStorageList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/About_Model.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs_ru.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs_common_ru.js'));
	}

	$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Constant_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Enum_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/MainMenuConstructor_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/MainMenuContent_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/View_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/VariantStorage_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/About_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Login_Controller.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/App.predefinedItems.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/Enum_locales.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/EnumGridColumn_locales.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/Enum_role_types.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/EnumGridColumn_role_types.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/Enum_data_types.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/EnumGridColumn_data_types.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/App.enums.js'));			
			if (isset($_SESSION['scriptId'])){
				$script_id = $_SESSION['scriptId'];
			}
			else{
				$script_id = VERSION;
			}			
		}
		
		$this->getVarModel()->addField(new Field('role_id',DT_STRING));
		$this->getVarModel()->addField(new Field('user_name',DT_STRING));
		
		
		
		$this->getVarModel()->insert();
		$this->setVarValue('scriptId',$script_id);
		
		$currentPath = $_SERVER['PHP_SELF'];
		$pathInfo = pathinfo($currentPath);
		$hostName = $_SERVER['HTTP_HOST'];
		$protocol = isset($_SERVER['HTTPS'])? 'https://':'http://';
		$dir = $protocol.$hostName.$pathInfo['dirname'];
		if (substr($dir,strlen($dir)-1,1)!='/'){
			$dir.='/';
		}
		$this->setVarValue('basePath', $dir);
		
		$this->setVarValue('version',VERSION);		
		$this->setVarValue('debug',DEBUG);
		if (isset($_SESSION['locale_id'])){
			$this->setVarValue('locale_id',$_SESSION['locale_id']);
		}
		else if (!isset($_SESSION['locale_id']) && defined('DEF_LOCALE')){
			$this->setVarValue('locale_id', DEF_LOCALE);
		}		
		
		if (isset($_SESSION['role_id'])){
			$this->setVarValue('role_id',$_SESSION['role_id']);
			$this->setVarValue('user_name',$_SESSION['user_name']);
			$this->setVarValue('curDate',round(microtime(true) * 1000));
			//$this->setVarValue('token',$_SESSION['token']);
			//$this->setVarValue('tokenr',$_SESSION['tokenr']);
		}
		
		
		//Global Filters
		
	}
	public function write(ArrayObject &$models,$errorCode=NULL){
		$this->addMenu($models);
		
		
		$this->addConstants($models);
		
		//titles form Config
		$models->append(new ModelVars(
			array('name'=>'Page_Model',
				'sysModel'=>TRUE,
				'id'=>'Page_Model',
				'values'=>array(
					new Field('DEFAULT_COLOR_PALETTE',DT_STRING,array('value'=>DEFAULT_COLOR_PALETTE))					
				)
			)
		));
		
		parent::write($models,$errorCode);
	}	
}	
?>