-- Function: doc_pass_to_productions_process()

-- DROP FUNCTION doc_pass_to_productions_process();

CREATE OR REPLACE FUNCTION doc_pass_to_productions_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.oktmo_contract_id,0)<>coalesce(OLD.oktmo_contract_id,0)) THEN
		NEW.oktmo_id = (SELECT oktmo_id FROM oktmo_contracts WHERE id = NEW.oktmo_contract_id);
	END IF;

	IF TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR coalesce(NEW.materials::text,'')<>coalesce(OLD.materials::text,'')) THEN
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_pass_to_productions_process()
  OWNER TO ;

