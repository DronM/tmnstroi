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
		oktmo_ref(oktmo) AS oktmo_ref
	FROM users AS u
	LEFT JOIN time_zone_locales AS tzl ON tzl.id=u.time_zone_locale_id
	LEFT JOIN oktmo ON oktmo.id=u.oktmo_id
	;

ALTER TABLE public.users_dialog
  OWNER TO tmnstroi;

