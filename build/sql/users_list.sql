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

ALTER TABLE users_list OWNER TO ;

