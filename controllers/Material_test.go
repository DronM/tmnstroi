package tests

/**
 * Andrey Mikhalevich 18/12/21
 * This file is part of the OSBE framework
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/Controller_test.go.tmpl
 */

import(
	"testing"	
)

const Material_contr = "Material_Controller"

func TestMaterial_insert(t *testing.T) {
	cl, params := GetClient()
	params["okei_code"] = `Some `
	if err := cl.SendGet(Material_contr, "insert", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestMaterial_get_list(t *testing.T) {
	cl, params := GetClient()
	if err := cl.SendGet(Material_contr, "get_list", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestMaterial_get_object(t *testing.T) {
	cl, params := GetClient()
	params["id"] = 1
	if err := cl.SendGet(Material_contr, "get_object", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestMaterial_delete(t *testing.T) {
	cl, params := GetClient()
	params["id"] = 1
	if err := cl.SendGet(Material_contr, "delete", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestMaterial_complete(t *testing.T) {
	cl, params := GetClient()
	params["count"] = 10
	params["ic"] = 1
	params["mid"] = 1
	params["name"] = ``
	if err := cl.SendGet(Material_contr, "complete", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}


