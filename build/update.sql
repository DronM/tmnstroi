
-- ******************* update 11/12/2021 08:28:05 ******************
-- FUNCTION: public.session_vals_process()

-- DROP FUNCTION public.session_vals_process();

CREATE FUNCTION public.session_vals_process()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	IF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
	ELSE 
		UPDATE logins SET date_time_out = now() WHERE session_id=OLD.id;
		
		RETURN OLD;
	END IF;
END;
$BODY$;

--ALTER FUNCTION public.session_vals_process() OWNER TO tmnstroi;



-- ******************* update 11/12/2021 08:28:15 ******************
-- Table: public.session_vals

-- DROP TABLE public.session_vals;

CREATE TABLE public.session_vals
(
    id character(36) COLLATE pg_catalog."default" NOT NULL,
    accessed_time timestamp with time zone DEFAULT now(),
    create_time timestamp with time zone DEFAULT now(),
    val bytea,
    CONSTRAINT session_vals_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

--ALTER TABLE public.session_vals OWNER to ;



-- ******************* update 11/12/2021 08:28:20 ******************
    CREATE TRIGGER session_vals_trigger_after
    AFTER DELETE
    ON public.session_vals
    FOR EACH ROW
    EXECUTE PROCEDURE public.session_vals_process();


-- ******************* update 13/12/2021 14:04:42 ******************
-- View: public.users_dialog

-- DROP VIEW public.users_dialog;

CREATE OR REPLACE VIEW public.users_dialog AS 
	SELECT
		users.*,
		time_zone_locales.name AS user_time_locale
		
	FROM users
	LEFT JOIN time_zone_locales ON time_zone_locales.id=users.time_zone_locale_id
	;

ALTER TABLE public.users_dialog
  OWNER TO tmnstroi;



-- ******************* update 13/12/2021 14:05:19 ******************
-- View: public.users_login

-- DROP VIEW public.users_login;

CREATE OR REPLACE VIEW public.users_login AS 
	SELECT
		ud.*
	FROM users AS u
	LEFT JOIN users_dialog AS ud ON ud.id=u.id
	;

ALTER TABLE public.users_login
  OWNER TO tmnstroi;



-- ******************* update 13/12/2021 14:29:32 ******************
-- View: users_list

 DROP VIEW users_list;

CREATE OR REPLACE VIEW users_list AS 
	SELECT
	 	u.id,
	 	u.name,
	 	u.role_id,
	 	u.phone_cel,
	 	u.tel_ext,
	 	u.email
 	FROM users AS u
	ORDER BY u.name;

ALTER TABLE users_list OWNER TO tmnstroi;



-- ******************* update 13/12/2021 14:41:06 ******************
-- View: public.users_login

-- DROP VIEW public.users_login;

CREATE OR REPLACE VIEW public.users_login AS 
	SELECT
		ud.*,
		u.pwd
	FROM users AS u
	LEFT JOIN users_dialog AS ud ON ud.id=u.id
	;

ALTER TABLE public.users_login
  OWNER TO tmnstroi;



-- ******************* update 14/12/2021 08:57:07 ******************
-- FUNCTION: public.session_vals_process()

-- DROP FUNCTION public.session_vals_process();

CREATE OR REPLACE FUNCTION public.session_vals_process()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	IF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
	ELSE 
		UPDATE logins SET date_time_out = now() WHERE session_id=OLD.id;
		
		RETURN OLD;
	END IF;
END;
$BODY$;

ALTER FUNCTION public.session_vals_process() OWNER TO tmnstroi;



-- ******************* update 14/12/2021 08:57:58 ******************
-- FUNCTION: public.session_vals_process()

-- DROP FUNCTION public.session_vals_process();

CREATE OR REPLACE FUNCTION public.session_vals_process()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	IF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		UPDATE logins SET date_time_out = now() WHERE session_id=OLD.id;
		
		RETURN OLD;
	END IF;
END;
$BODY$;

ALTER FUNCTION public.session_vals_process() OWNER TO tmnstroi;



-- ******************* update 14/12/2021 11:34:10 ******************

		ALTER TABLE public.main_menus ADD COLUMN model_content text;



-- ******************* update 14/12/2021 15:51:57 ******************
-- View: users_profile

-- DROP VIEW users_profile;

CREATE OR REPLACE VIEW users_profile AS 
	SELECT
	 	u.id,
	 	u.name,
	 	u.email,
	 	u.phone_cel,
	 	u.locale_id,
	 	time_zone_locales_ref(tzl) AS time_zone_locales_ref,
	 	u.tel_ext
 	FROM users AS u
 	LEFT JOIN time_zone_locales AS tzl ON tzl.id=u.time_zone_locale_id
	;
ALTER TABLE users_profile OWNER TO tmnstroi;



-- ******************* update 16/12/2021 09:18:30 ******************
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
		,"Enum":{
			"get_enum_list":true
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 17/12/2021 09:14:09 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
			,"complete":true
		}
	}
}';


-- ******************* update 03/01/2022 10:28:55 ******************

			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
						
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'10001',
	'Client_Controller',
	'get_list',
	'ClientList',
	'Справочники',
	'Контрагенты',
	FALSE
	);
	
	

-- ******************* update 03/01/2022 10:47:43 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 03/01/2022 10:52:26 ******************
-- Function: permissions_process()

-- DROP FUNCTION permissions_process();

CREATE OR REPLACE FUNCTION permissions_process()
  RETURNS trigger AS
$BODY$
BEGIN
	PERFORM pg_notify('Permission.change', NULL);
	
	IF TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT') THEN
		
		RETURN NEW;
		
	ELSIF TG_WHEN='AFTER' AND TG_OP='DELETE' THEN
		RETURN OLD;
		
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION permissions_process() OWNER TO tmnstroi;



-- ******************* update 03/01/2022 10:53:35 ******************
    CREATE TRIGGER permissions_trigger_after
    AFTER DELETE OR UPDATE OR INSERT
    ON public.permissions
    FOR EACH ROW
    EXECUTE PROCEDURE public.permissions_process();


-- ******************* update 04/01/2022 09:29:56 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 04/01/2022 09:31:21 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 04/01/2022 11:35:14 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 04/01/2022 11:39:53 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 06/01/2022 10:23:04 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 06/01/2022 11:27:50 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 06/01/2022 11:34:16 ******************
CREATE OR REPLACE FUNCTION okei_ref(okei)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.code    
			),	
		'descr',$1.name_nat,
		'dataType','okei'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION okei_ref(okei) OWNER TO tmnstroi;	
	


-- ******************* update 06/01/2022 11:34:21 ******************
-- VIEW: okei_list

--DROP VIEW okei_list;

CREATE OR REPLACE VIEW okei_list AS
	SELECT
		okei.code,
		okei.name_full,
		okei.name_nat,
		okei.name_internat,  
		okei.code_nat,
		okei.code_internat,
		okei.name_search,		
		okei_sections_ref(sec)  AS okei_sections_ref
	FROM okei
	LEFT JOIN okei_sections AS sec ON sec.id=okei.okei_section_id
	ORDER BY sec.name,okei.code
	;
	
ALTER VIEW okei_list OWNER TO tmnstroi;


-- ******************* update 08/01/2022 07:05:14 ******************
	
		ALTER TABLE public.users ADD COLUMN name_full  varchar(200);



-- ******************* update 08/01/2022 07:11:03 ******************
-- View: public.users_dialog

 DROP VIEW public.users_login; 
 DROP VIEW public.users_dialog;


CREATE OR REPLACE VIEW public.users_dialog AS 
	SELECT
		u.id,
		u.name,
		u.name_full,
		u.role_id,
		u.email,
		u.create_dt,
		u.banned,
		time_zone_locales_ref(tzl) AS time_zone_locales_ref,
		u.phone_cel,
		u.tel_ext,
		u.locale_id,
		u.email_confirmed
	FROM users AS u
	LEFT JOIN time_zone_locales AS tzl ON tzl.id=u.time_zone_locale_id
	;

ALTER TABLE public.users_dialog
  OWNER TO tmnstroi;



-- ******************* update 08/01/2022 07:11:20 ******************
-- View: public.users_login

-- DROP VIEW public.users_login;

CREATE OR REPLACE VIEW public.users_login AS 
	SELECT
		ud.*,
		u.pwd
	FROM users AS u
	LEFT JOIN users_dialog AS ud ON ud.id=u.id
	;

ALTER TABLE public.users_login
  OWNER TO tmnstroi;



-- ******************* update 08/01/2022 07:46:44 ******************

	
	-- ********** Adding new table from model **********
	CREATE TABLE public.materials
	(id serial NOT NULL,name  varchar(150) NOT NULL,name_full text,okei_code varchar(5) NOT NULL REFERENCES okei(code),CONSTRAINT materials_pkey PRIMARY KEY (id)
	);
	
	ALTER TABLE public.materials OWNER TO tmnstroi;



-- ******************* update 08/01/2022 07:50:04 ******************
-- VIEW: materials_list

--DROP VIEW materials_list;

CREATE OR REPLACE VIEW materials_list AS
	SELECT
		m.id,
		m.name,
		m.name_full,
		okei_ref(okei) AS okei_ref
	FROM materials AS m
	LEFT JOIN okei ON okei.code=m.okei_code
	;
	
ALTER VIEW materials_list OWNER TO tmnstroi;


-- ******************* update 08/01/2022 08:19:59 ******************

			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'10003',
	'Material_Controller',
	'get_list',
	'MaterialList',
	'Справочники',
	'Материалы',
	FALSE
	);
	
	

-- ******************* update 08/01/2022 08:21:59 ******************
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
		}
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 08/01/2022 09:19:47 ******************
	drop view materials_list;
		ALTER TABLE public.materials alter column okei_code type varchar(5);
		


-- ******************* update 08/01/2022 09:19:59 ******************
-- VIEW: materials_list

--DROP VIEW materials_list;

CREATE OR REPLACE VIEW materials_list AS
	SELECT
		m.id,
		m.name,
		m.name_full,
		okei_ref(okei) AS okei_ref
	FROM materials AS m
	LEFT JOIN okei ON okei.code=m.okei_code
	;
	
ALTER VIEW materials_list OWNER TO tmnstroi;


-- ******************* update 08/01/2022 11:12:35 ******************
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
		}
		,"OKTMO":{
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


-- ******************* update 10/01/2022 10:36:23 ******************

			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'10004',
	'OKTMO_Controller',
	'get_list',
	'OKTMOList',
	'Справочники',
	'ОКТМО',
	FALSE
	);
	
	

-- ******************* update 10/01/2022 10:38:13 ******************
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
		}
		,"OKTMO":{
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


-- ******************* update 10/01/2022 10:54:44 ******************
CREATE OR REPLACE FUNCTION oktmo_ref(oktmo)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','oktmo'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION oktmo_ref(oktmo) OWNER TO tmnstroi;	
	


-- ******************* update 10/01/2022 11:01:32 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 10/01/2022 11:10:27 ******************
-- VIEW: oktmo_contracts_list

--DROP VIEW oktmo_contracts_list;

CREATE OR REPLACE VIEW oktmo_contracts_list AS
	SELECT
		t.id,
		t.oktmo_id,
		t.name,
		oktmo_ref(oktmo) AS oktmo_ref
		
	FROM oktmo_contracts AS t
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	ORDER BY oktmo.name, t.name
	;
	
ALTER VIEW oktmo_contracts_list OWNER TO tmnstroi;


-- ******************* update 10/01/2022 12:44:19 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 10/01/2022 12:44:32 ******************
	
		ALTER TABLE public.users ADD COLUMN oktmo_id int REFERENCES oktmo(id);



-- ******************* update 10/01/2022 12:45:15 ******************
-- View: users_profile

-- DROP VIEW users_profile;

CREATE OR REPLACE VIEW users_profile AS 
	SELECT
	 	u.id,
	 	u.name,
	 	u.email,
	 	u.phone_cel,
	 	u.locale_id,
	 	time_zone_locales_ref(tzl) AS time_zone_locales_ref,
	 	u.tel_ext,
	 	u.oktmo_id
 	FROM users AS u
 	LEFT JOIN time_zone_locales AS tzl ON tzl.id=u.time_zone_locale_id
	;
ALTER TABLE users_profile OWNER TO tmnstroi;



-- ******************* update 10/01/2022 12:45:30 ******************
-- View: public.users_dialog

-- DROP VIEW public.users_login; 
-- DROP VIEW public.users_dialog;


CREATE OR REPLACE VIEW public.users_dialog AS 
	SELECT
		u.id,
		u.name,
		u.name_full,
		u.role_id,
		u.email,
		u.create_dt,
		u.banned,
		time_zone_locales_ref(tzl) AS time_zone_locales_ref,
		u.phone_cel,
		u.tel_ext,
		u.locale_id,
		u.email_confirmed,
		u.oktmo_id
	FROM users AS u
	LEFT JOIN time_zone_locales AS tzl ON tzl.id=u.time_zone_locale_id
	;

ALTER TABLE public.users_dialog
  OWNER TO tmnstroi;



-- ******************* update 10/01/2022 12:46:26 ******************
-- View: public.users_dialog

 DROP VIEW public.users_login; 
 DROP VIEW public.users_dialog;


CREATE OR REPLACE VIEW public.users_dialog AS 
	SELECT
		u.id,
		u.name,
		u.name_full,
		u.role_id,
		u.email,
		u.create_dt,
		u.banned,
		time_zone_locales_ref(tzl) AS time_zone_locales_ref,
		u.phone_cel,
		u.tel_ext,
		u.locale_id,
		u.email_confirmed,
		oktmo_ref(oktmo) AS oktmo_ref
	FROM users AS u
	LEFT JOIN time_zone_locales AS tzl ON tzl.id=u.time_zone_locale_id
	LEFT JOIN oktmo ON oktmo.id=u.oktmo_id
	;

ALTER TABLE public.users_dialog
  OWNER TO tmnstroi;



-- ******************* update 10/01/2022 12:47:11 ******************
-- View: public.users_login

-- DROP VIEW public.users_login;

CREATE OR REPLACE VIEW public.users_login AS 
	SELECT
		ud.*,
		u.pwd
	FROM users AS u
	LEFT JOIN users_dialog AS ud ON ud.id=u.id
	;

ALTER TABLE public.users_login
  OWNER TO tmnstroi;



-- ******************* update 10/01/2022 12:47:53 ******************
-- View: users_list

 DROP VIEW users_list;

CREATE OR REPLACE VIEW users_list AS 
	SELECT
	 	u.id,
	 	u.name,
	 	u.name_full,
	 	u.role_id,
	 	u.phone_cel,
	 	u.tel_ext,
	 	u.email,
	 	oktmo_ref(oktmo) AS oktmo_ref
	 	
 	FROM users AS u
 	LEFT JOIN oktmo ON oktmo.id=u.oktmo_id
	ORDER BY u.name;

ALTER TABLE users_list OWNER TO tmnstroi;



-- ******************* update 18/01/2022 12:13:29 ******************
-- VIEW: doc_orders_list

--DROP VIEW doc_orders_list;

CREATE OR REPLACE VIEW doc_orders_list AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.oktmo_id
		,oktmo_ref(oktmo) AS oktmo_ref
		,t.oktmo_contract_id
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials_search
		
	FROM doc_orders AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_orders_list OWNER TO tmnstroi;


-- ******************* update 18/01/2022 12:14:01 ******************
-- VIEW: doc_orders_dialog

--DROP VIEW doc_orders_dialog;

CREATE OR REPLACE VIEW doc_orders_dialog AS
	SELECT
		t.id 
		,t.date_time
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials
		
	FROM doc_orders AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_orders_dialog OWNER TO tmnstroi;


-- ******************* update 18/01/2022 12:25:43 ******************
-- Function: doc_orders_process()

-- DROP FUNCTION doc_orders_process();

CREATE OR REPLACE FUNCTION doc_orders_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.oktmo_contracts,0)<>coalesce(OLD.oktmo_contracts,0)) THEN
		NEW.oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_orders_process()
  OWNER TO tmnstroi;



-- ******************* update 18/01/2022 12:26:51 ******************
-- Trigger: doc_orders_before_trigger on doc_orders

-- DROP TRIGGER doc_orders_before_trigger ON doc_orders;


 CREATE TRIGGER doc_orders_before_trigger
  BEFORE INSERT OR UPDATE
  ON doc_orders
  FOR EACH ROW
  EXECUTE PROCEDURE doc_orders_process();


-- ******************* update 18/01/2022 13:18:03 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 18/01/2022 13:20:16 ******************
ALTER TABLE doc_orders ALTER COLUMN user_id set not null;


-- ******************* update 18/01/2022 13:22:09 ******************
-- Function: doc_orders_process()

-- DROP FUNCTION doc_orders_process();

CREATE OR REPLACE FUNCTION doc_orders_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.oktmo_contract_id,0)<>coalesce(OLD.oktmo_contract_id,0)) THEN
		NEW.oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_orders_process()
  OWNER TO tmnstroi;



-- ******************* update 18/01/2022 15:09:51 ******************

	
	-- ********** Adding new table from model **********
	CREATE TABLE public.doc_shipments
	(id serial NOT NULL,date_time timestampTZ
			DEFAULT CURRENT_TIMESTAMP NOT NULL,ship_date date,user_id int NOT NULL REFERENCES users(id),oktmo_id int REFERENCES oktmo(id),oktmo_contract_id int NOT NULL REFERENCES oktmo_contracts(id),barge_num text,materials jsonb,materials_search text,pallets jsonb,CONSTRAINT doc_shipments_pkey PRIMARY KEY (id)
	);
	
	DROP INDEX IF EXISTS doc_orders_date_idx;
	CREATE INDEX doc_orders_date_idx
	ON doc_shipments(date_time);

	DROP INDEX IF EXISTS doc_orders_oktmo_idx;
	CREATE INDEX doc_orders_oktmo_idx
	ON doc_shipments(oktmo_id);

	DROP INDEX IF EXISTS doc_orders_oktmo_contract_idx;
	CREATE INDEX doc_orders_oktmo_contract_idx
	ON doc_shipments(oktmo_contract_id);

	DROP INDEX IF EXISTS doc_orders_user_idx;
	CREATE INDEX doc_orders_user_idx
	ON doc_shipments(user_id);

	DROP INDEX IF EXISTS doc_orders_materials_search_idx;
	CREATE INDEX doc_orders_materials_search_idx
	ON doc_shipments(materials_search);

	ALTER TABLE public.doc_shipments OWNER TO tmnstroi;
	
	
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
--Refrerece type
CREATE OR REPLACE FUNCTION users_ref(users)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','users'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION users_ref(users) OWNER TO tmnstroi;	
	
--Refrerece type
CREATE OR REPLACE FUNCTION oktmo_ref(oktmo)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','oktmo'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION oktmo_ref(oktmo) OWNER TO tmnstroi;	
	
--Refrerece type
CREATE OR REPLACE FUNCTION oktmo_contracts_ref(oktmo_contracts)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','oktmo_contracts'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION oktmo_contracts_ref(oktmo_contracts) OWNER TO tmnstroi;	
	

-- ******************* update 18/01/2022 15:11:41 ******************
-- VIEW: doc_shipments_list

--DROP VIEW doc_shipments_list;

CREATE OR REPLACE VIEW doc_shipments_list AS
	SELECT
		t.id 
		,t.date_time
		,t.ship_date
		,t.user_id
		,users_ref(u) AS users_ref
		,t.oktmo_id
		,oktmo_ref(oktmo) AS oktmo_ref
		,t.oktmo_contract_id
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.materials_search
		
	FROM doc_shipments AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_shipments_list OWNER TO tmnstroi;


-- ******************* update 18/01/2022 15:15:37 ******************
-- VIEW: doc_shipments_list

DROP VIEW doc_shipments_list;

CREATE OR REPLACE VIEW doc_shipments_list AS
	SELECT
		t.id 
		,t.date_time
		,t.ship_date
		,t.barge_num
		,t.user_id
		,users_ref(u) AS users_ref
		,t.oktmo_id
		,oktmo_ref(oktmo) AS oktmo_ref
		,t.oktmo_contract_id
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.materials_search
		
	FROM doc_shipments AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_shipments_list OWNER TO tmnstroi;


-- ******************* update 18/01/2022 15:15:46 ******************
-- VIEW: doc_shipments_dialog

--DROP VIEW doc_shipments_dialog;

CREATE OR REPLACE VIEW doc_shipments_dialog AS
	SELECT
		t.id 
		,t.date_time
		,t.barge_num
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.materials
		,t.pallets
		
	FROM doc_shipments AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_shipments_dialog OWNER TO tmnstroi;


-- ******************* update 18/01/2022 15:20:55 ******************
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
		}
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 18/01/2022 15:25:43 ******************
-- VIEW: doc_shipments_dialog

DROP VIEW doc_shipments_dialog;

CREATE OR REPLACE VIEW doc_shipments_dialog AS
	SELECT
		t.id 
		,t.date_time
		,t.ship_date
		,t.barge_num
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.materials
		,t.pallets
		
	FROM doc_shipments AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_shipments_dialog OWNER TO tmnstroi;


-- ******************* update 18/01/2022 15:44:48 ******************
-- VIEW: doc_pass_to_productions_list

--DROP VIEW doc_pass_to_productions_list;

CREATE OR REPLACE VIEW doc_pass_to_productions_list AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.oktmo_id
		,oktmo_ref(oktmo) AS oktmo_ref
		,t.oktmo_contract_id
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials_search
		
	FROM doc_pass_to_productions AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_pass_to_productions_list OWNER TO tmnstroi;


-- ******************* update 18/01/2022 15:45:51 ******************
-- VIEW: doc_pass_to_productions_dialog

--DROP VIEW doc_pass_to_productions_dialog;

CREATE OR REPLACE VIEW doc_pass_to_productions_dialog AS
	SELECT
		t.id 
		,t.date_time
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials
		
	FROM doc_orders AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_pass_to_productions_dialog OWNER TO tmnstroi;


-- ******************* update 18/01/2022 15:45:57 ******************
-- VIEW: doc_pass_to_productions_dialog

--DROP VIEW doc_pass_to_productions_dialog;

CREATE OR REPLACE VIEW doc_pass_to_productions_dialog AS
	SELECT
		t.id 
		,t.date_time
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials
		
	FROM doc_pass_to_productions AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_pass_to_productions_dialog OWNER TO tmnstroi;


-- ******************* update 18/01/2022 15:55:53 ******************
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
		}
		,"DocPassToProduction":{
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


-- ******************* update 18/01/2022 16:05:57 ******************
-- VIEW: doc_movements_list

--DROP VIEW doc_movements_list;

CREATE OR REPLACE VIEW doc_movements_list AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.oktmo_id
		,t.to_oktmo_id
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_ref(oktmo2) AS to_oktmo_ref
		,t.oktmo_contract_id
		,t.to_oktmo_contract_id
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,oktmo_contracts_ref(oktmo_contracts2) AS to_oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials_search
		
	FROM doc_movements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo AS oktmo2 ON oktmo2.id = t.to_oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	LEFT JOIN oktmo_contracts AS oktmo_contracts2 ON oktmo_contracts2.id = t.to_oktmo_contract_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_movements_list OWNER TO tmnstroi;


-- ******************* update 18/01/2022 16:07:24 ******************
-- VIEW: doc_movements_dialog

--DROP VIEW doc_movements_dialog;

CREATE OR REPLACE VIEW doc_movements_dialog AS
	SELECT
		t.id 
		,t.date_time
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_ref(oktmo2) AS to_oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,oktmo_contracts_ref(oktmo_contracts2) AS to_oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials
		
	FROM doc_movements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo AS oktmo2 ON oktmo.id = t.to_oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	LEFT JOIN oktmo_contracts AS oktmo_contracts2 ON oktmo_contracts2.id = t.to_oktmo_contract_id
	;
	
ALTER VIEW doc_movements_dialog OWNER TO tmnstroi;


-- ******************* update 18/01/2022 16:09:55 ******************
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
	}
	,"guest":{
		"User":{
			"login":true
		}
	}
}';


-- ******************* update 18/01/2022 16:25:13 ******************
-- Function: doc_movements_process()

-- DROP FUNCTION doc_movements_process();

CREATE OR REPLACE FUNCTION doc_movements_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.oktmo_contract_id,0)<>coalesce(OLD.oktmo_contract_id,0)) THEN
		NEW.oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_movements_process()
  OWNER TO tmnstroi;



-- ******************* update 18/01/2022 16:25:37 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.oktmo_contract_id,0)<>coalesce(OLD.oktmo_contract_id,0)) THEN
		NEW.oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 18/01/2022 16:26:11 ******************
-- Function: doc_pass_to_productions_process()

-- DROP FUNCTION doc_pass_to_productions_process();

CREATE OR REPLACE FUNCTION doc_pass_to_productions_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.oktmo_contract_id,0)<>coalesce(OLD.oktmo_contract_id,0)) THEN
		NEW.oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_pass_to_productions_process()
  OWNER TO tmnstroi;



-- ******************* update 18/01/2022 16:26:40 ******************
-- Function: doc_movements_process()

-- DROP FUNCTION doc_movements_process();

CREATE OR REPLACE FUNCTION doc_movements_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.oktmo_contract_id,0)<>coalesce(OLD.oktmo_contract_id,0)) THEN
		NEW.oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.to_oktmo_contract_id,0)<>coalesce(OLD.to_oktmo_contract_id,0)) THEN
		NEW.to_oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.to_oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_movements_process()
  OWNER TO tmnstroi;



-- ******************* update 18/01/2022 16:28:54 ******************
-- Trigger: doc_pass_to_productions_before_trigger on doc_orders

-- DROP TRIGGER doc_pass_to_productions_before_trigger ON doc_pass_to_productions;


 CREATE TRIGGER doc_pass_to_productions_before_trigger
  BEFORE INSERT OR UPDATE
  ON doc_orders
  FOR EACH ROW
  EXECUTE PROCEDURE doc_pass_to_productions_process();


-- ******************* update 18/01/2022 16:29:34 ******************
-- Trigger: doc_shipments_before_trigger on doc_shipments

-- DROP TRIGGER doc_shipments_before_trigger ON doc_shipments;


 CREATE TRIGGER doc_shipments_before_trigger
  BEFORE INSERT OR UPDATE
  ON doc_orders
  FOR EACH ROW
  EXECUTE PROCEDURE doc_shipments_process();


-- ******************* update 18/01/2022 16:30:23 ******************
-- Trigger: doc_movements_before_trigger on doc_movements

-- DROP TRIGGER doc_movements_before_trigger ON doc_movements;


 CREATE TRIGGER doc_movements_before_trigger
  BEFORE INSERT OR UPDATE
  ON doc_movements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_movements_process();


-- ******************* update 18/01/2022 16:34:46 ******************

			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
		
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'20000',
	'DocOrder_Controller',
	'get_list',
	'DocOrderList',
	'Документы',
	'Заказы материалов',
	FALSE
	);
	
	
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'20001',
	'DocShipment_Controller',
	'get_list',
	'DocDocShipmentList',
	'Документы',
	'Отгрузка материалов',
	FALSE
	);
	
	
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'20002',
	'DocPassToProduction_Controller',
	'get_list',
	'DocPassToProductionList',
	'Документы',
	'Передача материалов в производство',
	FALSE
	);
	
	
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'20003',
	'DocMovement_Controller',
	'get_list',
	'DocMovementList',
	'Документы',
	'Перемещение материалов',
	FALSE
	);
	
	

-- ******************* update 21/01/2022 09:10:40 ******************

			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
		
		UPDATE views SET
			c='DocShipment_Controller',
			f='get_list',
			t='DocShipmentList',
			section='Документы',
			descr='Отгрузка материалов',
			limited=FALSE
		WHERE id='20001';
	

-- ******************* update 22/01/2022 07:29:50 ******************
-- View: users_profile

 DROP VIEW users_profile;

CREATE OR REPLACE VIEW users_profile AS 
	SELECT
	 	u.id,
	 	u.name,
	 	u.name_full,
	 	u.email,
	 	u.phone_cel,
	 	u.locale_id,
	 	time_zone_locales_ref(tzl) AS time_zone_locales_ref,
	 	u.tel_ext,
	 	u.oktmo_id
 	FROM users AS u
 	LEFT JOIN time_zone_locales AS tzl ON tzl.id=u.time_zone_locale_id
	;
ALTER TABLE users_profile OWNER TO tmnstroi;



-- ******************* update 22/01/2022 09:15:03 ******************
-- Function: public.users_ref(users)

-- DROP FUNCTION public.users_ref(users);

CREATE OR REPLACE FUNCTION public.users_ref(users)
  RETURNS json AS
$BODY$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name_full,
		'dataType','users'
	);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION public.users_ref(users) OWNER TO tmnstroi;



-- ******************* update 24/01/2022 08:20:35 ******************

	-- Adding new type
	CREATE TYPE reg_types AS ENUM (
	
		'material'			
				
	);
	ALTER TYPE reg_types OWNER TO tmnstroi;
		
	/* type get function */
	CREATE OR REPLACE FUNCTION enum_reg_types_val(reg_types,locales)
	RETURNS text AS $$
		SELECT
		CASE
		WHEN $1='material'::reg_types AND $2='ru'::locales THEN 'Учет материалов'
		ELSE ''
		END;		
	$$ LANGUAGE sql;	
	ALTER FUNCTION enum_reg_types_val(reg_types,locales) OWNER TO tmnstroi;		
	
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
		

-- ******************* update 24/01/2022 08:25:55 ******************

	
	-- ********** Adding new table from model **********
	CREATE TABLE public.stores
	(id serial NOT NULL,name text NOT NULL,oktmo_contract_id int REFERENCES oktmo(id),CONSTRAINT stores_pkey PRIMARY KEY (id)
	);
	
	ALTER TABLE public.stores OWNER TO tmnstroi;



-- ******************* update 24/01/2022 08:28:51 ******************
-- VIEW: stores_list

--DROP VIEW stores_list;

CREATE OR REPLACE VIEW stores_list AS
	SELECT
		stores.id,
		stores.name,
		oktmo_contracts_ref(o_ct) AS oktmo_contracts_ref
	FROM stores
	LEFT JOIN oktmo_contracts AS o_ct ON o_ct.id = stores.oktmo_contract_id
	;
	
ALTER VIEW stores_list OWNER TO tmnstroi;


-- ******************* update 24/01/2022 08:33:38 ******************
		INSERT INTO stores
		(id,name)
		VALUES (
		'1','Тюмень'
		);
	
		INSERT INTO stores
		(id,name)
		VALUES (
		'2','В пути'
		);
	



-- ******************* update 24/01/2022 08:37:23 ******************
﻿-- Function: pdfn_stores_base()

-- DROP FUNCTION pdfn_stores_base();

CREATE OR REPLACE FUNCTION pdfn_stores_base()
  RETURNS int AS
$$
	SELECT 1;
$$
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION pdfn_stores_base() OWNER TO tmnstroi;


-- ******************* update 24/01/2022 08:37:59 ******************
﻿-- Function: pdfn_stores_in_route()

-- DROP FUNCTION pdfn_stores_in_route();

CREATE OR REPLACE FUNCTION pdfn_stores_in_route()
  RETURNS int AS
$$
	SELECT 2;
$$
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION pdfn_stores_in_route() OWNER TO tmnstroi;


-- ******************* update 24/01/2022 08:48:19 ******************
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


-- ******************* update 24/01/2022 08:50:10 ******************

			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
		
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'10006',
	'Store_Controller',
	'get_list',
	'StoreList',
	'Справочники',
	'Склады',
	FALSE
	);
	
	

-- ******************* update 24/01/2022 09:10:02 ******************

	-- Adding new type
	CREATE TYPE doc_types AS ENUM (
	
		'order'			
	,
		'shipment'			
	,
		'movement'			
	,
		'pass_to_production'			
	,
		'procurement'			
				
	);
	ALTER TYPE doc_types OWNER TO tmnstroi;
		
	/* type get function */
	CREATE OR REPLACE FUNCTION enum_doc_types_val(doc_types,locales)
	RETURNS text AS $$
		SELECT
		CASE
		WHEN $1='order'::doc_types AND $2='ru'::locales THEN 'Заявка на метериалы'
		WHEN $1='shipment'::doc_types AND $2='ru'::locales THEN 'Отгрузка материалов'
		WHEN $1='movement'::doc_types AND $2='ru'::locales THEN 'Перемещение материалов'
		WHEN $1='pass_to_production'::doc_types AND $2='ru'::locales THEN 'Передача материалов в производство'
		WHEN $1='procurement'::doc_types AND $2='ru'::locales THEN 'Поступление материалов'
		ELSE ''
		END;		
	$$ LANGUAGE sql;	
	ALTER FUNCTION enum_doc_types_val(doc_types,locales) OWNER TO tmnstroi;		



-- ******************* update 24/01/2022 09:20:48 ******************
-- FUNCTION: public.rg_period(reg_types, timestamp without time zone)

-- DROP FUNCTION public.rg_period(reg_types, timestamp without time zone);

CREATE OR REPLACE FUNCTION public.rg_period(
	in_reg_type reg_types,
	in_date_time timestamp without time zone)
    RETURNS timestamp without time zone
    LANGUAGE 'sql'

    COST 100
    IMMUTABLE 
AS $BODY$
	SELECT date_trunc('MONTH', in_date_time)::timestamp without time zone;
$BODY$;

ALTER FUNCTION public.rg_period(reg_types, timestamp without time zone)
    OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:23:11 ******************
-- Function: rg_calc_period(reg_types)

-- DROP FUNCTION rg_calc_period(reg_types);

/**
 * Возвращает период рассчитанных итогов по регистру
 */
CREATE OR REPLACE FUNCTION rg_calc_period(in_reg_type reg_types)
  RETURNS timestamp without time zone AS
$BODY$
	SELECT
		coalesce(
			(SELECT date_time FROM rg_calc_periods WHERE reg_type=$1)
			,now()::date+' 00:00:00'::interval
		)
	;
$BODY$
  LANGUAGE sql STABLE
  COST 100;
ALTER FUNCTION rg_calc_period(reg_types) OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:24:39 ******************
-- FUNCTION: public.rg_calc_interval(reg_types)

-- DROP FUNCTION public.rg_calc_interval(reg_types);

CREATE OR REPLACE FUNCTION public.rg_calc_interval(
	in_reg_type reg_types)
    RETURNS interval
    LANGUAGE 'sql'

    COST 100
    IMMUTABLE 
AS $BODY$
SELECT
		CASE $1
		WHEN 'material'::reg_types THEN '1 month'::interval
		END;
$BODY$;

ALTER FUNCTION public.rg_calc_interval(reg_types)
    OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:24:42 ******************
-- Function: rg_calc_period_start(reg_types, timestamp without time zone)

-- DROP FUNCTION rg_calc_period_start(reg_types, timestamp without time zone);

/**
 * Возвращает дату начала периода итогов по любой дате
 */ 
CREATE OR REPLACE FUNCTION rg_calc_period_start(
    in_reg_type reg_types,
    in_date_time  timestamp without time zone)
  RETURNS timestamp without time zone AS
$BODY$
	SELECT
		CASE
			WHEN rg_calc_interval(in_reg_type)='1 month' THEN
				date_trunc('month', in_date_time)
			WHEN rg_calc_interval(in_reg_type)='1 day' THEN
				in_date_time::date+'00:00:00'::interval
		END
	;
$BODY$
  LANGUAGE sql IMMUTABLE
  COST 100;
ALTER FUNCTION rg_calc_period_start(reg_types,  timestamp without time zone)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:25:51 ******************
-- Function: last_month_day(date)

-- DROP FUNCTION last_month_day(date);

CREATE OR REPLACE FUNCTION last_month_day(date)
  RETURNS date AS
$BODY$
 	SELECT (date_trunc('MONTH', $1) + INTERVAL '1 MONTH - 1 day')::date;
$BODY$
  LANGUAGE sql IMMUTABLE STRICT
  COST 100;
ALTER FUNCTION last_month_day(date)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:25:54 ******************
-- Function: rg_calc_period_end(reg_types, timestamp without time zone)

-- DROP FUNCTION rg_calc_period_end(reg_types, timestamp without time zone);

/**
 * Возвращает дату конца периода итогов по любой дате
 */ 

CREATE OR REPLACE FUNCTION rg_calc_period_end(
    in_reg_type reg_types,
    in_date_time timestamp without time zone)
  RETURNS timestamp without time zone AS
$BODY$
	SELECT
		CASE
			WHEN rg_calc_interval(in_reg_type)='1 month' THEN
				last_month_day(in_date_time::date)+'23:59:59.999'::interval
			WHEN rg_calc_interval(in_reg_type)='1 day' THEN
				in_date_time::date+'23:59:59.999'::interval
		END	
	;
$BODY$
  LANGUAGE sql IMMUTABLE
  COST 100;
ALTER FUNCTION rg_calc_period_end(reg_types, timestamp without time zone)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:26:00 ******************
-- Function: rg_period_balance(reg_types, timestamp without time zone)

-- DROP FUNCTION rg_period_balance(reg_types, timestamp without time zone);

CREATE OR REPLACE FUNCTION rg_period_balance(
    in_reg_type reg_types,
    in_date_time timestamp without time zone)
  RETURNS timestamp without time zone AS
$BODY$
	SELECT
		rg_calc_period_end(in_reg_type,in_date_time) - '0.000001 second'::interval
	;
$BODY$
  LANGUAGE sql IMMUTABLE
  COST 100;
ALTER FUNCTION rg_period_balance(reg_types, timestamp without time zone) OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:28:13 ******************
-- Table: doc_log

-- DROP TABLE doc_log;

CREATE TABLE doc_log
(
  id serial NOT NULL,
  doc_type doc_types,
  doc_id integer,
  date_time timestampTZ,
  CONSTRAINT doc_log_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE doc_log OWNER TO tmnstroi;

-- Index: doc_log_date_time_index

-- DROP INDEX doc_log_date_time_idx;

CREATE INDEX doc_log_date_time_idx ON doc_log USING btree (date_time);

-- Index: doc_log_doc_idx

-- DROP INDEX doc_log_doc_idx;

CREATE INDEX doc_log_doc_idx ON doc_log USING btree (doc_type, doc_id);




-- ******************* update 24/01/2022 09:45:29 ******************
-- FUNCTION: public.ra_materials_process()

-- DROP FUNCTION public.ra_materials_process();

CREATE FUNCTION public.ra_materials_process()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
	v_delta_quant  numeric(19,3) DEFAULT 0;
	v_delta_total  numeric(15,2) DEFAULT 0;
	
	CALC_DATE_TIME timestamp without time zone;
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		RETURN NEW;
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN
		RETURN NEW;
	ELSIF (TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT')) THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (NEW.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_period('material'::reg_types,NEW.date_time);
			PERFORM rg_material_set_custom_period(CALC_DATE_TIME);						
		END IF;

		IF TG_OP='UPDATE' AND
		(NEW.date_time<>OLD.date_time
		OR NEW.store_id<>OLD.store_id
		OR NEW.material_id<>OLD.material_id		
		) THEN
			--delete old data completely
			PERFORM rg_materials_update_periods(OLD.date_time, OLD.store_id, OLD.material_id, -1*OLD.quant,  -1*OLD.total);
			v_delta_quant = 0;
			v_delta_total = 0;
		ELSIF TG_OP='UPDATE' THEN						
			v_delta_quant = OLD.quant;
			v_delta_total = OLD.total;
		ELSE
			v_delta_quant = 0;
			v_delta_total = 0;
		END IF;
		
		v_delta_quant = NEW.quant - v_delta_quant;
		v_delta_total = NEW.total - v_delta_total;
		IF NOT NEW.deb THEN
			v_delta_quant = -1 * v_delta_quant;
			v_delta_total = -1 * v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(NEW.date_time, NEW.store_id, NEW.material_id, v_delta_quant, v_delta_total);
	
		RETURN NEW;					
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='DELETE') THEN
		RETURN OLD;
	ELSIF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (OLD.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_period('material'::reg_types,OLD.date_time);
			PERFORM rg_material_set_custom_period(CALC_DATE_TIME);						
		END IF;
		v_delta_quant = OLD.quant;
		v_delta_total = OLD.total;
		IF OLD.deb THEN
			v_delta_quant = -1*v_delta_quant;
			v_delta_total = -1*v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(OLD.date_time, OLD.store_id, OLD.material_id, v_delta_quant, v_delta_total);
	
		RETURN OLD;					
	END IF;
END;
$BODY$;

ALTER FUNCTION public.ra_materials_process()
    OWNER TO tmnstroi;



-- ******************* update 24/01/2022 09:47:30 ******************
			-- before trigger
			CREATE TRIGGER ra_materials_before
				BEFORE INSERT OR UPDATE OR DELETE ON ra_materials
				FOR EACH ROW EXECUTE PROCEDURE ra_materials_process();
			-- after trigger
			CREATE TRIGGER ra_materials_after
				AFTER INSERT OR UPDATE OR DELETE ON ra_materials
				FOR EACH ROW EXECUTE PROCEDURE ra_materials_process();
				



-- ******************* update 24/01/2022 09:48:09 ******************
			-- ADD
			CREATE OR REPLACE FUNCTION ra_materials_add_act(reg_act ra_materials)
			RETURNS void AS
			$BODY$
				INSERT INTO ra_materials
				(date_time,doc_type,doc_id
				,deb
				,store_id
				,material_id
				,quant
				,total				
				)
				VALUES (
				$1.date_time,$1.doc_type,$1.doc_id
				,$1.deb
				,$1.store_id
				,$1.material_id
				,$1.quant
				,$1.total				
				);
			$BODY$
			LANGUAGE sql VOLATILE STRICT COST 100;
			
			ALTER FUNCTION ra_materials_add_act(reg_act ra_materials) OWNER TO tmnstroi;
			



-- ******************* update 24/01/2022 09:48:44 ******************
			-- REMOVE
			CREATE OR REPLACE FUNCTION ra_materials_remove_acts(in_doc_type doc_types,in_doc_id int)
			RETURNS void AS
			$BODY$
				DELETE FROM ra_materials
				WHERE doc_type=$1 AND doc_id=$2;
			$BODY$
			LANGUAGE sql VOLATILE STRICT COST 100;
			
			ALTER FUNCTION ra_materials_remove_acts(in_doc_type doc_types,in_doc_id int) OWNER TO tmnstroi;
			
			



-- ******************* update 24/01/2022 10:01:14 ******************
-- FUNCTION: public.rg_materials_balance(timestamp without time zone, integer[], integer[])

-- DROP FUNCTION public.rg_materials_balance(timestamp without time zone, integer[], integer[]);

CREATE OR REPLACE FUNCTION public.rg_materials_balance(
	in_date_time timestamp without time zone,
	in_store_id_ar integer[],
	in_material_id_ar integer[])
    RETURNS TABLE(store_id integer, material_id integer, quant numeric) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE STRICT 
    ROWS 1000
AS $BODY$
DECLARE
	v_cur_per timestamp;
	v_act_direct boolean;
	v_act_direct_sgn int;
	v_calc_interval interval;
BEGIN
	v_cur_per = rg_period('material'::reg_types, in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	v_act_direct = TRUE;--( (rg_calc_period_end('material'::reg_types,v_cur_per)-in_date_time)>(in_date_time - v_cur_per) );
	v_act_direct_sgn = 1;
	/*
	IF v_act_direct THEN
		v_act_direct_sgn = 1;
	ELSE
		v_act_direct_sgn = -1;
	END IF;
	*/
	--RAISE 'v_act_direct=%, v_cur_per=%, v_calc_interval=%',v_act_direct,v_cur_per,v_calc_interval;
	RETURN QUERY 
	SELECT 
	sub.store_id,
	sub.material_id
	,SUM(sub.quant) AS quant
	,SUM(sub.total) AS total
	FROM(
		SELECT
		b.store_id,
		b.material_id
		,b.quant
		,b.total				
		FROM rg_materials AS b
		WHERE (v_act_direct AND b.date_time = (v_cur_per-v_calc_interval)) OR (NOT v_act_direct AND b.date_time = v_cur_per)
		
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (b.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (b.material_id=ANY(in_material_id_ar)))
		
		AND (
		b.quant<>0
		)
		OR (
		b.total<>0
		)		
		UNION ALL
		
		(SELECT
		
		act.store_id,
		act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant*v_act_direct_sgn
			ELSE -act.quant*v_act_direct_sgn
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total*v_act_direct_sgn
			ELSE -act.total*v_act_direct_sgn
		END AS total
										
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE (v_act_direct AND (doc_log.date_time>=v_cur_per AND doc_log.date_time<in_date_time) )
			OR (NOT v_act_direct AND (doc_log.date_time<(v_cur_per+v_calc_interval) AND doc_log.date_time>=in_date_time) )
		
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (act.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (act.material_id=ANY(in_material_id_ar)))
		
		AND (
		
		act.quant<>0
		)
		OR (
		
		act.total<>0
		)		
		ORDER BY doc_log.date_time,doc_log.id)

		UNION ALL
		--РУЧНЫЕ ИЗМЕНЕНИЯ
		(SELECT
		act.store_id,
		act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant
			ELSE -act.quant
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total
			ELSE -act.total
		END AS total
										
		FROM ra_materials AS act
		
		WHERE (v_act_direct AND (act.date_time>=v_cur_per AND act.date_time<in_date_time)
			OR (NOT v_act_direct AND (act.date_time<(v_cur_per+v_calc_interval) AND act.date_time>=in_date_time) )
			)
			
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (act.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (act.material_id=ANY(in_material_id_ar)))
		AND act.doc_type IS NULL AND act.doc_id IS NULL
		AND (
		
		act.quant<>0
		)
		OR (
		
		act.total<>0
		)		
		)
		
	) AS sub
	WHERE
		(ARRAY_LENGTH(in_store_ar,1) IS NULL OR (sub.store_id=ANY(in_store_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (sub.material_id=ANY(in_material_id_ar)))
	
	GROUP BY
		sub.store_id,
		sub.material_id
	HAVING
		
		SUM(sub.quant)<>0 OR SUM(sub.total)<>0
						
	ORDER BY
		sub.store_id,
		sub.material_id;
END;
$BODY$;

ALTER FUNCTION public.rg_materials_balance(timestamp without time zone, integer[], integer[])
    OWNER TO tmnstroi;



-- ******************* update 24/01/2022 10:10:41 ******************
-- Table: doc_log

 DROP TABLE doc_log;

CREATE TABLE doc_log
(
  id serial NOT NULL,
  doc_type doc_types,
  doc_id integer,
  date_time timestamp without time zone,
  CONSTRAINT doc_log_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE doc_log OWNER TO tmnstroi;

-- Index: doc_log_date_time_index

-- DROP INDEX doc_log_date_time_idx;

CREATE INDEX doc_log_date_time_idx ON doc_log USING btree (date_time);

-- Index: doc_log_doc_idx

-- DROP INDEX doc_log_doc_idx;

CREATE INDEX doc_log_doc_idx ON doc_log USING btree (doc_type, doc_id);




-- ******************* update 24/01/2022 10:12:59 ******************
-- FUNCTION: public.rg_materials_balance(timestamp without time zone, integer[], integer[])

 DROP FUNCTION public.rg_materials_balance(timestamp without time zone, integer[], integer[]);

CREATE OR REPLACE FUNCTION public.rg_materials_balance(
	in_date_time timestamp without time zone,
	in_store_id_ar integer[],
	in_material_id_ar integer[])
    RETURNS TABLE(store_id integer, material_id integer, quant numeric, total numeric) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE STRICT 
    ROWS 1000
AS $BODY$
DECLARE
	v_cur_per timestamp;
	v_act_direct boolean;
	v_act_direct_sgn int;
	v_calc_interval interval;
BEGIN
	v_cur_per = rg_period('material'::reg_types, in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	v_act_direct = TRUE;--( (rg_calc_period_end('material'::reg_types,v_cur_per)-in_date_time)>(in_date_time - v_cur_per) );
	v_act_direct_sgn = 1;
	/*
	IF v_act_direct THEN
		v_act_direct_sgn = 1;
	ELSE
		v_act_direct_sgn = -1;
	END IF;
	*/
	--RAISE 'v_act_direct=%, v_cur_per=%, v_calc_interval=%',v_act_direct,v_cur_per,v_calc_interval;
	RETURN QUERY 
	SELECT 
	sub.store_id,
	sub.material_id
	,SUM(sub.quant) AS quant
	,SUM(sub.total) AS total
	FROM(
		SELECT
		b.store_id,
		b.material_id
		,b.quant
		,b.total				
		FROM rg_materials AS b
		WHERE (v_act_direct AND b.date_time = (v_cur_per-v_calc_interval)) OR (NOT v_act_direct AND b.date_time = v_cur_per)
		
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (b.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (b.material_id=ANY(in_material_id_ar)))
		
		AND (
		b.quant<>0
		)
		OR (
		b.total<>0
		)		
		UNION ALL
		
		(SELECT
		
		act.store_id,
		act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant*v_act_direct_sgn
			ELSE -act.quant*v_act_direct_sgn
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total*v_act_direct_sgn
			ELSE -act.total*v_act_direct_sgn
		END AS total
										
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE (v_act_direct AND (doc_log.date_time>=v_cur_per AND doc_log.date_time<in_date_time) )
			OR (NOT v_act_direct AND (doc_log.date_time<(v_cur_per+v_calc_interval) AND doc_log.date_time>=in_date_time) )
		
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (act.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (act.material_id=ANY(in_material_id_ar)))
		
		AND (
		
		act.quant<>0
		)
		OR (
		
		act.total<>0
		)		
		ORDER BY doc_log.date_time,doc_log.id)

		UNION ALL
		--РУЧНЫЕ ИЗМЕНЕНИЯ
		(SELECT
		act.store_id,
		act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant
			ELSE -act.quant
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total
			ELSE -act.total
		END AS total
										
		FROM ra_materials AS act
		
		WHERE (v_act_direct AND (act.date_time>=v_cur_per AND act.date_time<in_date_time)
			OR (NOT v_act_direct AND (act.date_time<(v_cur_per+v_calc_interval) AND act.date_time>=in_date_time) )
			)
			
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (act.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (act.material_id=ANY(in_material_id_ar)))
		AND act.doc_type IS NULL AND act.doc_id IS NULL
		AND (
		
		act.quant<>0
		)
		OR (
		
		act.total<>0
		)		
		)
		
	) AS sub
	WHERE
		(ARRAY_LENGTH(in_store_ar,1) IS NULL OR (sub.store_id=ANY(in_store_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (sub.material_id=ANY(in_material_id_ar)))
	
	GROUP BY
		sub.store_id,
		sub.material_id
	HAVING
		
		SUM(sub.quant)<>0 OR SUM(sub.total)<>0
						
	ORDER BY
		sub.store_id,
		sub.material_id;
END;
$BODY$;

ALTER FUNCTION public.rg_materials_balance(timestamp without time zone, integer[], integer[])
    OWNER TO tmnstroi;


ALTER FUNCTION rg_materials_balance(in_date_time timestamp,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)
 OWNER TO tmnstroi;

--balance on doc
/*DROP FUNCTION rg_materials_balance(in_doc_type doc_types, in_doc_id int,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	);
*/
CREATE OR REPLACE FUNCTION rg_materials_balance(in_doc_type doc_types, in_doc_id int,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)

  RETURNS TABLE(
	store_id int,material_id int
	,
	quant  numeric(19,3)
	,
	total  numeric(15,2)				
	) AS
$BODY$
	SELECT * FROM rg_materials_balance(
		(SELECT doc_log.date_time FROM doc_log WHERE doc_log.doc_type=in_doc_type AND doc_log.doc_id=in_doc_id),
		in_store_id_ar ,in_material_id_ar 				
		);

$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100;

ALTER FUNCTION rg_materials_balance(in_doc_type doc_types, in_doc_id int,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)
 OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:23:53 ******************
-- FUNCTION: public.reg_current_balance_time()

-- DROP FUNCTION public.reg_current_balance_time();

CREATE OR REPLACE FUNCTION public.reg_current_balance_time(
	)
    RETURNS timestamp without time zone
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$
SELECT '3000-01-01 00:00:00'::timestamp without time zone;
$BODY$;

ALTER FUNCTION public.reg_current_balance_time()
    OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:24:05 ******************
-- FUNCTION: public.rg_materials_balance(timestamp without time zone, integer[], integer[])

-- DROP FUNCTION public.rg_materials_balance(timestamp without time zone, integer[], integer[]);

CREATE OR REPLACE FUNCTION public.rg_materials_balance(
	in_date_time timestamp without time zone,
	in_store_id_ar integer[],
	in_material_id_ar integer[])
    RETURNS TABLE(store_id integer, material_id integer, quant numeric, total numeric) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE STRICT 
    ROWS 1000
AS $BODY$
DECLARE
	v_cur_per timestamp;
	v_act_direct boolean;
	v_act_direct_sgn int;
	v_calc_interval interval;
BEGIN
	v_cur_per = rg_period('material'::reg_types, in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	v_act_direct = TRUE;--( (rg_calc_period_end('material'::reg_types,v_cur_per)-in_date_time)>(in_date_time - v_cur_per) );
	v_act_direct_sgn = 1;
	/*
	IF v_act_direct THEN
		v_act_direct_sgn = 1;
	ELSE
		v_act_direct_sgn = -1;
	END IF;
	*/
	--RAISE 'v_act_direct=%, v_cur_per=%, v_calc_interval=%',v_act_direct,v_cur_per,v_calc_interval;
	RETURN QUERY 
	SELECT 
	sub.store_id,
	sub.material_id
	,SUM(sub.quant) AS quant
	,SUM(sub.total) AS total
	FROM(
		SELECT
		b.store_id,
		b.material_id
		,b.quant
		,b.total				
		FROM rg_materials AS b
		WHERE (v_act_direct AND b.date_time = (v_cur_per-v_calc_interval)) OR (NOT v_act_direct AND b.date_time = v_cur_per)
		
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (b.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (b.material_id=ANY(in_material_id_ar)))
		
		AND (
		b.quant<>0
		)
		OR (
		b.total<>0
		)		
		UNION ALL
		
		(SELECT
		
		act.store_id,
		act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant*v_act_direct_sgn
			ELSE -act.quant*v_act_direct_sgn
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total*v_act_direct_sgn
			ELSE -act.total*v_act_direct_sgn
		END AS total
										
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE (v_act_direct AND (doc_log.date_time>=v_cur_per AND doc_log.date_time<in_date_time) )
			OR (NOT v_act_direct AND (doc_log.date_time<(v_cur_per+v_calc_interval) AND doc_log.date_time>=in_date_time) )
		
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (act.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (act.material_id=ANY(in_material_id_ar)))
		
		AND (
		
		act.quant<>0
		)
		OR (
		
		act.total<>0
		)		
		ORDER BY doc_log.date_time,doc_log.id)

		UNION ALL
		--РУЧНЫЕ ИЗМЕНЕНИЯ
		(SELECT
		act.store_id,
		act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant
			ELSE -act.quant
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total
			ELSE -act.total
		END AS total
										
		FROM ra_materials AS act
		
		WHERE (v_act_direct AND (act.date_time>=v_cur_per AND act.date_time<in_date_time)
			OR (NOT v_act_direct AND (act.date_time<(v_cur_per+v_calc_interval) AND act.date_time>=in_date_time) )
			)
			
		AND (ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (act.store_id=ANY(in_store_id_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (act.material_id=ANY(in_material_id_ar)))
		AND act.doc_type IS NULL AND act.doc_id IS NULL
		AND (
		
		act.quant<>0
		)
		OR (
		
		act.total<>0
		)		
		)
		
	) AS sub
	WHERE
		(ARRAY_LENGTH(in_store_ar,1) IS NULL OR (sub.store_id=ANY(in_store_ar)))
		AND (ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (sub.material_id=ANY(in_material_id_ar)))
	
	GROUP BY
		sub.store_id,
		sub.material_id
	HAVING
		
		SUM(sub.quant)<>0 OR SUM(sub.total)<>0
						
	ORDER BY
		sub.store_id,
		sub.material_id;
END;
$BODY$;

ALTER FUNCTION public.rg_materials_balance(timestamp without time zone, integer[], integer[])
    OWNER TO tmnstroi;


ALTER FUNCTION rg_materials_balance(in_date_time timestamp,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)
 OWNER TO tmnstroi;

--balance on doc
/*DROP FUNCTION rg_materials_balance(in_doc_type doc_types, in_doc_id int,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	);
*/
CREATE OR REPLACE FUNCTION rg_materials_balance(in_doc_type doc_types, in_doc_id int,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)

  RETURNS TABLE(
	store_id int,material_id int
	,
	quant  numeric(19,3)
	,
	total  numeric(15,2)				
	) AS
$BODY$
	SELECT * FROM rg_materials_balance(
		(SELECT doc_log.date_time FROM doc_log WHERE doc_log.doc_type=in_doc_type AND doc_log.doc_id=in_doc_id),
		in_store_id_ar ,in_material_id_ar 				
		);

$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100;

ALTER FUNCTION rg_materials_balance(in_doc_type doc_types, in_doc_id int,
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)
 OWNER TO tmnstroi;

--TA balance
CREATE OR REPLACE FUNCTION rg_materials_balance(
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)

  RETURNS TABLE(
	store_id int,material_id int
	,
	quant  numeric(19,3)
	,
	total  numeric(15,2)				
	) AS
$BODY$
	SELECT
		
		b.store_id,
		b.material_id
		,b.quant AS quant
		,b.total AS total				
	FROM rg_materials AS b
	WHERE b.date_time=reg_current_balance_time()
		
		AND (in_store_id_ar IS NULL OR ARRAY_LENGTH(in_store_id_ar,1) IS NULL OR (b.store_id=ANY(in_store_id_ar)))
		
		AND (in_material_id_ar IS NULL OR ARRAY_LENGTH(in_material_id_ar,1) IS NULL OR (b.material_id=ANY(in_material_id_ar)))
		
		AND(
		b.quant<>0
		 OR b.total<>0
		)
	ORDER BY
		
		b.store_id,
		b.material_id;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100;

ALTER FUNCTION rg_materials_balance(
	
	IN in_store_id_ar int[]
	,
	IN in_material_id_ar int[]
					
	)
 OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:28:29 ******************

CREATE OR REPLACE FUNCTION rg_material_set_custom_period(IN in_new_period timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	NEW_PERIOD timestamp without time zone;
	v_prev_current_period timestamp without time zone;
	v_current_period timestamp without time zone;
	CURRENT_PERIOD timestamp without time zone;
	TA_PERIOD timestamp without time zone;
	REG_INTERVAL interval;
BEGIN
	NEW_PERIOD = rg_calc_period_start('material'::reg_types, in_new_period);
	SELECT date_time INTO CURRENT_PERIOD FROM rg_calc_periods WHERE reg_type = 'material'::reg_types;
	TA_PERIOD = reg_current_balance_time();
	--iterate through all periods between CURRENT_PERIOD and NEW_PERIOD
	REG_INTERVAL = rg_calc_interval('material'::reg_types);
	v_prev_current_period = CURRENT_PERIOD;		
	LOOP
		v_current_period = v_prev_current_period + REG_INTERVAL;
		IF v_current_period > NEW_PERIOD THEN
			EXIT;  -- exit loop
		END IF;
		
		--clear period
		DELETE FROM rg_materials
		WHERE date_time = v_current_period;
		
		--new data
		INSERT INTO rg_materials
		(date_time
		
		,store_id
		,material_id
		,quant
		,total						
		)
		(SELECT
				v_current_period
				
				,rg.store_id
				,rg.material_id
				,rg.quant
				,rg.total				
			FROM rg_materials As rg
			WHERE (
			
			rg.quant<>0
			OR
			rg.total<>0
										
			)
			AND (rg.date_time=v_prev_current_period)
		);

		v_prev_current_period = v_current_period;
	END LOOP;

	--new TA data
	DELETE FROM rg_materials
	WHERE date_time=TA_PERIOD;
	INSERT INTO rg_materials
	(date_time
	
	,store_id
	,material_id
	,quant
	,total	
	)
	(SELECT
		TA_PERIOD
		
		,rg.store_id
		,rg.material_id
		,rg.quant
		,rg.total
		FROM rg_materials AS rg
		WHERE (
		
		rg.quant<>0
		OR
		rg.total<>0
											
		)
		AND (rg.date_time=NEW_PERIOD-REG_INTERVAL)
	);

	DELETE FROM rg_materials WHERE (date_time>NEW_PERIOD)
	AND (date_time<>TA_PERIOD);

	--set new period
	UPDATE rg_calc_periods SET date_time = NEW_PERIOD
	WHERE reg_type='material'::reg_types;		
END
$BODY$
LANGUAGE plpgsql VOLATILE COST 100;

ALTER FUNCTION rg_material_set_custom_period(IN in_new_period timestamp without time zone) OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:35:38 ******************
-- Function: rg_materials_set_custom_period(timestamp without time zone)

-- DROP FUNCTION rg_materials_set_custom_period(timestamp without time zone);

CREATE OR REPLACE FUNCTION rg_materials_set_custom_period(in_new_period timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	NEW_PERIOD timestamp without time zone;
	v_prev_current_period timestamp without time zone;
	v_current_period timestamp without time zone;
	CURRENT_PERIOD timestamp without time zone;
	TA_PERIOD timestamp without time zone;
	REG_INTERVAL interval;
BEGIN
	NEW_PERIOD = rg_calc_period_start('material'::reg_types, in_new_period);
	CURRENT_PERIOD = rg_calc_period('material'::reg_types);
	
	TA_PERIOD = rg_current_balance_time();
	
	--iterate through all periods between CURRENT_PERIOD and NEW_PERIOD
	REG_INTERVAL = rg_calc_interval('material'::reg_types);
	v_prev_current_period = CURRENT_PERIOD;		
	LOOP
		v_current_period = v_prev_current_period + REG_INTERVAL;
		IF v_current_period > NEW_PERIOD THEN
			EXIT;  -- exit loop
		END IF;
		--clear period
		DELETE FROM rg_materials
		WHERE date_time = v_current_period;
		--new data
		INSERT INTO rg_materials
		(date_time
		,store_id
		,material_id
		,quant
		,total
		)
		(SELECT
				v_current_period
				,rg.store_id
				,rg.material_id
				,rg.quant
				,rg.total
			FROM rg_materials As rg
			WHERE (
			rg.quant<>0 OR rg.total<>0
			)
			AND (rg.date_time=v_prev_current_period)
		);
		v_prev_current_period = v_current_period;
	END LOOP;
	--new TA data
	DELETE FROM rg_materials
	WHERE date_time=TA_PERIOD;
	INSERT INTO rg_materials
	(date_time
	,store_id
	,material_id
	,quant
	,total
	)
	(SELECT
		TA_PERIOD
		,rg.store_id
		,rg.material_id
		,rg.quant
		,rg.total
		FROM rg_materials AS rg
		WHERE (
		rg.quant<>0 OR rg.total<>0
		)
		AND (rg.date_time=NEW_PERIOD-REG_INTERVAL)
	);
	DELETE FROM rg_materials WHERE (date_time>NEW_PERIOD)
	AND (date_time<>TA_PERIOD);
	--set new period
	UPDATE rg_calc_periods SET date_time = NEW_PERIOD
	WHERE reg_type='material'::reg_types;		
END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_set_custom_period(timestamp without time zone)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:35:45 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;
	
	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:36:22 ******************
-- Function: ra_materials_add_act(ra_materials)

-- DROP FUNCTION ra_materials_add_act(ra_materials);

CREATE OR REPLACE FUNCTION ra_materials_add_act(reg_act ra_materials)
  RETURNS void AS
$BODY$
	INSERT INTO ra_materials
	(date_time,doc_type,doc_id
	,deb
	,store_id
	,material_id
	,quant
	,total
	)
	VALUES (
	reg_act.date_time,reg_act.doc_type,reg_act.doc_id
	,reg_act.deb
	,reg_act.store_id
	,reg_act.material_id
	,reg_act.quant
	,reg_act.total
	);
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION ra_materials_add_act(ra_materials)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:36:28 ******************
-- Function:  ra_materials_remove_acts(doc_types, integer)

-- DROP FUNCTION  ra_materials_remove_acts(doc_types, integer);

CREATE OR REPLACE FUNCTION ra_materials_remove_acts(
    in_doc_type doc_types,
    in_doc_id integer)
  RETURNS void AS
$BODY$
	DELETE FROM ra_materials WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION  ra_materials_remove_acts(doc_types, integer)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:36:56 ******************
-- Function: rg_materials_balance(int[],int[])

-- DROP FUNCTION rg_materials_balance(int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
	IN in_store_id_ar int[]
	,IN in_material_id_ar int[]
)
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	SELECT
		b.store_id
		,b.material_id
		,b.quant
		,b.total
	FROM rg_materials AS b
	WHERE b.date_time=rg_current_balance_time()
		AND (in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND (in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:37:02 ******************
-- Function: rg_materials_balance(doc_types, integer ,int[],int[])

-- DROP FUNCTION rg_materials_balance(doc_types, integer ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
	IN in_doc_type doc_types
	,IN in_doc_id integer
	,in_store_id_ar int[]
	,in_material_id_ar int[]
)
RETURNS TABLE(
	store_id int
	,material_id int
	,quant numeric(19,3)
	,total numeric(15,2)
) AS
$BODY$
	SELECT * FROM rg_materials_balance(
		(SELECT doc_log.date_time FROM doc_log WHERE doc_log.doc_type=in_doc_type AND doc_log.doc_id=in_doc_id)
		,in_store_id_ar
		,in_material_id_ar
	);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(doc_types, integer ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:37:18 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > rg_period_balance('material'::reg_types,rg_calc_period('material'::reg_types)) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:37:38 ******************
-- Function: ra_materials_process()

-- DROP FUNCTION ra_materials_process();

CREATE OR REPLACE FUNCTION ra_materials_process()
  RETURNS trigger AS
$BODY$
DECLARE
	--Facts
	v_delta_quant numeric(19,3) DEFAULT 0;
	v_delta_total numeric(15,2) DEFAULT 0;
	
	CALC_DATE_TIME timestamp without time zone;
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT')) THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (NEW.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,NEW.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;

		IF TG_OP='UPDATE' AND
		(NEW.date_time<>OLD.date_time
		OR NEW.store_id<>OLD.store_id
		OR NEW.material_id<>OLD.material_id
		) THEN
			--delete old data completely
			PERFORM rg_materials_update_periods(
				OLD.date_time
				,OLD.store_id
				,OLD.material_id
				,-1*OLD.quant
				,-1*OLD.total
			);
			v_delta_quant = 0;
			v_delta_total = 0;
			
		ELSIF TG_OP='UPDATE' THEN						
			v_delta_quant = OLD.quant;
			v_delta_total = OLD.total;
		ELSE
			v_delta_quant = 0;
			v_delta_total = 0;
		END IF;		
		v_delta_quant = NEW.quant - v_delta_quant;
		v_delta_total = NEW.total - v_delta_total;
		IF NOT NEW.deb THEN
			v_delta_quant = -1 * v_delta_quant;
			v_delta_total = -1 * v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			NEW.date_time
			,NEW.store_id
			,NEW.material_id
			,v_delta_quant
			,v_delta_total
			);		
		
		RETURN NEW;					
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='DELETE') THEN
		RETURN OLD;
		
	ELSIF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (OLD.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,OLD.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;
		v_delta_quant = OLD.quant;
		v_delta_total = OLD.total;
		IF OLD.deb THEN
			v_delta_quant = -1*v_delta_quant;
			v_delta_total = -1*v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			OLD.date_time
			,OLD.store_id
			,OLD.material_id
			,v_delta_quant
			,v_delta_total
		);
	
		RETURN OLD;					
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION ra_materials_process() OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:40:32 ******************
-- Trigger: ra_materials_after on ra_materials
-- DROP TRIGGER ra_materials_after ON ra_materials;

CREATE TRIGGER ra_materials_after
  AFTER INSERT OR UPDATE OR DELETE
  ON ra_materials
  FOR EACH ROW
  EXECUTE PROCEDURE ra_materials_process();


-- Trigger: ra_materials_before on ra_materials
-- DROP TRIGGER public.ra_materials_before ON ra_materials;

CREATE TRIGGER ra_materials_before
  BEFORE INSERT OR UPDATE OR DELETE
  ON ra_materials
  FOR EACH ROW
  EXECUTE PROCEDURE ra_materials_process();



-- ******************* update 24/01/2022 11:40:44 ******************
-- Function: ra_materials_process()

-- DROP FUNCTION ra_materials_process();

CREATE OR REPLACE FUNCTION ra_materials_process()
  RETURNS trigger AS
$BODY$
DECLARE
	--Facts
	v_delta_quant numeric(19,3) DEFAULT 0;
	v_delta_total numeric(15,2) DEFAULT 0;
	
	CALC_DATE_TIME timestamp without time zone;
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT')) THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (NEW.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,NEW.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;

		IF TG_OP='UPDATE' AND
		(NEW.date_time<>OLD.date_time
		OR NEW.store_id<>OLD.store_id
		OR NEW.material_id<>OLD.material_id
		) THEN
			--delete old data completely
			PERFORM rg_materials_update_periods(
				OLD.date_time
				,OLD.store_id
				,OLD.material_id
				,-1*OLD.quant
				,-1*OLD.total
			);
			v_delta_quant = 0;
			v_delta_total = 0;
			
		ELSIF TG_OP='UPDATE' THEN						
			v_delta_quant = OLD.quant;
			v_delta_total = OLD.total;
		ELSE
			v_delta_quant = 0;
			v_delta_total = 0;
		END IF;		
		v_delta_quant = NEW.quant - v_delta_quant;
		v_delta_total = NEW.total - v_delta_total;
		IF NOT NEW.deb THEN
			v_delta_quant = -1 * v_delta_quant;
			v_delta_total = -1 * v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			NEW.date_time
			,NEW.store_id
			,NEW.material_id
			,v_delta_quant
			,v_delta_total
			);		
		
		RETURN NEW;					
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='DELETE') THEN
		RETURN OLD;
		
	ELSIF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (OLD.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,OLD.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;
		v_delta_quant = OLD.quant;
		v_delta_total = OLD.total;
		IF OLD.deb THEN
			v_delta_quant = -1*v_delta_quant;
			v_delta_total = -1*v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			OLD.date_time
			,OLD.store_id
			,OLD.material_id
			,v_delta_quant
			,v_delta_total
		);
	
		RETURN OLD;					
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION ra_materials_process() OWNER TO tmnstroi;



-- ******************* update 24/01/2022 11:53:21 ******************
-- VIEW: doc_procurements_list

--DROP VIEW doc_procurements_list;

CREATE OR REPLACE VIEW doc_procurements_list AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.materials_search
		
	FROM doc_procurements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_procurements_list OWNER TO tmnstroi;


-- ******************* update 24/01/2022 11:53:55 ******************
-- VIEW: doc_procurements_dialog

--DROP VIEW doc_procurements_dialog;

CREATE OR REPLACE VIEW doc_procurements_dialog AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.materials
		
	FROM doc_procurements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_procurements_dialog OWNER TO tmnstroi;


-- ******************* update 24/01/2022 11:58:06 ******************

			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
		
			
				
			
			
			
			
			
			
		
			
			
			
			
		
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'20005',
	'DocProcurement_Controller',
	'get_list',
	'DocProcurementList',
	'Документы',
	'Поступление материалов',
	FALSE
	);
	
	

-- ******************* update 24/01/2022 12:25:02 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:25:49 ******************
-- Trigger: doc_procurements_before_trigger on doc_procurements

-- DROP TRIGGER doc_procurements_before_trigger ON doc_procurements;


 CREATE TRIGGER doc_procurements_before_trigger
  BEFORE INSERT OR UPDATE
  ON doc_procurements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_procurements_process();


-- ******************* update 24/01/2022 12:32:19 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id,NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id,NEW.date_time);
		END IF;

		--приход на склад
		/*
		v_materials_act.date_time		= NEW.date_time;
		v_materials_act.doc_type		= 'procurement'::doc_types;		
		v_materials_act.doc_id			= NEW.id;
		v_materials_act.store_id		= v_store_id;
		v_materials_act.material_id		= v_material_id;
		v_materials_act.deb			= TRUE;
		v_materials_act.quant			= NEW.quant;
		v_materials_act.volume			= NEW.total;
		PERFORM ra_materials_add_act(v_materials_act);						
		*/
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:34:57 ******************
-- Trigger: doc_procurements_before_trigger on doc_procurements

 DROP TRIGGER doc_procurements_before_trigger ON doc_procurements;


 CREATE TRIGGER doc_procurements_before_trigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON doc_procurements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_procurements_process();


-- Trigger: doc_procurements_after_trigger on doc_procurements

-- DROP TRIGGER doc_procurements_after_trigger ON doc_procurements;


 CREATE TRIGGER doc_procurements_after_trigger
  AFTER INSERT OR UPDATE
  ON doc_procurements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_procurements_process();
    


-- ******************* update 24/01/2022 12:37:07 ******************
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


-- ******************* update 24/01/2022 12:41:59 ******************
-- Function: doc_log_insert(doc_types, integer, timestamp without time zone)

-- DROP FUNCTION doc_log_insert(doc_types, integer, timestamp without time zone);

CREATE OR REPLACE FUNCTION doc_log_insert(
    doc_types,
    integer,
    timestamp without time zone)
  RETURNS void AS
$BODY$
	INSERT INTO doc_log (doc_type,doc_id,date_time) VALUES ($1,$2,$3);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_insert(doc_types, integer, timestamp without time zone)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:42:11 ******************
-- Function: doc_log_delete(doc_types, integer)

-- DROP FUNCTION doc_log_delete(doc_types, integer);

CREATE OR REPLACE FUNCTION doc_log_delete(
    doc_types,
    integer)
  RETURNS void AS
$BODY$
	DELETE FROM doc_log WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_delete(doc_types, integer)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:51:50 ******************
-- Table: doc_log

-- DROP TABLE doc_log;

CREATE TABLE doc_log
(
  id serial NOT NULL,
  doc_type doc_types,
  doc_id integer,
  date_time timestamp,
  CONSTRAINT doc_log_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE doc_log OWNER TO tmnstroi;

-- Index: doc_log_date_time_index

-- DROP INDEX doc_log_date_time_idx;

CREATE INDEX doc_log_date_time_idx ON doc_log USING btree (date_time);

-- Index: doc_log_doc_idx

-- DROP INDEX doc_log_doc_idx;

CREATE INDEX doc_log_doc_idx ON doc_log USING btree (doc_type, doc_id);




-- ******************* update 24/01/2022 12:51:57 ******************
-- Function: doc_log_delete(doc_types, integer)

-- DROP FUNCTION doc_log_delete(doc_types, integer);

CREATE OR REPLACE FUNCTION doc_log_delete(
    doc_types,
    integer)
  RETURNS void AS
$BODY$
	DELETE FROM doc_log WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_delete(doc_types, integer)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:52:14 ******************
-- Function: doc_log_insert(doc_types, integer, timestamp)

-- DROP FUNCTION doc_log_insert(doc_types, integer, timestamp);

CREATE OR REPLACE FUNCTION doc_log_insert(
    doc_types,
    integer,
    timestamp)
  RETURNS void AS
$BODY$
	INSERT INTO doc_log (doc_type,doc_id,date_time) VALUES ($1,$2,$3);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_insert(doc_types, integer, timestamp)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:52:25 ******************
-- Function: doc_log_update(doc_types, integer, timestampTZ)

-- DROP FUNCTION doc_log_update(doc_types, integer, timestampTZ);

CREATE OR REPLACE FUNCTION doc_log_update(
    doc_types,
    integer,
    timestampTZ)
  RETURNS void AS
$BODY$
	UPDATE doc_log SET date_time=$3 WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_update(doc_types, integer, timestampTZ)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:57:44 ******************
-- Function: ra_materials_add_act(ra_materials)

-- DROP FUNCTION ra_materials_add_act(ra_materials);

CREATE OR REPLACE FUNCTION ra_materials_add_act(reg_act ra_materials)
  RETURNS void AS
$BODY$
	INSERT INTO ra_materials
	(date_time,doc_type,doc_id
	,deb
	,store_id
	,material_id
	,quant
	,total
	)
	VALUES (
	reg_act.date_time,reg_act.doc_type,reg_act.doc_id
	,reg_act.deb
	,reg_act.store_id
	,reg_act.material_id
	,reg_act.quant
	,reg_act.total
	);
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION ra_materials_add_act(ra_materials)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:57:51 ******************
-- Function: ra_materials_process()

-- DROP FUNCTION ra_materials_process();

CREATE OR REPLACE FUNCTION ra_materials_process()
  RETURNS trigger AS
$BODY$
DECLARE
	--Facts
	v_delta_quant numeric(19,3) DEFAULT 0;
	v_delta_total numeric(15,2) DEFAULT 0;
	
	CALC_DATE_TIME timestamp without time zone;
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT')) THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (NEW.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,NEW.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;

		IF TG_OP='UPDATE' AND
		(NEW.date_time<>OLD.date_time
		OR NEW.store_id<>OLD.store_id
		OR NEW.material_id<>OLD.material_id
		) THEN
			--delete old data completely
			PERFORM rg_materials_update_periods(
				OLD.date_time
				,OLD.store_id
				,OLD.material_id
				,-1*OLD.quant
				,-1*OLD.total
			);
			v_delta_quant = 0;
			v_delta_total = 0;
			
		ELSIF TG_OP='UPDATE' THEN						
			v_delta_quant = OLD.quant;
			v_delta_total = OLD.total;
		ELSE
			v_delta_quant = 0;
			v_delta_total = 0;
		END IF;		
		v_delta_quant = NEW.quant - v_delta_quant;
		v_delta_total = NEW.total - v_delta_total;
		IF NOT NEW.deb THEN
			v_delta_quant = -1 * v_delta_quant;
			v_delta_total = -1 * v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			NEW.date_time
			,NEW.store_id
			,NEW.material_id
			,v_delta_quant
			,v_delta_total
			);		
		
		RETURN NEW;					
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='DELETE') THEN
		RETURN OLD;
		
	ELSIF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		CALC_DATE_TIME = rg_calc_period('material'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (OLD.date_time::date > rg_period_balance('material'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('material'::reg_types,OLD.date_time);
			PERFORM rg_materials_set_custom_period(CALC_DATE_TIME);						
		END IF;
		v_delta_quant = OLD.quant;
		v_delta_total = OLD.total;
		IF OLD.deb THEN
			v_delta_quant = -1*v_delta_quant;
			v_delta_total = -1*v_delta_total;
		END IF;

		PERFORM rg_materials_update_periods(
			OLD.date_time
			,OLD.store_id
			,OLD.material_id
			,v_delta_quant
			,v_delta_total
		);
	
		RETURN OLD;					
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION ra_materials_process() OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:57:57 ******************
-- Trigger: ra_materials_after on ra_materials
-- DROP TRIGGER ra_materials_after ON ra_materials;

CREATE TRIGGER ra_materials_after
  AFTER INSERT OR UPDATE OR DELETE
  ON ra_materials
  FOR EACH ROW
  EXECUTE PROCEDURE ra_materials_process();


-- Trigger: ra_materials_before on ra_materials
-- DROP TRIGGER public.ra_materials_before ON ra_materials;

CREATE TRIGGER ra_materials_before
  BEFORE INSERT OR UPDATE OR DELETE
  ON ra_materials
  FOR EACH ROW
  EXECUTE PROCEDURE ra_materials_process();



-- ******************* update 24/01/2022 12:58:02 ******************
-- Function:  ra_materials_remove_acts(doc_types, integer)

-- DROP FUNCTION  ra_materials_remove_acts(doc_types, integer);

CREATE OR REPLACE FUNCTION ra_materials_remove_acts(
    in_doc_type doc_types,
    in_doc_id integer)
  RETURNS void AS
$BODY$
	DELETE FROM ra_materials WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION  ra_materials_remove_acts(doc_types, integer)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:58:28 ******************
-- Function: rg_materials_set_custom_period(timestamp without time zone)

-- DROP FUNCTION rg_materials_set_custom_period(timestamp without time zone);

CREATE OR REPLACE FUNCTION rg_materials_set_custom_period(in_new_period timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	NEW_PERIOD timestamp without time zone;
	v_prev_current_period timestamp without time zone;
	v_current_period timestamp without time zone;
	CURRENT_PERIOD timestamp without time zone;
	TA_PERIOD timestamp without time zone;
	REG_INTERVAL interval;
BEGIN
	NEW_PERIOD = rg_calc_period_start('material'::reg_types, in_new_period);
	CURRENT_PERIOD = rg_calc_period('material'::reg_types);
	
	TA_PERIOD = rg_current_balance_time();
	
	--iterate through all periods between CURRENT_PERIOD and NEW_PERIOD
	REG_INTERVAL = rg_calc_interval('material'::reg_types);
	v_prev_current_period = CURRENT_PERIOD;		
	LOOP
		v_current_period = v_prev_current_period + REG_INTERVAL;
		IF v_current_period > NEW_PERIOD THEN
			EXIT;  -- exit loop
		END IF;
		--clear period
		DELETE FROM rg_materials
		WHERE date_time = v_current_period;
		--new data
		INSERT INTO rg_materials
		(date_time
		,store_id
		,material_id
		,quant
		,total
		)
		(SELECT
				v_current_period
				,rg.store_id
				,rg.material_id
				,rg.quant
				,rg.total
			FROM rg_materials As rg
			WHERE (
			rg.quant<>0 OR rg.total<>0
			)
			AND (rg.date_time=v_prev_current_period)
		);
		v_prev_current_period = v_current_period;
	END LOOP;
	--new TA data
	DELETE FROM rg_materials
	WHERE date_time=TA_PERIOD;
	INSERT INTO rg_materials
	(date_time
	,store_id
	,material_id
	,quant
	,total
	)
	(SELECT
		TA_PERIOD
		,rg.store_id
		,rg.material_id
		,rg.quant
		,rg.total
		FROM rg_materials AS rg
		WHERE (
		rg.quant<>0 OR rg.total<>0
		)
		AND (rg.date_time=NEW_PERIOD-REG_INTERVAL)
	);
	DELETE FROM rg_materials WHERE (date_time>NEW_PERIOD)
	AND (date_time<>TA_PERIOD);
	--set new period
	UPDATE rg_calc_periods SET date_time = NEW_PERIOD
	WHERE reg_type='material'::reg_types;		
END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_set_custom_period(timestamp without time zone)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 12:58:35 ******************

CREATE OR REPLACE FUNCTION rg_material_set_custom_period(IN in_new_period timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	NEW_PERIOD timestamp without time zone;
	v_prev_current_period timestamp without time zone;
	v_current_period timestamp without time zone;
	CURRENT_PERIOD timestamp without time zone;
	TA_PERIOD timestamp without time zone;
	REG_INTERVAL interval;
BEGIN
	NEW_PERIOD = rg_calc_period_start('material'::reg_types, in_new_period);
	SELECT date_time INTO CURRENT_PERIOD FROM rg_calc_periods WHERE reg_type = 'material'::reg_types;
	TA_PERIOD = reg_current_balance_time();
	--iterate through all periods between CURRENT_PERIOD and NEW_PERIOD
	REG_INTERVAL = rg_calc_interval('material'::reg_types);
	v_prev_current_period = CURRENT_PERIOD;		
	LOOP
		v_current_period = v_prev_current_period + REG_INTERVAL;
		IF v_current_period > NEW_PERIOD THEN
			EXIT;  -- exit loop
		END IF;
		
		--clear period
		DELETE FROM rg_materials
		WHERE date_time = v_current_period;
		
		--new data
		INSERT INTO rg_materials
		(date_time
		
		,store_id
		,material_id
		,quant
		,total						
		)
		(SELECT
				v_current_period
				
				,rg.store_id
				,rg.material_id
				,rg.quant
				,rg.total				
			FROM rg_materials As rg
			WHERE (
			
			rg.quant<>0
			OR
			rg.total<>0
										
			)
			AND (rg.date_time=v_prev_current_period)
		);

		v_prev_current_period = v_current_period;
	END LOOP;

	--new TA data
	DELETE FROM rg_materials
	WHERE date_time=TA_PERIOD;
	INSERT INTO rg_materials
	(date_time
	
	,store_id
	,material_id
	,quant
	,total	
	)
	(SELECT
		TA_PERIOD
		
		,rg.store_id
		,rg.material_id
		,rg.quant
		,rg.total
		FROM rg_materials AS rg
		WHERE (
		
		rg.quant<>0
		OR
		rg.total<>0
											
		)
		AND (rg.date_time=NEW_PERIOD-REG_INTERVAL)
	);

	DELETE FROM rg_materials WHERE (date_time>NEW_PERIOD)
	AND (date_time<>TA_PERIOD);

	--set new period
	UPDATE rg_calc_periods SET date_time = NEW_PERIOD
	WHERE reg_type='material'::reg_types;		
END
$BODY$
LANGUAGE plpgsql VOLATILE COST 100;

ALTER FUNCTION rg_material_set_custom_period(IN in_new_period timestamp without time zone) OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:02:34 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;
	
	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:02:53 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > rg_period_balance('material'::reg_types,rg_calc_period('material'::reg_types)) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:03:04 ******************
-- Function: rg_materials_balance(doc_types, integer ,int[],int[])

-- DROP FUNCTION rg_materials_balance(doc_types, integer ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
	IN in_doc_type doc_types
	,IN in_doc_id integer
	,in_store_id_ar int[]
	,in_material_id_ar int[]
)
RETURNS TABLE(
	store_id int
	,material_id int
	,quant numeric(19,3)
	,total numeric(15,2)
) AS
$BODY$
	SELECT * FROM rg_materials_balance(
		(SELECT doc_log.date_time FROM doc_log WHERE doc_log.doc_type=in_doc_type AND doc_log.doc_id=in_doc_id)
		,in_store_id_ar
		,in_material_id_ar
	);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(doc_types, integer ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:03:09 ******************
-- Function: rg_materials_balance(int[],int[])

-- DROP FUNCTION rg_materials_balance(int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
	IN in_store_id_ar int[]
	,IN in_material_id_ar int[]
)
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	SELECT
		b.store_id
		,b.material_id
		,b.quant
		,b.total
	FROM rg_materials AS b
	WHERE b.date_time=rg_current_balance_time()
		AND (in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND (in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:03:32 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time::timestamp without time zone);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time::timestamp without time zone);
		END IF;

		--приход на склад
		/*
		v_materials_act.date_time		= NEW.date_time::timestamp without time zone;
		v_materials_act.doc_type		= 'procurement'::doc_types;		
		v_materials_act.doc_id			= NEW.id;
		v_materials_act.store_id		= v_store_id;
		v_materials_act.material_id		= v_material_id;
		v_materials_act.deb			= TRUE;
		v_materials_act.quant			= NEW.quant;
		v_materials_act.volume			= NEW.total;
		PERFORM ra_materials_add_act(v_materials_act);						
		*/
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:03:43 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		--приход на склад
		/*
		v_materials_act.date_time		= NEW.date_time;
		v_materials_act.doc_type		= 'procurement'::doc_types;		
		v_materials_act.doc_id			= NEW.id;
		v_materials_act.store_id		= v_store_id;
		v_materials_act.material_id		= v_material_id;
		v_materials_act.deb			= TRUE;
		v_materials_act.quant			= NEW.quant;
		v_materials_act.volume			= NEW.total;
		PERFORM ra_materials_add_act(v_materials_act);						
		*/
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:04:35 ******************
-- Function: doc_log_insert(doc_types, integer, timestamp)

 DROP FUNCTION doc_log_insert(doc_types, integer, timestamp);

CREATE OR REPLACE FUNCTION doc_log_insert(
    doc_types,
    integer,
    timestampTZ)
  RETURNS void AS
$BODY$
	INSERT INTO doc_log (doc_type,doc_id,date_time) VALUES ($1,$2,$3);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_insert(doc_types, integer, timestampTZ)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:18:50 ******************
	
		ALTER TABLE public.doc_procurements ADD COLUMN total  numeric(15,2);



-- ******************* update 24/01/2022 13:19:33 ******************
-- VIEW: doc_procurements_list

DROP VIEW doc_procurements_list;

CREATE OR REPLACE VIEW doc_procurements_list AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.total
		,t.materials_search
		
	FROM doc_procurements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_procurements_list OWNER TO tmnstroi;


-- ******************* update 24/01/2022 13:27:54 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:29:59 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:30:37 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:30:53 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 13:31:47 ******************
-- Function: rg_calc_period_start(reg_types, timestamp without time zone)

 DROP FUNCTION rg_calc_period_start(reg_types, timestamp without time zone);

/**
 * Возвращает дату начала периода итогов по любой дате
 */ 
CREATE OR REPLACE FUNCTION rg_calc_period_start(
    in_reg_type reg_types,
    in_date_time  timestampTZ)
  RETURNS timestampTZ AS
$BODY$
	SELECT
		CASE
			WHEN rg_calc_interval(in_reg_type)='1 month' THEN
				date_trunc('month', in_date_time)
			WHEN rg_calc_interval(in_reg_type)='1 day' THEN
				in_date_time::date+'00:00:00'::interval
		END
	;
$BODY$
  LANGUAGE sql IMMUTABLE
  COST 100;
ALTER FUNCTION rg_calc_period_start(reg_types,  timestampTZ)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 14:17:54 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 14:22:16 ******************
-- Trigger: doc_procurements_before_trigger on doc_procurements

 DROP TRIGGER doc_procurements_before_trigger ON doc_procurements;


 CREATE TRIGGER doc_procurements_before_trigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON doc_procurements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_procurements_process();


-- Trigger: doc_procurements_after_trigger on doc_procurements

 DROP TRIGGER doc_procurements_after_trigger ON doc_procurements;


 CREATE TRIGGER doc_procurements_after_trigger
  AFTER INSERT OR UPDATE
  ON doc_procurements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_procurements_process();
    


-- ******************* update 24/01/2022 14:23:27 ******************
-- Function:  ra_materials_remove_acts(doc_types, integer)

-- DROP FUNCTION  ra_materials_remove_acts(doc_types, integer);

CREATE OR REPLACE FUNCTION ra_materials_remove_acts(
    in_doc_type doc_types,
    in_doc_id integer)
  RETURNS void AS
$BODY$
	DELETE FROM ra_materials WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION  ra_materials_remove_acts(doc_types, integer)
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 14:25:12 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 14:27:40 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		RAISE EXCEPTION 'OLD.id=%',OLD.id;
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 14:29:19 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
RAISE EXCEPTION 'TG_WHEN=%, TG_OP=%',TG_WHEN,TG_OP;
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		RAISE EXCEPTION 'OLD.id=%',OLD.id;
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 14:32:53 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
RAISE EXCEPTION 'TG_WHEN=%, TG_OP=%',TG_WHEN,TG_OP;
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('procurement'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 24/01/2022 14:33:04 ******************
-- Function: doc_procurements_process()

-- DROP FUNCTION doc_procurements_process();

CREATE OR REPLACE FUNCTION doc_procurements_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('procurement'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('procurement'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('procurement'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--приход на склад
			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'procurement'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= TRUE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('procurement'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('procurement'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_procurements_process()
  OWNER TO tmnstroi;



-- ******************* update 25/01/2022 13:14:44 ******************

			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
		
			
				
					
			
				
			
			
			
			
			
			
			
		
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
		
	
	-- Adding menu item
	INSERT INTO views
	(id,c,f,t,section,descr,limited)
	VALUES (
	'30000',
	NULL,
	NULL,
	'RepMaterialAction',
	'Отчеты',
	'Движение материалов',
	FALSE
	);
	
	

-- ******************* update 25/01/2022 13:56:43 ******************
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


-- ******************* update 25/01/2022 14:13:24 ******************
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


-- ******************* update 25/01/2022 14:22:50 ******************
CREATE OR REPLACE FUNCTION doc_procurements_ref(doc_procurements)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr','Поступление №'||$1.id::text||' от '||to_char($1.date_time,'DD/MM/YY H:i:s'),
		'dataType','doc_procurements'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_procurements_ref(doc_procurements) OWNER TO tmnstroi;	
	


-- ******************* update 25/01/2022 14:22:54 ******************
-- VIEW: doc_procurements_list

--DROP VIEW doc_procurements_list;

CREATE OR REPLACE VIEW doc_procurements_list AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.total
		,t.materials_search
		,doc_procurements_ref(t)->>'descr' AS self_descr
		
	FROM doc_procurements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_procurements_list OWNER TO tmnstroi;


-- ******************* update 25/01/2022 14:30:47 ******************
CREATE OR REPLACE FUNCTION doc_shipments_ref(doc_shipments)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr','Отгрузка №'||$1.id::text||' от '||to_char($1.date_time,'DD/MM/YY H:i:s'),
		'dataType','doc_shipments'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_shipments_ref(doc_shipments) OWNER TO tmnstroi;	
	


-- ******************* update 25/01/2022 14:31:48 ******************
	
		ALTER TABLE public.doc_shipments ADD COLUMN total  numeric(15,2);



-- ******************* update 25/01/2022 14:32:50 ******************
-- VIEW: doc_shipments_list

--DROP VIEW doc_shipments_list;

CREATE OR REPLACE VIEW doc_shipments_list AS
	SELECT
		t.id 
		,t.date_time
		,t.ship_date
		,t.barge_num
		,t.user_id
		,users_ref(u) AS users_ref
		,t.oktmo_id
		,oktmo_ref(oktmo) AS oktmo_ref
		,t.oktmo_contract_id
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.materials_search
		,t.total,
		doc_shipments_ref(t)->>'descr' AS self_descr
		
	FROM doc_shipments AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_shipments_list OWNER TO tmnstroi;


-- ******************* update 27/01/2022 08:24:15 ******************
CREATE OR REPLACE FUNCTION doc_procurements_ref(doc_procurements)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr','Поступление №'||$1.id::text||' от '||to_char($1.date_time,'DD/MM/YY HH24:MI:SS'),
		'dataType','doc_procurements'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_procurements_ref(doc_procurements) OWNER TO tmnstroi;	
	


-- ******************* update 27/01/2022 08:24:29 ******************
CREATE OR REPLACE FUNCTION doc_shipments_ref(doc_shipments)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr','Отгрузка №'||$1.id::text||' от '||to_char($1.date_time,'DD/MM/YY HH24:MI:SS'),
		'dataType','doc_shipments'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_shipments_ref(doc_shipments) OWNER TO tmnstroi;	
	


-- ******************* update 27/01/2022 08:25:02 ******************
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


-- ******************* update 27/01/2022 08:46:26 ******************
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


-- ******************* update 27/01/2022 10:14:33 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;
	
	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 10:14:53 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;
	
	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 10:17:07 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;
RAISE EXCEPTION '!!!';	
	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 10:17:41 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;
RAISE EXCEPTION 'v_loop_rg_period=%',v_loop_rg_period;	
	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 10:18:22 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;
RAISE EXCEPTION 'in_store_id=%, in_material_id=%, in_quant=%',in_store_id,in_material_id,in_quant;	
	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 10:18:55 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;

	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
RAISE EXCEPTION 'FOUND=%',FOUND;				
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,weight
				,volume
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 10:19:50 ******************
-- Function: rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))

-- DROP FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2));

CREATE OR REPLACE FUNCTION rg_materials_update_periods(
    in_date_time timestampTZ
    ,in_store_id int
    ,in_material_id int
    ,in_quant numeric(19,3)
    ,in_total numeric(15,2)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('material'::reg_types);
	v_loop_rg_period = rg_calc_period_start('material'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('material'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "material" not defined.';
	END IF;

	LOOP
		UPDATE rg_materials
		SET
			quant = quant + in_quant
			,total = total + in_total
		WHERE 
			date_time=v_loop_rg_period
			AND store_id = in_store_id
			AND material_id = in_material_id
			;
				
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_materials (date_time
				,store_id
				,material_id
				,quant
				,total
				)				
				VALUES (v_loop_rg_period
				,in_store_id
				,in_material_id
				,in_quant
				,in_total
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_materials
				SET
					quant = quant + in_quant
					,total = total + in_total
				WHERE date_time = v_loop_rg_period
				AND  store_id = in_store_id
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_materials
	SET
		quant = quant + in_quant
		,total = total + in_total
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND store_id = in_store_id
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_materials (date_time
			,store_id
			,material_id
			,quant
			,total
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_store_id
			,in_material_id
			,in_quant
			,in_total
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_materials
			SET
				quant = quant + in_quant
				,total = total + in_total
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND store_id = in_store_id
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_materials_update_periods(timestampTZ,int,int,numeric(19,3),numeric(15,2))
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 10:52:56 ******************
CREATE OR REPLACE FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[])
  RETURNS TABLE(
  	material_id int,
  	material_descr text,
  	rg_beg_quant numeric(19,4),
  	rg_beg_total numeric(15,2),
  	ra_deb_quant numeric(19,4),
  	ra_deb_total numeric(15,2),
  	ra_kred_quant numeric(19,4),
  	ra_kred_total numeric(15,2),
  	rg_end_quant numeric(19,4),
  	rg_end_total numeric(15,2)  	
  ) AS
$$
	SELECT
		acts.material_id,
		m.name AS material_descr,
		sum(acts.rg_beg_quant) AS rg_beg_quant,
		sum(acts.rg_beg_total) AS rg_beg_total,
		sum(acts.ra_deb_quant) AS ra_deb_quant,
		sum(acts.ra_deb_total) AS ra_deb_total,
		sum(acts.ra_kred_quant) AS ra_kred_quant,
		sum(acts.ra_kred_total) AS ra_kred_total,
		sum(acts.rg_end_quant) AS rg_end_quant,
		sum(acts.rg_end_total) AS rg_end_total
	FROM (
	SELECT
		ra.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		sum(CASE WHEN ra.deb THEN ra.quant ELSE 0 END) AS ra_deb_quant,
		sum(CASE WHEN ra.deb THEN ra.total ELSE 0 END) AS ra_deb_total,
		sum(CASE WHEN NOT ra.deb THEN ra.quant ELSE 0 END) AS ra_kred_quant,
		sum(CASE WHEN NOT ra.deb THEN ra.total ELSE 0 END) AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM ra_materials AS ra
	WHERE ra.date_time BETWEEN in_date_time_from AND in_date_time_to AND ra.store_id = in_store_id
	GROUP BY ra.material_id

	UNION ALL

	--остаток нач
	SELECT
		rg_beg.material_id,
		sum(rg_beg.quant) AS rg_beg_quant,
		sum(rg_beg.total) AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_from, ARRAY[in_store_id], '{}') AS rg_beg
	GROUP BY rg_beg.material_id

	UNION ALL

	--остаток кон
	SELECT
		rg_end.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		sum(rg_end.quant) AS rg_end,
		sum(rg_end.total) AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_to, ARRAY[in_store_id], '{}') AS rg_end
	GROUP BY rg_end.material_id
	) AS acts
	
	LEFT JOIN materials AS m ON m.id = acts.material_id
	
	GROUP BY acts.material_id,m.name
	ORDER BY material_descr
	;

$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]) OWNER TO tmnstroi;	
	


-- ******************* update 27/01/2022 10:53:11 ******************
CREATE OR REPLACE FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[])
  RETURNS TABLE(
  	material_id int,
  	material_descr text,
  	rg_beg_quant numeric(19,4),
  	rg_beg_total numeric(15,2),
  	ra_deb_quant numeric(19,4),
  	ra_deb_total numeric(15,2),
  	ra_kred_quant numeric(19,4),
  	ra_kred_total numeric(15,2),
  	rg_end_quant numeric(19,4),
  	rg_end_total numeric(15,2)  	
  ) AS
$$
	SELECT
		acts.material_id,
		m.name AS material_descr,
		sum(acts.rg_beg_quant) AS rg_beg_quant,
		sum(acts.rg_beg_total) AS rg_beg_total,
		sum(acts.ra_deb_quant) AS ra_deb_quant,
		sum(acts.ra_deb_total) AS ra_deb_total,
		sum(acts.ra_kred_quant) AS ra_kred_quant,
		sum(acts.ra_kred_total) AS ra_kred_total,
		sum(acts.rg_end_quant) AS rg_end_quant,
		sum(acts.rg_end_total) AS rg_end_total
	FROM (
	SELECT
		ra.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		sum(CASE WHEN ra.deb THEN ra.quant ELSE 0 END) AS ra_deb_quant,
		sum(CASE WHEN ra.deb THEN ra.total ELSE 0 END) AS ra_deb_total,
		sum(CASE WHEN NOT ra.deb THEN ra.quant ELSE 0 END) AS ra_kred_quant,
		sum(CASE WHEN NOT ra.deb THEN ra.total ELSE 0 END) AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM ra_materials AS ra
	WHERE ra.date_time BETWEEN in_date_time_from AND in_date_time_to AND ra.store_id = in_store_id
	GROUP BY ra.material_id

	UNION ALL

	--остаток нач
	SELECT
		rg_beg.material_id,
		sum(rg_beg.quant) AS rg_beg_quant,
		sum(rg_beg.total) AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_from, ARRAY[in_store_id], in_materials) AS rg_beg
	GROUP BY rg_beg.material_id

	UNION ALL

	--остаток кон
	SELECT
		rg_end.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		sum(rg_end.quant) AS rg_end,
		sum(rg_end.total) AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_to, ARRAY[in_store_id], in_materials) AS rg_end
	GROUP BY rg_end.material_id
	) AS acts
	
	LEFT JOIN materials AS m ON m.id = acts.material_id
	
	GROUP BY acts.material_id,m.name
	ORDER BY material_descr
	;

$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]) OWNER TO tmnstroi;	
	


-- ******************* update 27/01/2022 10:53:46 ******************
CREATE OR REPLACE FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[])
  RETURNS TABLE(
  	material_id int,
  	material_descr text,
  	rg_beg_quant numeric(19,4),
  	rg_beg_total numeric(15,2),
  	ra_deb_quant numeric(19,4),
  	ra_deb_total numeric(15,2),
  	ra_kred_quant numeric(19,4),
  	ra_kred_total numeric(15,2),
  	rg_end_quant numeric(19,4),
  	rg_end_total numeric(15,2)  	
  ) AS
$$
	SELECT
		acts.material_id,
		m.name AS material_descr,
		sum(acts.rg_beg_quant) AS rg_beg_quant,
		sum(acts.rg_beg_total) AS rg_beg_total,
		sum(acts.ra_deb_quant) AS ra_deb_quant,
		sum(acts.ra_deb_total) AS ra_deb_total,
		sum(acts.ra_kred_quant) AS ra_kred_quant,
		sum(acts.ra_kred_total) AS ra_kred_total,
		sum(acts.rg_end_quant) AS rg_end_quant,
		sum(acts.rg_end_total) AS rg_end_total
	FROM (
	SELECT
		ra.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		sum(CASE WHEN ra.deb THEN ra.quant ELSE 0 END) AS ra_deb_quant,
		sum(CASE WHEN ra.deb THEN ra.total ELSE 0 END) AS ra_deb_total,
		sum(CASE WHEN NOT ra.deb THEN ra.quant ELSE 0 END) AS ra_kred_quant,
		sum(CASE WHEN NOT ra.deb THEN ra.total ELSE 0 END) AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM ra_materials AS ra
	WHERE ra.date_time BETWEEN in_date_time_from AND in_date_time_to AND ra.store_id = in_store_id
	GROUP BY ra.material_id

	UNION ALL

	--остаток нач
	SELECT
		rg_beg.material_id,
		sum(rg_beg.quant) AS rg_beg_quant,
		sum(rg_beg.total) AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_from, ARRAY[in_store_id], in_materials) AS rg_beg
	GROUP BY rg_beg.material_id

	UNION ALL

	--остаток кон
	SELECT
		rg_end.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		sum(rg_end.quant) AS rg_end,
		sum(rg_end.total) AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_to, ARRAY[in_store_id], in_materials) AS rg_end
	GROUP BY rg_end.material_id
	) AS acts
	
	LEFT JOIN materials AS m ON m.id = acts.material_id
	
	GROUP BY acts.material_id,m.name
	ORDER BY material_descr
	;

$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]) OWNER TO tmnstroi;	
	


-- ******************* update 27/01/2022 11:41:14 ******************

DROP FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]);

CREATE OR REPLACE FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[])
  RETURNS TABLE(
  	material_id int,
  	material_descr text,
  	beg_quant numeric(19,4),
  	beg_total numeric(15,2),
  	deb_quant numeric(19,4),
  	deb_total numeric(15,2),
  	kred_quant numeric(19,4),
  	kred_total numeric(15,2),
  	end_quant numeric(19,4),
  	end_total numeric(15,2)  	
  ) AS
$$
	SELECT
		acts.material_id,
		m.name AS material_descr,
		sum(acts.rg_beg_quant) AS beg_quant,
		sum(acts.rg_beg_total) AS beg_total,
		sum(acts.ra_deb_quant) AS deb_quant,
		sum(acts.ra_deb_total) AS deb_total,
		sum(acts.ra_kred_quant) AS kred_quant,
		sum(acts.ra_kred_total) AS kred_total,
		sum(acts.rg_end_quant) AS end_quant,
		sum(acts.rg_end_total) AS end_total
	FROM (
	SELECT
		ra.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		sum(CASE WHEN ra.deb THEN ra.quant ELSE 0 END) AS ra_deb_quant,
		sum(CASE WHEN ra.deb THEN ra.total ELSE 0 END) AS ra_deb_total,
		sum(CASE WHEN NOT ra.deb THEN ra.quant ELSE 0 END) AS ra_kred_quant,
		sum(CASE WHEN NOT ra.deb THEN ra.total ELSE 0 END) AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM ra_materials AS ra
	WHERE ra.date_time BETWEEN in_date_time_from AND in_date_time_to AND ra.store_id = in_store_id
	GROUP BY ra.material_id

	UNION ALL

	--остаток нач
	SELECT
		rg_beg.material_id,
		sum(rg_beg.quant) AS rg_beg_quant,
		sum(rg_beg.total) AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_from, ARRAY[in_store_id], in_materials) AS rg_beg
	GROUP BY rg_beg.material_id

	UNION ALL

	--остаток кон
	SELECT
		rg_end.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		sum(rg_end.quant) AS rg_end,
		sum(rg_end.total) AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_to, ARRAY[in_store_id], in_materials) AS rg_end
	GROUP BY rg_end.material_id
	) AS acts
	
	LEFT JOIN materials AS m ON m.id = acts.material_id
	
	GROUP BY acts.material_id,m.name
	ORDER BY material_descr
	;

$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]) OWNER TO tmnstroi;	
	


-- ******************* update 27/01/2022 12:06:07 ******************
﻿-- Function: format_period_rus(in_date_from date, in_date_to date, in_date_format text)

-- DROP FUNCTION format_period_rus(in_date_from date, in_date_to date, in_date_format text);

CREATE OR REPLACE FUNCTION format_period_rus(in_date_from date, in_date_to date, in_date_format text)
  RETURNS text AS
$$
	WITH
	def_format AS (
		SELECT
			'с '||
			CASE WHEN in_date_format IS NULL THEN to_char(in_date_from,'DD/MM/YY') ELSE to_char(in_date_from,in_date_format) END
			||' по '||
			CASE WHEN in_date_format IS NULL THEN to_char(in_date_to,'DD/MM/YY') ELSE to_char(in_date_to,in_date_format) END
		AS per	
	)
	SELECT
		--Same month, same year
		CASE WHEN extract(day FROM in_date_from)=1 AND last_month_day(in_date_to)=in_date_to THEN			
			CASE
				--1 month
				WHEN
				extract(month FROM in_date_from)=extract(month FROM in_date_to) AND extract(year FROM in_date_from)=extract(year FROM in_date_to) THEN
				'за '||lower(to_char(in_date_to,'TMMonth'))||' '||to_char(in_date_to,'YYYY')||'г.'

				--first quarter
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=3 THEN
				'за 1 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--second quarter
				WHEN
				extract(month FROM in_date_from)=4 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=6 THEN
				'за 2 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--third quarter
				WHEN
				extract(month FROM in_date_from)=7 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=9 THEN
				'за 3 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--forth quarter
				WHEN
				extract(month FROM in_date_from)=10 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=12 THEN
				'за 4 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--6 months
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=6 THEN
				'за первое полугодие '||to_char(in_date_to,'YYYY')||'г.'

				--9 months
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=9 THEN
				'за 9 месяцев '||to_char(in_date_to,'YYYY')||'г.'
				
				--second half
				WHEN
				extract(month FROM in_date_from)=7 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=12 THEN
				'за второе полугодие '||to_char(in_date_to,'YYYY')||'г.'
				
				--year
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=12 THEN
				'за '||to_char(in_date_to,'YYYY')||' год'
				
				ELSE
				(SELECT per FROM def_format)
			END
		--Default
		ELSE
			(SELECT per FROM def_format)
		END
	;
$$
  LANGUAGE sql IMMUTABLE CALLED ON NULL INPUT
  COST 100;
ALTER FUNCTION format_period_rus(in_date_from date, in_date_to date, in_date_format text) OWNER TO tmnstroi;


-- ******************* update 27/01/2022 12:24:58 ******************
﻿-- Function: format_period_rus(in_date_from date, in_date_to date, in_date_format text)

-- DROP FUNCTION format_period_rus(in_date_from date, in_date_to date, in_date_format text);

CREATE OR REPLACE FUNCTION format_period_rus(in_date_from date, in_date_to date, in_date_format text)
  RETURNS text AS
$$
	WITH
	def_format AS (
		SELECT
			'с '||
			CASE WHEN in_date_format IS NULL THEN to_char(in_date_from,'DD/MM/YY') ELSE to_char(in_date_from,in_date_format) END
			||' по '||
			CASE WHEN in_date_format IS NULL THEN to_char(in_date_to,'DD/MM/YY') ELSE to_char(in_date_to,in_date_format) END
		AS per	
	)
	SELECT
		--Same month, same year
		CASE WHEN extract(day FROM in_date_from)=1 AND last_month_day(in_date_to)=in_date_to THEN			
			CASE
				--1 month
				WHEN
				extract(month FROM in_date_from)=extract(month FROM in_date_to) AND extract(year FROM in_date_from)=extract(year FROM in_date_to) THEN
				--'за '||lower(to_char(in_date_to,'TMMonth'))||' '||to_char(in_date_to,'YYYY')||'г.'
				'за '||
				(ARRAY['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'])[extract(month FROM in_date_from)]||
				' '||to_char(in_date_to,'YYYY')||'г.'

				--first quarter
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=3 THEN
				'за 1 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--second quarter
				WHEN
				extract(month FROM in_date_from)=4 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=6 THEN
				'за 2 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--third quarter
				WHEN
				extract(month FROM in_date_from)=7 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=9 THEN
				'за 3 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--forth quarter
				WHEN
				extract(month FROM in_date_from)=10 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=12 THEN
				'за 4 квартал '||to_char(in_date_to,'YYYY')||'г.'

				--6 months
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=6 THEN
				'за первое полугодие '||to_char(in_date_to,'YYYY')||'г.'

				--9 months
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=9 THEN
				'за 9 месяцев '||to_char(in_date_to,'YYYY')||'г.'
				
				--second half
				WHEN
				extract(month FROM in_date_from)=7 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=12 THEN
				'за второе полугодие '||to_char(in_date_to,'YYYY')||'г.'
				
				--year
				WHEN
				extract(month FROM in_date_from)=1 AND extract(year FROM in_date_from)=extract(year FROM in_date_to)
				AND extract(month FROM in_date_to)=12 THEN
				'за '||to_char(in_date_to,'YYYY')||' год'
				
				ELSE
				(SELECT per FROM def_format)
			END
		--Default
		ELSE
			(SELECT per FROM def_format)
		END
	;
$$
  LANGUAGE sql IMMUTABLE CALLED ON NULL INPUT
  COST 100;
ALTER FUNCTION format_period_rus(in_date_from date, in_date_to date, in_date_format text) OWNER TO tmnstroi;


-- ******************* update 27/01/2022 14:05:11 ******************

-- DROP FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]);

CREATE OR REPLACE FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[])
  RETURNS TABLE(
  	material_id int,
  	material_descr text,
  	beg_quant numeric(19,4),
  	beg_total numeric(15,2),
  	deb_quant numeric(19,4),
  	deb_total numeric(15,2),
  	kred_quant numeric(19,4),
  	kred_total numeric(15,2),
  	end_quant numeric(19,4),
  	end_total numeric(15,2)  	
  ) AS
$$
	SELECT
		acts.material_id,
		m.name AS material_descr,
		sum(acts.rg_beg_quant) AS beg_quant,
		sum(acts.rg_beg_total) AS beg_total,
		sum(acts.ra_deb_quant) AS deb_quant,
		sum(acts.ra_deb_total) AS deb_total,
		sum(acts.ra_kred_quant) AS kred_quant,
		sum(acts.ra_kred_total) AS kred_total,
		sum(acts.rg_beg_quant + acts.ra_deb_quant - acts.ra_kred_quant) AS end_quant,
		sum(acts.rg_beg_total + acts.ra_deb_total - acts.ra_kred_total) AS end_quant
	FROM (
	SELECT
		ra.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		sum(CASE WHEN ra.deb THEN ra.quant ELSE 0 END) AS ra_deb_quant,
		sum(CASE WHEN ra.deb THEN ra.total ELSE 0 END) AS ra_deb_total,
		sum(CASE WHEN NOT ra.deb THEN ra.quant ELSE 0 END) AS ra_kred_quant,
		sum(CASE WHEN NOT ra.deb THEN ra.total ELSE 0 END) AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM ra_materials AS ra
	WHERE ra.date_time BETWEEN in_date_time_from AND in_date_time_to AND ra.store_id = in_store_id
	GROUP BY ra.material_id

	UNION ALL

	--остаток нач
	SELECT
		rg_beg.material_id,
		sum(rg_beg.quant) AS rg_beg_quant,
		sum(rg_beg.total) AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		0 AS rg_end_quant,
		0 AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_from, ARRAY[in_store_id], in_materials) AS rg_beg
	GROUP BY rg_beg.material_id
/*
	UNION ALL

	--остаток кон
	SELECT
		rg_end.material_id,
		0 AS rg_beg_quant,
		0 AS rg_beg_total,
		0 AS ra_deb_quant,
		0 AS ra_deb_total,
		0 AS ra_kred_quant,
		0 AS ra_kred_total,
		sum(rg_end.quant) AS rg_end,
		sum(rg_end.total) AS rg_end_total
		
	FROM rg_materials_balance(in_date_time_to, ARRAY[in_store_id], in_materials) AS rg_end
	GROUP BY rg_end.material_id
*/	
	) AS acts
	
	LEFT JOIN materials AS m ON m.id = acts.material_id
	
	GROUP BY acts.material_id,m.name
	ORDER BY material_descr
	;

$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION materials_actions(in_date_time_from timestampTZ, in_date_time_to timestampTZ, in_store_id int, in_materials int[]) OWNER TO tmnstroi;	
	


-- ******************* update 27/01/2022 14:19:20 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > rg_period_balance('material'::reg_types,rg_calc_period('material'::reg_types)) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:23:45 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:26:25 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		act.date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:27:08 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:27:26 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:28:57 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

 DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);
/*
CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;
*/


-- ******************* update 27/01/2022 14:29:37 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:30:06 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:30:12 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

 DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);
/*
CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;
*/


-- ******************* update 27/01/2022 14:31:41 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:32:21 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
			--forward from previous period
			( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
			)
			--backward from current
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
			)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:37:27 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			b.date_time = (SELECT rg_current_balance_time())
			/*
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
				--forward from previous period
				( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
				)
				--backward from current
				OR			
				( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
				)
			)
			*/
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:38:04 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			(in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()))
			OR (
				--forward from previous period
				( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
				)
				--backward from current
				OR			
				( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
				)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:38:46 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			( (in_date_time > (SELECT v FROM last_calc_per)) AND (b.date_time = (SELECT rg_current_balance_time())) )
			OR (
				--forward from previous period
				( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
				)
				--backward from current
				OR			
				( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
				)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:41:53 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			/*
			OR (
				--forward from previous period
				( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
				)
				--backward from current
				OR			
				( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
				)
			)*/
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:44:46 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			OR (
				b.date_time <> (SELECT rg_current_balance_time())
				AND (
					--forward from previous period
					( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
					)
					--backward from current
					OR			
					( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
					)
				)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:45:06 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			OR (
				b.date_time <> (SELECT rg_current_balance_time())
				AND (
					--forward from previous period
					( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
					)
					--backward from current
					OR			
					( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
					)
				)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:47:03 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			OR (
				in_date_time <= (SELECT v FROM last_calc_per)
				AND (
					--forward from previous period
					( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
					)
					--backward from current
					OR			
					( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
					)
				)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		/*
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)*/
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 27/01/2022 14:47:17 ******************
-- Function: rg_materials_balance(timestampTZ,int[],int[])

-- DROP FUNCTION rg_materials_balance(timestampTZ,int[],int[]);

CREATE OR REPLACE FUNCTION rg_materials_balance(
    IN in_date_time timestampTZ
    ,IN in_store_id_ar int[]
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	store_id int
  	,material_id int
  	,quant numeric(19,3)
  	,total numeric(15,2)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('material'::reg_types, rg_calc_period('material'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('material'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('material'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('material'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('material'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.store_id
		,sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
		,SUM(sub.total)::numeric(15,2) AS total
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.store_id
			,b.material_id
			,b.quant
			,b.total
		FROM rg_materials AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			OR (
				in_date_time <= (SELECT v FROM last_calc_per)
				AND (
					--forward from previous period
					( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('material'::reg_types)
					)
					--backward from current
					OR			
					( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
					)
				)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (b.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
			 OR b.total<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.store_id
			,act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		,CASE act.deb
			WHEN TRUE THEN act.total * (SELECT t.v FROM act_sg t)
			ELSE -act.total * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_materials AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (act.store_id=ANY(in_store_id_ar)))
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
			 OR act.total<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_store_id_ar IS NULL OR coalesce(array_length(in_store_id_ar,1),0)=0 OR (sub.store_id=ANY(in_store_id_ar)))
		 AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.store_id
		,sub.material_id
	HAVING
		SUM(sub.quant)<>0
		 OR SUM(sub.total)<>0
	ORDER BY
		sub.store_id
		,sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_materials_balance(timestampTZ,int[],int[])
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:04:26 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();

		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		SELECT
			sum((mat_rows.r->'fields'->>'total')::numeric(15,2))
		INTO NEW.total
		FROM (
		SELECT
			jsonb_array_elements(NEW.materials->'rows') r
		FROM doc_procurements
		) mat_rows;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:42:19 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, '\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION '%', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:43:59 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, '\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION '%', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:44:15 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, '\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION '%', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:45:13 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, '\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION '%', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:45:51 ******************
-- Trigger: doc_shipments_before_trigger on doc_shipments

-- DROP TRIGGER doc_shipments_before_trigger ON doc_shipments;


 CREATE TRIGGER doc_shipments_before_trigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON doc_shipments
  FOR EACH ROW
  EXECUTE PROCEDURE doc_shipments_process();


-- ******************* update 01/02/2022 09:46:25 ******************
-- Trigger: doc_shipments_after_trigger on doc_shipments

-- DROP TRIGGER doc_shipments_after_trigger ON doc_shipments;


 CREATE TRIGGER doc_shipments_after_trigger
  AFTER INSERT OR UPDATE
  ON doc_shipments
  FOR EACH ROW
  EXECUTE PROCEDURE doc_shipments_process();
  
/*
-- Trigger: doc_shipments_before_trigger on doc_shipments

-- DROP TRIGGER doc_shipments_before_trigger ON doc_shipments;


 CREATE TRIGGER doc_shipments_before_trigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON doc_shipments
  FOR EACH ROW
  EXECUTE PROCEDURE doc_shipments_process();
*/  


-- ******************* update 01/02/2022 09:48:52 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, '\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION '%', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:49:38 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION '%', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:51:15 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION '%', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:51:28 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text;	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:51:51 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:52:24 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||m.name||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', length(v_error_s);
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:53:04 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s,
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', length(v_error_s);
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:53:16 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', length(v_error_s);
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:53:40 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %', length(v_error_s), v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:54:15 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:54:49 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model1',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:54:55 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:55:13 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 77
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 09:56:41 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;

		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 77
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance('shipment', NEW.id, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:03:44 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 77
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:04:07 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:04:45 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN bal.quant < m_data.quant THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		RAISE EXCEPTION 'NEW.date_time: %', NEW.date_time;
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:06:06 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, ' ') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN coalesce(bal.quant,0) < coalesce(m_data.quant,0) THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %, %, %', length(v_error_s), v_error_s, NEW.materials;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:06:46 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN coalesce(bal.quant,0) < coalesce(m_data.quant,0) THEN
						'Материал: '||coalesce(m.name,'')||', остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:07:13 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN coalesce(bal.quant,0) < coalesce(m_data.quant,0) THEN
						'Материал: "'||coalesce(m.name,'')||'", остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:22:53 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN coalesce(bal.quant,0) < coalesce(m_data.quant,0) THEN
						'Материал: "'||coalesce(m.name,'')||'", остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
RAISE EXCEPTION 'materials: %', NEW.materials;		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:54:37 ******************
-- FUNCTION: public.materials_ref(materials)

-- DROP FUNCTION public.materials_ref(materials);

CREATE OR REPLACE FUNCTION public.materials_ref(
	materials)
    RETURNS json
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$
SELECT json_build_object(
		'keys',json_build_object(
			    
			),	
		'descr',$1.name,
		'dataType','materials'
	);
$BODY$;

ALTER FUNCTION public.materials_ref(materials)
    OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:55:26 ******************
-- FUNCTION: public.materials_ref(materials)

-- DROP FUNCTION public.materials_ref(materials);

CREATE OR REPLACE FUNCTION public.materials_ref(
	materials)
    RETURNS json
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
AS $BODY$
SELECT json_build_object(
		'keys',json_build_object(
			  'id',  $1.id
			),	
		'descr',$1.name,
		'dataType','materials'
	);
$BODY$;

ALTER FUNCTION public.materials_ref(materials)
    OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:55:51 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN coalesce(bal.quant,0) < coalesce(m_data.quant,0) THEN
						'Материал: "'||coalesce(m.name,'')||'", остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
--RAISE EXCEPTION 'materials: %', NEW.materials;		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 10:58:43 ******************
-- Function: doc_shipments_process()

-- DROP FUNCTION doc_shipments_process();

CREATE OR REPLACE FUNCTION doc_shipments_process()
  RETURNS trigger AS
$BODY$
DECLARE
	v_materials_act ra_materials;
	v_material_id int;
	v_store_id int;
	v_lines jsonb;
	v_error_s text default '';	
BEGIN
	IF TG_WHEN='AFTER' AND (TG_OP='INSERT' OR TG_OP='UPDATE') THEN			
	/*
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
			
		ELSIF TG_OP='UPDATE' THEN
			PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			--PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
*/
		v_store_id = pdfn_stores_base();
		
		FOR v_lines IN SELECT * FROM jsonb_array_elements(NEW.materials->'rows')
		LOOP
			--расход со склада			
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= (v_lines->'fields'->'materials_ref'->'keys'->>'id')::int;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= (v_lines->'fields'->>'quant')::numeric(19,4);
			v_materials_act.total			= (v_lines->'fields'->>'total')::numeric(15,2);
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
		
/*
		FOR v_lines IN
			WITH
			m_data AS (
				SELECT
					(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
					(mat->'fields'->>'quant')::numeric(19,4) AS quant
				FROM jsonb_array_elements(materials->'rows') AS mat
			)
			SELECT
				m_data.material_id,
				m_data.quant,
				CASE WHEN m_data.quant = bal.quant THEN bal.total
					WHEN coalesce(bal.quant,0) = 0 THEN 0
					ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total,
				bal.quant AS bal_quant,
				CASE WHEN bal.quant < m_data.quant THEN materials_ref((SELECT m FROM materialsm WHERE m.id = m_data.material_id))->>'descr'
					ELSE ''
				END AS material_descr
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(now(), ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
		LOOP
			--расход со склада
			IF v_lines.bal_quant < v_lines.quant THEN
				RAISE EXCEPTION 'Материал: %, остаток по складу: %, запрошено: %',v_lines.material_descr,v_lines.bal_quant, v_lines.quant;
			END IF;
			v_materials_act.date_time		= NEW.date_time;
			v_materials_act.doc_type		= 'shipment'::doc_types;		
			v_materials_act.doc_id			= NEW.id;
			v_materials_act.store_id		= v_store_id;
			v_materials_act.material_id		= v_lines.material_id;
			v_materials_act.deb			= FALSE;
			v_materials_act.quant			= v_lines.quant;
			v_materials_act.total			= v_lines.total;
			PERFORM ra_materials_add_act(v_materials_act);									
		END LOOP;
*/		
		RETURN NEW;
	
	ELSIF TG_WHEN='BEFORE' AND TG_OP<>'DELETE' THEN
		IF TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'') THEN
		END IF;
		
		IF TG_OP='INSERT' THEN
			--log
			PERFORM doc_log_insert('shipment'::doc_types,NEW.id, NEW.date_time);
		
		ELSIF TG_OP='UPDATE' THEN
			--PERFORM doc_log_update('shipment'::doc_types,NEW.id, NEW.date_time);
			PERFORM ra_materials_remove_acts('shipment'::doc_types, OLD.id);
		END IF;
		
		v_store_id = pdfn_stores_base();
		
		WITH
		m_data AS (
			SELECT
				(mat->'fields'->>'id')::int AS id,
				(mat->'fields'->'materials_ref'->'keys'->>'id')::int AS material_id,
				(mat->'fields'->>'quant')::numeric(19,4) AS quant
			FROM jsonb_array_elements(NEW.materials->'rows') AS mat
		)
		SELECT
			json_build_object(
				'id','DocMaterialList_Model',
				'rows', json_agg(m_res.m_line)
			),
			string_agg(m_res.error_s, E'\n') AS error_s, --E'\n'
			sum(total) AS total
		INTO NEW.materials, v_error_s, NEW.total
		FROM (
			SELECT
				json_build_object(
					'fields',
					json_build_object(
						'id',m_data.id,
						'materials_ref',materials_ref(m),
						'quant',m_data.quant,
						'price',CASE WHEN coalesce(m_data.quant,0) = coalesce(bal.quant,0) THEN coalesce(m_data.total,0)/coalesce(m_data.quant,0)
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant, 2)
							END,
						'total',CASE WHEN m_data.quant = bal.quant THEN bal.total
								WHEN coalesce(bal.quant,0) = 0 THEN 0
								ELSE round(bal.total / bal.quant * m_data.quant, 2)
							END
					)
				) AS m_line,
				CASE WHEN coalesce(bal.quant,0) < coalesce(m_data.quant,0) THEN
						'Материал: "'||coalesce(m.name,'')||'", остаток: '||coalesce(bal.quant,0)||', затребовано: '||coalesce(m_data.quant,0)
					ELSE ''
				END AS error_s,
				
				CASE WHEN m_data.quant = bal.quant THEN bal.total
				WHEN coalesce(bal.quant,0) = 0 THEN 0
				ELSE round(bal.total / bal.quant * m_data.quant, 2)
				END AS total
				
			FROM m_data
			LEFT JOIN (
				SELECT
					rg.material_id,
					sum(rg.quant) AS quant,
					sum(rg.total) AS total
				FROM rg_materials_balance(NEW.date_time, ARRAY[v_store_id], (SELECT array_agg(m_data.material_id) FROM m_data)) AS rg
				GROUP BY rg.material_id
			) AS bal ON bal.material_id = m_data.material_id		
			
			LEFT JOIN materials AS m ON m.id = m_data.material_id
		) AS m_res;
		
		IF v_error_s <> '' THEN
			RAISE EXCEPTION 'Ошибка проведения: %', v_error_s;
		END IF;
--RAISE EXCEPTION 'materials: %', NEW.materials;		
		RETURN NEW;
			
	ELSIF TG_WHEN='BEFORE' AND TG_OP='DELETE' THEN
		--log
		PERFORM doc_log_delete('shipment'::doc_types,OLD.id);
		
		PERFORM ra_materials_remove_acts('shipment'::doc_types,OLD.id);
		
		RETURN OLD;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_shipments_process()
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:06:52 ******************

					ALTER TYPE reg_types ADD VALUE 'order';
					
	/* type get function */
	CREATE OR REPLACE FUNCTION enum_reg_types_val(reg_types,locales)
	RETURNS text AS $$
		SELECT
		CASE
		WHEN $1='material'::reg_types AND $2='ru'::locales THEN 'Учет материалов'
		WHEN $1='order'::reg_types AND $2='ru'::locales THEN 'Учет заказов материалов'
		ELSE ''
		END;		
	$$ LANGUAGE sql;	
	ALTER FUNCTION enum_reg_types_val(reg_types,locales) OWNER TO tmnstroi;		
	
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
						
			
		
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
									
			
			
									
		
			
		
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
			
			
			
		
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
		
			
				
			
			
			
			
						
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
					
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
		
			
				
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
			
			
			
			
			
		
			
			
			
			
			
		
			
			
			
		
			
				
					
			
				
			
			
			
			
			
			
			
			
		
			
			
			
			
					
			
			
			
			
			
			
			
			
			
			
			
		

-- ******************* update 01/02/2022 11:15:18 ******************
-- Function: ra_orders_add_act(ra_orders)

-- DROP FUNCTION ra_orders_add_act(ra_orders);

CREATE OR REPLACE FUNCTION ra_orders_add_act(reg_act ra_orders)
  RETURNS void AS
$BODY$
	INSERT INTO ra_orders
	(date_time,doc_type,doc_id
	,deb
	,material_id
	,quant
	)
	VALUES (
	reg_act.date_time,reg_act.doc_type,reg_act.doc_id
	,reg_act.deb
	,reg_act.material_id
	,reg_act.quant
	);
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION ra_orders_add_act(ra_orders)
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:15:29 ******************
-- Function: ra_orders_process()

-- DROP FUNCTION ra_orders_process();

CREATE OR REPLACE FUNCTION ra_orders_process()
  RETURNS trigger AS
$BODY$
DECLARE
	--Facts
	v_delta_quant numeric(19,3) DEFAULT 0;
	
	CALC_DATE_TIME timestamp without time zone;
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT')) THEN
		CALC_DATE_TIME = rg_calc_period('order'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (NEW.date_time::date > rg_period_balance('order'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('order'::reg_types,NEW.date_time);
			PERFORM rg_orders_set_custom_period(CALC_DATE_TIME);						
		END IF;

		IF TG_OP='UPDATE' AND
		(NEW.date_time<>OLD.date_time
		OR NEW.material_id<>OLD.material_id
		) THEN
			--delete old data completely
			PERFORM rg_orders_update_periods(
				OLD.date_time
				,OLD.material_id
				,-1*OLD.quant
			);
			v_delta_quant = 0;
			
		ELSIF TG_OP='UPDATE' THEN						
			v_delta_quant = OLD.quant;
		ELSE
			v_delta_quant = 0;
		END IF;		
		v_delta_quant = NEW.quant - v_delta_quant;
		IF NOT NEW.deb THEN
			v_delta_quant = -1 * v_delta_quant;
		END IF;

		PERFORM rg_orders_update_periods(
			NEW.date_time
			,NEW.material_id
			,v_delta_quant
			);		
		
		RETURN NEW;					
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='DELETE') THEN
		RETURN OLD;
		
	ELSIF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		CALC_DATE_TIME = rg_calc_period('order'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (OLD.date_time::date > rg_period_balance('order'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('order'::reg_types,OLD.date_time);
			PERFORM rg_orders_set_custom_period(CALC_DATE_TIME);						
		END IF;
		v_delta_quant = OLD.quant;
		IF OLD.deb THEN
			v_delta_quant = -1*v_delta_quant;
		END IF;

		PERFORM rg_orders_update_periods(
			OLD.date_time
			,OLD.material_id
			,v_delta_quant
		);
	
		RETURN OLD;					
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION ra_orders_process() OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:16:11 ******************
-- Function: ra_orders_process()

-- DROP FUNCTION ra_orders_process();

CREATE OR REPLACE FUNCTION ra_orders_process()
  RETURNS trigger AS
$BODY$
DECLARE
	--Facts
	v_delta_quant numeric(19,3) DEFAULT 0;
	
	CALC_DATE_TIME timestamp without time zone;
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN
		RETURN NEW;
		
	ELSIF (TG_WHEN='AFTER' AND (TG_OP='UPDATE' OR TG_OP='INSERT')) THEN
		CALC_DATE_TIME = rg_calc_period('order'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (NEW.date_time::date > rg_period_balance('order'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('order'::reg_types,NEW.date_time);
			PERFORM rg_orders_set_custom_period(CALC_DATE_TIME);						
		END IF;

		IF TG_OP='UPDATE' AND
		(NEW.date_time<>OLD.date_time
		OR NEW.material_id<>OLD.material_id
		) THEN
			--delete old data completely
			PERFORM rg_orders_update_periods(
				OLD.date_time
				,OLD.material_id
				,-1*OLD.quant
			);
			v_delta_quant = 0;
			
		ELSIF TG_OP='UPDATE' THEN						
			v_delta_quant = OLD.quant;
		ELSE
			v_delta_quant = 0;
		END IF;		
		v_delta_quant = NEW.quant - v_delta_quant;
		IF NOT NEW.deb THEN
			v_delta_quant = -1 * v_delta_quant;
		END IF;

		PERFORM rg_orders_update_periods(
			NEW.date_time
			,NEW.material_id
			,v_delta_quant
			);		
		
		RETURN NEW;					
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='DELETE') THEN
		RETURN OLD;
		
	ELSIF (TG_WHEN='AFTER' AND TG_OP='DELETE') THEN
		CALC_DATE_TIME = rg_calc_period('order'::reg_types);
		IF (CALC_DATE_TIME IS NULL) OR (OLD.date_time::date > rg_period_balance('order'::reg_types, CALC_DATE_TIME)) THEN
			CALC_DATE_TIME = rg_calc_period_start('order'::reg_types,OLD.date_time);
			PERFORM rg_orders_set_custom_period(CALC_DATE_TIME);						
		END IF;
		v_delta_quant = OLD.quant;
		IF OLD.deb THEN
			v_delta_quant = -1*v_delta_quant;
		END IF;

		PERFORM rg_orders_update_periods(
			OLD.date_time
			,OLD.material_id
			,v_delta_quant
		);
	
		RETURN OLD;					
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION ra_orders_process() OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:16:17 ******************
-- Function:  ra_orders_remove_acts(doc_types, integer)

-- DROP FUNCTION  ra_orders_remove_acts(doc_types, integer);

CREATE OR REPLACE FUNCTION ra_orders_remove_acts(
    in_doc_type doc_types,
    in_doc_id integer)
  RETURNS void AS
$BODY$
	DELETE FROM ra_orders WHERE doc_type=$1 AND doc_id=$2;
$BODY$
  LANGUAGE sql VOLATILE STRICT
  COST 100;
ALTER FUNCTION  ra_orders_remove_acts(doc_types, integer)
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:16:22 ******************
-- Trigger: ra_orders_after on ra_orders
-- DROP TRIGGER ra_orders_after ON ra_orders;

CREATE TRIGGER ra_orders_after
  AFTER INSERT OR UPDATE OR DELETE
  ON ra_orders
  FOR EACH ROW
  EXECUTE PROCEDURE ra_orders_process();


-- Trigger: ra_orders_before on ra_orders
-- DROP TRIGGER public.ra_orders_before ON ra_orders;

CREATE TRIGGER ra_orders_before
  BEFORE INSERT OR UPDATE OR DELETE
  ON ra_orders
  FOR EACH ROW
  EXECUTE PROCEDURE ra_orders_process();



-- ******************* update 01/02/2022 11:16:57 ******************
-- Function: rg_orders_update_periods(timestampTZ,int,numeric(19,3))

-- DROP FUNCTION rg_orders_update_periods(timestampTZ,int,numeric(19,3));

CREATE OR REPLACE FUNCTION rg_orders_update_periods(
    in_date_time timestampTZ
    ,in_material_id int
    ,in_quant numeric(19,3)
    )
  RETURNS void AS
$BODY$
DECLARE
	v_loop_rg_period timestamp without time zone;
	v_calc_interval interval;			  			
	CURRENT_BALANCE_DATE_TIME timestamp without time zone;
	CALC_DATE_TIME timestamp without time zone;
BEGIN
	CALC_DATE_TIME = rg_calc_period('order'::reg_types);
	v_loop_rg_period = rg_calc_period_start('order'::reg_types,in_date_time);
	v_calc_interval = rg_calc_interval('order'::reg_types);
	IF v_calc_interval IS NULL THEN
		RAISE EXCEPTION 'Interval for register "order" not defined.';
	END IF;
	
	LOOP
		UPDATE rg_orders
		SET
			quant = quant + in_quant
		WHERE 
			date_time=v_loop_rg_period
			AND material_id = in_material_id
			;
			
		IF NOT FOUND THEN
			BEGIN
				INSERT INTO rg_orders (date_time
				,material_id
				,quant
				)				
				VALUES (v_loop_rg_period
				,in_material_id
				,in_quant
				);
			EXCEPTION WHEN OTHERS THEN
				UPDATE rg_orders
				SET
					quant = quant + in_quant
				WHERE date_time = v_loop_rg_period
				AND  material_id = in_material_id
				;
			END;
		END IF;
		v_loop_rg_period = v_loop_rg_period + v_calc_interval;
		IF v_loop_rg_period > CALC_DATE_TIME THEN
			EXIT;  -- exit loop
		END IF;
	END LOOP;
	
	--Current balance
	CURRENT_BALANCE_DATE_TIME = rg_current_balance_time();
	UPDATE rg_orders
	SET
		quant = quant + in_quant
	WHERE 
		date_time=CURRENT_BALANCE_DATE_TIME
		AND material_id = in_material_id
		;
		
	IF NOT FOUND THEN
		BEGIN
			INSERT INTO rg_orders (date_time
			,material_id
			,quant
			)
			VALUES (CURRENT_BALANCE_DATE_TIME
			,in_material_id
			,in_quant
			);
		EXCEPTION WHEN OTHERS THEN
			UPDATE rg_orders
			SET
				quant = quant + in_quant
			WHERE 
				date_time=CURRENT_BALANCE_DATE_TIME
				AND material_id = in_material_id
				;
		END;
	END IF;					
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_orders_update_periods(timestampTZ,int,numeric(19,3))
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:17:06 ******************
-- Function: rg_orders_set_custom_period(timestamp without time zone)

-- DROP FUNCTION rg_orders_set_custom_period(timestamp without time zone);

CREATE OR REPLACE FUNCTION rg_orders_set_custom_period(in_new_period timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	NEW_PERIOD timestamp without time zone;
	v_prev_current_period timestamp without time zone;
	v_current_period timestamp without time zone;
	CURRENT_PERIOD timestamp without time zone;
	TA_PERIOD timestamp without time zone;
	REG_INTERVAL interval;
BEGIN
	NEW_PERIOD = rg_calc_period_start('order'::reg_types, in_new_period);
	CURRENT_PERIOD = rg_calc_period('order'::reg_types);
	
	TA_PERIOD = rg_current_balance_time();
	
	--iterate through all periods between CURRENT_PERIOD and NEW_PERIOD
	REG_INTERVAL = rg_calc_interval('order'::reg_types);
	v_prev_current_period = CURRENT_PERIOD;		
	LOOP
		v_current_period = v_prev_current_period + REG_INTERVAL;
		IF v_current_period > NEW_PERIOD THEN
			EXIT;  -- exit loop
		END IF;
		--clear period
		DELETE FROM rg_orders
		WHERE date_time = v_current_period;
		--new data
		INSERT INTO rg_orders
		(date_time
		,material_id
		,quant
		)
		(SELECT
				v_current_period
				,rg.material_id
				,rg.quant
			FROM rg_orders As rg
			WHERE (
			rg.quant<>0
			)
			AND (rg.date_time=v_prev_current_period)
		);
		v_prev_current_period = v_current_period;
	END LOOP;
	--new TA data
	DELETE FROM rg_orders
	WHERE date_time=TA_PERIOD;
	INSERT INTO rg_orders
	(date_time
	,material_id
	,quant
	)
	(SELECT
		TA_PERIOD
		,rg.material_id
		,rg.quant
		FROM rg_orders AS rg
		WHERE (
		rg.quant<>0
		)
		AND (rg.date_time=NEW_PERIOD-REG_INTERVAL)
	);
	DELETE FROM rg_orders WHERE (date_time>NEW_PERIOD)
	AND (date_time<>TA_PERIOD);
	--set new period
	UPDATE rg_calc_periods SET date_time = NEW_PERIOD
	WHERE reg_type='order'::reg_types;		
END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION rg_orders_set_custom_period(timestamp without time zone)
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:17:11 ******************
-- Function: rg_orders_balance(timestampTZ,int[])

-- DROP FUNCTION rg_orders_balance(timestampTZ,int[]);

CREATE OR REPLACE FUNCTION rg_orders_balance(
    IN in_date_time timestampTZ
    ,IN in_material_id_ar int[]
    )
  RETURNS TABLE(
  	material_id int
  	,quant numeric(19,3)
  	) AS
$BODY$
	WITH
	last_calc_per AS (SELECT rg_period_balance('order'::reg_types, rg_calc_period('order'::reg_types)) AS v ),
	cur_per AS (SELECT rg_calc_period_start('order'::reg_types, in_date_time::timestamp without time zone) AS v ),
	next_per AS (SELECT rg_calc_period_start('order'::reg_types, (SELECT v FROM cur_per)+rg_calc_interval('order'::reg_types)) AS v ),
	act_forward AS (
		SELECT
			rg_period_balance('order'::reg_types,in_date_time::timestamp without time zone) - in_date_time >
			in_date_time - (SELECT t.v FROM cur_per t)
			AS v
	),
	act_sg AS (SELECT CASE WHEN t.v THEN 1 ELSE -1 END AS v FROM act_forward t)
	SELECT
		sub.material_id
		,SUM(sub.quant)::numeric(19,3) AS quant
	FROM(
		-- *** BALANCE ***
		(SELECT
			b.material_id
			,b.quant
		FROM rg_orders AS b
		WHERE
		(
			--date bigger than last calc period
			( in_date_time > (SELECT v FROM last_calc_per) AND b.date_time = (SELECT rg_current_balance_time()) )
			OR (
				in_date_time <= (SELECT v FROM last_calc_per)
				AND (				
					--forward from previous period
					( (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)-rg_calc_interval('order'::reg_types)
					)
					--backward from current
					OR			
					( NOT (SELECT t.v FROM act_forward t) AND b.date_time = (SELECT t.v FROM cur_per t)
					)
				)
			)
		)
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
		)
		)
		
		UNION ALL
		
		-- *** ACTS ***
		(SELECT
			act.material_id
		,CASE act.deb
			WHEN TRUE THEN act.quant * (SELECT t.v FROM act_sg t)
			ELSE -act.quant * (SELECT t.v FROM act_sg t)
		END AS quant
		
		FROM doc_log
		LEFT JOIN ra_orders AS act ON act.doc_type=doc_log.doc_type AND act.doc_id=doc_log.doc_id
		WHERE
		--date less then last calc period otherwise - no actions
		in_date_time <= (SELECT v FROM last_calc_per)
		AND 
		(
			--forward from current period
			( (SELECT t.v FROM act_forward t) AND
					act.date_time >= (SELECT t.v FROM cur_per t)
					AND act.date_time <= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)<=date_trunc('second',in_date_time)
						ORDER BY l.date_time DESC
						LIMIT 1
						)
			)
			--backward from next period
			OR			
			( NOT (SELECT t.v FROM act_forward t) AND
					act.date_time >= 
						(SELECT l.date_time
						FROM doc_log l
						WHERE date_trunc('second',l.date_time)>=date_trunc('second',in_date_time)
						ORDER BY l.date_time ASC
						LIMIT 1
						)			
					AND act.date_time <= (SELECT t.v FROM next_per t)
			)
		)
		AND ( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (act.material_id=ANY(in_material_id_ar)))
		AND (
			act.quant<>0
		)
		ORDER BY doc_log.date_time,doc_log.id
		)
	) AS sub
	WHERE
		( in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (sub.material_id=ANY(in_material_id_ar)))
	GROUP BY
		sub.material_id
	HAVING
		SUM(sub.quant)<>0
	ORDER BY
		sub.material_id
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_orders_balance(timestampTZ,int[])
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:17:16 ******************
-- Function: rg_orders_balance(doc_types, integer ,int[])

-- DROP FUNCTION rg_orders_balance(doc_types, integer ,int[]);

CREATE OR REPLACE FUNCTION rg_orders_balance(
	IN in_doc_type doc_types
	,IN in_doc_id integer
	,in_material_id_ar int[]
)
RETURNS TABLE(
	material_id int
	,quant numeric(19,3)
) AS
$BODY$
	SELECT * FROM rg_orders_balance(
		(SELECT doc_log.date_time FROM doc_log WHERE doc_log.doc_type=in_doc_type AND doc_log.doc_id=in_doc_id)
		,in_material_id_ar
	);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_orders_balance(doc_types, integer ,int[])
  OWNER TO tmnstroi;



-- ******************* update 01/02/2022 11:17:20 ******************
-- Function: rg_orders_balance(int[])

-- DROP FUNCTION rg_orders_balance(int[]);

CREATE OR REPLACE FUNCTION rg_orders_balance(
	IN in_material_id_ar int[]
)
  RETURNS TABLE(
  	material_id int
  	,quant numeric(19,3)
  	) AS
$BODY$
	SELECT
		b.material_id
		,b.quant
	FROM rg_orders AS b
	WHERE b.date_time=rg_current_balance_time()
		AND (in_material_id_ar IS NULL OR coalesce(array_length(in_material_id_ar,1),0)=0 OR (b.material_id=ANY(in_material_id_ar)))
		AND (
			b.quant<>0
		)
	;
$BODY$
  LANGUAGE sql VOLATILE CALLED ON NULL INPUT
  COST 100
  ROWS 1000;
ALTER FUNCTION rg_orders_balance(int[])
  OWNER TO tmnstroi;



-- ******************* update 09/02/2022 11:42:51 ******************
-- FUNCTION: public.rg_total_recalc_materials()

-- DROP FUNCTION public.rg_total_recalc_materials();

CREATE OR REPLACE FUNCTION public.rg_total_recalc_materials(
	)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE
	period_row RECORD;
	v_act_date_time timestamp without time zone;
	v_cur_period timestamp without time zone;
BEGIN	
	v_act_date_time = reg_current_balance_time();
	SELECT date_time INTO v_cur_period FROM rg_calc_periods;
	
	FOR period_row IN
		WITH
		periods AS (
			(SELECT
				DISTINCT date_trunc('month', date_time) AS d,
				production_base_id,
				material_id
			FROM ra_materials)
			UNION		
			(SELECT
				date_time AS d,
				production_base_id,
				material_id
			FROM rg_materials WHERE date_time<=v_cur_period
			)
			ORDER BY d			
		)
		SELECT sub.d,sub.production_base_id,sub.material_id,sub.balance_fact,sub.balance_paper
		FROM
		(
		SELECT
			periods.d,
			periods.production_base_id,
			periods.material_id,
			COALESCE((
				SELECT SUM(CASE WHEN deb THEN quant ELSE 0 END)-SUM(CASE WHEN NOT deb THEN quant ELSE 0 END)
				FROM ra_materials AS ra WHERE ra.date_time <= last_month_day(periods.d::date)+'23:59:59'::interval AND ra.production_base_id=periods.production_base_id AND ra.material_id=periods.material_id
			),0) AS balance_fact,
			
			(
			SELECT SUM(quant) FROM rg_materials WHERE date_time=periods.d AND production_base_id=periods.production_base_id AND material_id=periods.material_id
			) AS balance_paper
			
		FROM periods
		) AS sub
		WHERE sub.balance_fact<>sub.balance_paper ORDER BY sub.d	
	LOOP
		
		UPDATE rg_materials AS rg
		SET quant = period_row.balance_fact
		WHERE rg.date_time=period_row.d AND rg.production_base_id=period_row.production_base_id AND rg.material_id=period_row.material_id;
		
		IF NOT FOUND THEN
			INSERT INTO rg_materials (date_time, production_base_id, material_id,quant)
			VALUES (period_row.d, period_row.production_base_id, period_row.material_id, period_row.balance_fact);
		END IF;
	END LOOP;

	--АКТУАЛЬНЫЕ ИТОГИ
	DELETE FROM rg_materials WHERE date_time>v_cur_period;
	
	INSERT INTO rg_materials (date_time, production_base_id, material_id,quant)
	(
	SELECT
		v_act_date_time,
		rg.production_base_id,
		rg.material_id,
		COALESCE(rg.quant,0) +
		COALESCE((
		SELECT sum(ra.quant) FROM
		ra_materials AS ra
		WHERE ra.date_time BETWEEN v_cur_period AND last_month_day(v_cur_period::date)+'23:59:59'::interval
			AND ra.production_base_id=rg.production_base_id
			AND ra.material_id=rg.material_id
			AND ra.deb=TRUE
		),0) - 
		COALESCE((
		SELECT sum(ra.quant) FROM
		ra_materials AS ra
		WHERE ra.date_time BETWEEN v_cur_period AND last_month_day(v_cur_period::date)+'23:59:59'::interval
			AND ra.production_base_id=rg.production_base_id
			AND ra.material_id=rg.material_id
			AND ra.deb=FALSE
		),0)
		
	FROM rg_materials AS rg
	WHERE date_time=(v_cur_period-'1 month'::interval)
	);	
END;
$BODY$;

ALTER FUNCTION public.rg_total_recalc_materials()
    OWNER TO tmnstroi;


