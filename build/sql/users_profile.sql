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
ALTER TABLE users_profile OWNER TO ;

