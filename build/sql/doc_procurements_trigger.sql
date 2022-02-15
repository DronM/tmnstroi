-- Trigger: doc_procurements_before_trigger on doc_procurements

 DROP TRIGGER doc_procurements_before_trigger ON doc_procurements;


 CREATE TRIGGER doc_procurements_before_trigger
  BEFORE INSERT OR UPDATE OR DELETE
  ON doc_procurements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_procurements_process();


-- Trigger: doc_procurements_after_trigger on doc_procurements

 DROP TRIGGER doc_procurements_after_trigger ON doc_procurements;


 CREATE TRIGGER doc_procurements_after_trigger
  AFTER INSERT OR UPDATE
  ON doc_procurements
  FOR EACH ROW
  EXECUTE PROCEDURE doc_procurements_process();
    
