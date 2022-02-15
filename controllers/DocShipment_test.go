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

const DocShipment_contr = "DocShipment_Controller"

func TestDocShipment_insert(t *testing.T) {
	cl, params := GetClient()
	params["oktmo_contract_id"] = 1
	if err := cl.SendGet(DocShipment_contr, "insert", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocShipment_get_list(t *testing.T) {
	cl, params := GetClient()
	if err := cl.SendGet(DocShipment_contr, "get_list", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocShipment_get_object(t *testing.T) {
	cl, params := GetClient()
	params["id"] = 1
	if err := cl.SendGet(DocShipment_contr, "get_object", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocShipment_delete(t *testing.T) {
	cl, params := GetClient()
	params["id"] = 1
	if err := cl.SendGet(DocShipment_contr, "delete", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocShipment_complete(t *testing.T) {
	cl, params := GetClient()
	params["count"] = 10
	params["ic"] = 1
	params["mid"] = 1
	params["self_descr"] = ``
	if err := cl.SendGet(DocShipment_contr, "complete", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}


