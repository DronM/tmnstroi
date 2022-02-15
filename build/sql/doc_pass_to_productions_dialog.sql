-- VIEW: doc_pass_to_productions_dialog

--DROP VIEW doc_pass_to_productions_dialog;

CREATE OR REPLACE VIEW doc_pass_to_productions_dialog AS
	SELECT
		t.id 
		,t.date_time
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials
		
	FROM doc_pass_to_productions AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_pass_to_productions_dialog OWNER TO ;
