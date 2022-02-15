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
	
ALTER VIEW doc_movements_dialog OWNER TO ;
