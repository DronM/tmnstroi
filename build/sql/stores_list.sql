-- VIEW: stores_list

--DROP VIEW stores_list;

CREATE OR REPLACE VIEW stores_list AS
	SELECT
		stores.id,
		stores.name,
		oktmo_contracts_ref(o_ct) AS oktmo_contracts_ref
	FROM stores
	LEFT JOIN oktmo_contracts AS o_ct ON o_ct.id = stores.oktmo_contract_id
	;
	
ALTER VIEW stores_list OWNER TO ;
