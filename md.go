package main

/**
 * Andrey Mikhalevich 15/12/21
 * This file is part of the OSBE framework
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/md.go.tmpl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 */

import (
	"/controllers"
	"/constants"

	"osbe"
	"osbe/model"
)

func initMD() *osbe.Metadata{

	model.Cond_Model_init()

	md := osbe.NewMetadata()
	
	md.Controllers["Material"] = &controllers.Material_Controller{}
	md.Controllers["Material"].InitPublicMethods()


	md.Version.Value = APP_VERSION

	return md
}
