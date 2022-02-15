-- VIEW: doc_shipments_dialog

DROP VIEW doc_shipments_dialog;

CREATE OR REPLACE VIEW doc_shipments_dialog AS
	SELECT
		t.id 
		,t.date_time
		,t.ship_date
		,t.barge_num
		,users_ref(u) AS users_ref
		,oktmo_ref(oktmo) AS oktmo_ref
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.materials
		,t.pallets
		
	FROM doc_shipments AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	;
	
ALTER VIEW doc_shipments_dialog OWNER TO ;
