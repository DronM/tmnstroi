-- Trigger: doc_pass_to_productions_before_trigger on doc_orders

-- DROP TRIGGER doc_pass_to_productions_before_trigger ON doc_pass_to_productions;


 CREATE TRIGGER doc_pass_to_productions_before_trigger
  BEFORE INSERT OR UPDATE
  ON doc_orders
  FOR EACH ROW
  EXECUTE PROCEDURE doc_pass_to_productions_process();
