-- VIEW: doc_orders_dialog

--DROP VIEW doc_orders_dialog;

CREATE OR REPLACE VIEW doc_orders_dialog AS
	SELECT
		t.id 
		,t.date_time
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.closed
		,t.closed_inf
		,t.materials
		
	FROM doc_orders AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_orders_dialog OWNER TO ;
