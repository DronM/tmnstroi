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
	
ALTER VIEW oktmo_contracts_list OWNER TO ;
