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
	
ALTER VIEW doc_movements_list OWNER TO ;
