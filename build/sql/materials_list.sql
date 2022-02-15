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
	
ALTER VIEW materials_list OWNER TO ;
