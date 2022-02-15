package controllers

/**
 * Andrey Mikhalevich 15/12/21
 * This file is part of the OSBE framework
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/Controller.go.tmpl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 */

import (
	"reflect"	
	"encoding/json"
	
	"tmnstroi/models"
	
	"osbe"
	"osbe/fields"
	"osbe/srv"
	"osbe/socket"
	"osbe/response"	
	"osbe/model"
	
	//"github.com/jackc/pgx/v4"
)

//Controller
type Material_Controller struct {
	osbe.Base_Controller
}

func NewController_Material() *Material_Controller{
	c := &Material_Controller{osbe.Base_Controller{ID: "Material", PublicMethods: make(osbe.PublicMethodCollection)}}	
	keys_fields := fields.GenModelMD(reflect.ValueOf(models.Material_keys{}))
	
	//************************** method insert **********************************
	c.PublicMethods["insert"] = &Material_Controller_insert{
		osbe.Base_PublicMethod{
			ID: "insert",
			Fields: fields.GenModelMD(reflect.ValueOf(models.Material{})),
			EventList: osbe.PublicMethodEventList{"Material.insert"},
		},
	}
	
	//************************** method delete *************************************
	c.PublicMethods["delete"] = &Material_Controller_delete{
		osbe.Base_PublicMethod{
			ID: "delete",
			Fields: keys_fields,
			EventList: osbe.PublicMethodEventList{"Material.delete"},
		},
	}
	
	//************************** method update *************************************
	c.PublicMethods["update"] = &Material_Controller_update{
		osbe.Base_PublicMethod{
			ID: "update",
			Fields: fields.GenModelMD(reflect.ValueOf(models.Material_old_keys{})),
			EventList: osbe.PublicMethodEventList{"Material.update"},
		},
	}
	
	//************************** method get_object *************************************
	c.PublicMethods["get_object"] = &Material_Controller_get_object{
		osbe.Base_PublicMethod{
			ID: "get_object",
			Fields: keys_fields,
		},
	}
	
	//************************** method get_list *************************************
	c.PublicMethods["get_list"] = &Material_Controller_get_list{
		osbe.Base_PublicMethod{
			ID: "get_list",
			Fields: model.Cond_Model_fields,
		},
	}
	
	//************************** method complete *************************************
	c.PublicMethods["complete"] = &Material_Controller_complete{
		osbe.Base_PublicMethod{
			ID: "complete",
			Fields: fields.GenModelMD(reflect.ValueOf(models.Material_complete{})),
		},
	}
			
	
	return c
}

type Material_Controller_keys_argv struct {
	Argv models.Material_keys `json:"argv"`	
}

//************************* INSERT **********************************************
//Public method: insert
type Material_Controller_insert struct {
	osbe.Base_PublicMethod
}

//Public method Unmarshal to structure
func (pm *Material_Controller_insert) Unmarshal(payload []byte) (reflect.Value, error) {
	var res reflect.Value
	argv := &models.Material_argv{}
		
	if err := json.Unmarshal(payload, argv); err != nil {
		return res, err
	}
	res = reflect.ValueOf(&argv.Argv).Elem()	
	return res, nil
}
func (pm *Material_Controller_insert) Run(app osbe.Applicationer, serv srv.Server, sock socket.ClientSocketer, resp *response.Response, rfltArgs reflect.Value) error {
	return osbe.InsertOnArgs(app, pm, resp, sock, rfltArgs, app.GetMD().Models["Material"].Relation, &models.Material_keys{})
}

//************************* DELETE **********************************************
type Material_Controller_delete struct {
	osbe.Base_PublicMethod
}

//Public method Unmarshal to structure
func (pm *Material_Controller_delete) Unmarshal(payload []byte) (reflect.Value, error) {
	var res reflect.Value
	argv := &models.Material_keys_argv{}
		
	if err := json.Unmarshal(payload, argv); err != nil {
		return res, err
	}	
	res = reflect.ValueOf(&argv.Argv).Elem()	
	return res, nil
}

//Method implemenation
func (pm *Material_Controller_delete) Run(app osbe.Applicationer, serv srv.Server, sock socket.ClientSocketer, resp *response.Response, rfltArgs reflect.Value) error {
	return osbe.DeleteOnArgKeys(app, pm, resp, sock, rfltArgs, app.GetMD().Models["Material"].Relation)
}

//************************* GET OBJECT **********************************************
type Material_Controller_get_object struct {
	osbe.Base_PublicMethod
}

//Public method Unmarshal to structure
func (pm *Material_Controller_get_object) Unmarshal(payload []byte) (reflect.Value, error) {
	var res reflect.Value
	argv := &models.Material_keys_argv{}
		
	if err := json.Unmarshal(payload, argv); err != nil {
		return res, err
	}	
	res = reflect.ValueOf(&argv.Argv).Elem()	
	return res, nil
}

//Method implemenation
func (pm *Material_Controller_get_object) Run(app osbe.Applicationer, serv srv.Server, sock socket.ClientSocketer, resp *response.Response, rfltArgs reflect.Value) error {
	return osbe.GetObjectOnArgs(app, resp, rfltArgs, app.GetMD().Models["MaterialList"], &models.MaterialList{})
}

//************************* GET LIST **********************************************
//Public method: get_list
type Material_Controller_get_list struct {
	osbe.Base_PublicMethod
}
//Public method Unmarshal to structure
func (pm *Material_Controller_get_list) Unmarshal(payload []byte) (reflect.Value, error) {
	var res reflect.Value
	argv := &model.Controller_get_list_argv{}
		
	if err := json.Unmarshal(payload, argv); err != nil {
		return res, err
	}	
	res = reflect.ValueOf(&argv.Argv).Elem()	
	return res, nil
}

//Method implemenation
func (pm *Material_Controller_get_list) Run(app osbe.Applicationer, serv srv.Server, sock socket.ClientSocketer, resp *response.Response, rfltArgs reflect.Value) error {
	return osbe.GetListOnArgs(app, resp, rfltArgs, app.GetMD().Models["MaterialList"], &models.MaterialList{})
}

//************************* UPDATE **********************************************
//Public method: update
type Material_Controller_update struct {
	osbe.Base_PublicMethod
}
//Public method Unmarshal to structure
func (pm *Material_Controller_update) Unmarshal(payload []byte) (reflect.Value, error) {
	var res reflect.Value
	argv := &models.Material_old_keys_argv{}
		
	if err := json.Unmarshal(payload, argv); err != nil {
		return res, err
	}	
	res = reflect.ValueOf(&argv.Argv).Elem()	
	return res, nil
}

//Method implemenation
func (pm *Material_Controller_update) Run(app osbe.Applicationer, serv srv.Server, sock socket.ClientSocketer, resp *response.Response, rfltArgs reflect.Value) error {
	return osbe.UpdateOnArgs(app, pm, sock, rfltArgs, app.GetMD().Models["Material"].Relation)	
}
//************************** COMPLETE ********************************************************
//Public method: complete
type Material_Controller_complete struct {
	osbe.Base_PublicMethod
}
//Public method Unmarshal to structure
func (pm *Material_Controller_complete) Unmarshal(payload []byte) (reflect.Value, error) {
	var res reflect.Value
	argv := &models.Material_complete_argv{}
		
	if err := json.Unmarshal(payload, argv); err != nil {
		return res, err
	}	
	res = reflect.ValueOf(&argv.Argv).Elem()	
	return res, nil
}

//Method implemenation
func (pm *Material_Controller_complete) Run(app osbe.Applicationer, serv srv.Server, sock socket.ClientSocketer, resp *response.Response, rfltArgs reflect.Value) error {
	return osbe.CompleteOnArgs(app, resp, rfltArgs, app.GetMD().Models["MaterialList"], &models.MaterialList{})
}
