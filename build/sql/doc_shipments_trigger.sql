-- Trigger: doc_shipments_after_trigger on doc_shipments

-- DROP TRIGGER doc_shipments_after_trigger ON doc_shipments;


 CREATE TRIGGER doc_shipments_after_trigger
  AFTER INSERT OR UPDATE
  ON doc_shipments
  FOR EACH ROW
  EXECUTE PROCEDURE doc_shipments_process();
  
/*
-- Trigger: doc_shipments_before_trigger on doc_shipments

-- DROP TRIGGER doc_shipments_before_trigger ON doc_shipments;


 CREATE TRIGGER doc_shipments_before_trigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON doc_shipments
  FOR EACH ROW
  EXECUTE PROCEDURE doc_shipments_process();
*/  
