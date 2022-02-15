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
	
ALTER VIEW okei_list OWNER TO ;
