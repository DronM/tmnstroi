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
	
ALTER VIEW doc_pass_to_productions_list OWNER TO ;
