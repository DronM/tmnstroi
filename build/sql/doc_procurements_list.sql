-- VIEW: doc_procurements_list

--DROP VIEW doc_procurements_list;

CREATE OR REPLACE VIEW doc_procurements_list AS
	SELECT
		t.id 
		,t.date_time
		,t.user_id
		,users_ref(u) AS users_ref
		,t.total
		,t.materials_search
		,doc_procurements_ref(t)->>'descr' AS self_descr
		
	FROM doc_procurements AS t
	LEFT JOIN users AS u ON u.id = t.user_id
	ORDER BY t.date_time desc
	;
	
ALTER VIEW doc_procurements_list OWNER TO ;
