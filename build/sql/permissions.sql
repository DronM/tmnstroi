/**
 * Andrey Mikhalevich 15/12/21
 * This file is part of the OSBE framework
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/permissions/permissions.sql.tmpl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 */

/*
-- If this is the first time you execute the script, uncomment these lines
-- to create table and insert row
CREATE TABLE IF NOT EXISTS permissions (
    rules json NOT NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.permissions OWNER to ;

INSERT INTO permissions VALUES ('{"admin":{}}');
*/

UPDATE permissions SET rules = '{
	"admin":{
		"Event":{
			"subscribe":true
			,"unsubscribe":true
			,"publish":true
		}
		,"Constant":{
			"set_value":true
			,"get_list":true
			,"get_object":true
			,"get_values":true
		}
		,"MainMenuConstructor":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"MainMenuContent":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"View":{
			"get_list":true
			,"complete":true
			,"get_section_list":true
		}
		,"VariantStorage":{
			"insert":true
			,"upsert_filter_data":true
			,"upsert_col_visib_data":true
			,"upsert_col_order_data":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
			,"get_filter_data":true
			,"get_col_visib_data":true
			,"get_col_order_data":true
		}
		,"About":{
			"get_object":true
		}
		,"SrvStatistics":{
			"get_statistics":true
		}
		,"User":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
			,"complete":true
			,"get_profile":true
			,"reset_pwd":true
			,"login":true
			,"login_refresh":true
			,"login_token":true
			,"logout":true
			,"logout_html":true
		}
		,"Login":{
			"get_list":true
			,"get_object":true
		}
		,"TimeZoneLocale":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"Client":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"OKEISection":{
			"get_list":true
			,"get_object":true
		}
		,"OKEI":{
			"get_list":true
			,"get_object":true
			,"complete":true
		}
		,"Material":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
			,"complete":true
			,"get_material_action":true
		}
		,"OKTMO":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"OKTMOContract":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"DocOrder":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"DocShipment":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
			,"complete":true
		}
		,"DocPassToProduction":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"DocMovement":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"DocMaterial":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
		,"DocProcurement":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
			,"complete":true
		}
		,"Store":{
			"insert":true
			,"update":true
			,"delete":true
			,"get_list":true
			,"get_object":true
		}
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';