-- VIEW: doc_procurements_dialog

--DROP VIEW doc_procurements_dialog;

CREATE OR REPLACE VIEW doc_procurements_dialog AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.materials
		
	FROM doc_procurements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_procurements_dialog OWNER TO ;
