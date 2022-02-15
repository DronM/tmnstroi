-- VIEW: doc_shipments_list

--DROP VIEW doc_shipments_list;

CREATE OR REPLACE VIEW doc_shipments_list AS
	SELECT
		t.id 
		,t.date_time
		,t.ship_date
		,t.barge_num
		,t.user_id
		,users_ref(u) AS users_ref
		,t.oktmo_id
		,oktmo_ref(oktmo) AS oktmo_ref
		,t.oktmo_contract_id
		,oktmo_contracts_ref(oktmo_contracts) AS oktmo_contracts_ref
		,t.materials_search
		,t.total,
		doc_shipments_ref(t)->>'descr' AS self_descr
		
	FROM doc_shipments AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	LEFT JOIN oktmo ON oktmo.id = t.oktmo_id
	LEFT JOIN oktmo_contracts ON oktmo_contracts.id = t.oktmo_contract_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_shipments_list OWNER TO ;
