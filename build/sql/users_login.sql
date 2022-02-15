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
  OWNER TO ;

