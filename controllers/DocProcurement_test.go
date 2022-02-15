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

const DocProcurement_contr = "DocProcurement_Controller"

func TestDocProcurement_insert(t *testing.T) {
	cl, params := GetClient()
	if err := cl.SendGet(DocProcurement_contr, "insert", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocProcurement_get_list(t *testing.T) {
	cl, params := GetClient()
	if err := cl.SendGet(DocProcurement_contr, "get_list", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocProcurement_get_object(t *testing.T) {
	cl, params := GetClient()
	params["id"] = 1
	if err := cl.SendGet(DocProcurement_contr, "get_object", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocProcurement_delete(t *testing.T) {
	cl, params := GetClient()
	params["id"] = 1
	if err := cl.SendGet(DocProcurement_contr, "delete", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}

func TestDocProcurement_complete(t *testing.T) {
	cl, params := GetClient()
	params["count"] = 10
	params["ic"] = 1
	params["mid"] = 1
	params["self_descr"] = ``
	if err := cl.SendGet(DocProcurement_contr, "complete", VIEW, "", params); err != nil {
		t.Fatalf("%v", err)
	}
}


