-- Run after a full schema+data PostgreSQL restore with an explicitly trusted
-- backup verification role (BYPASSRLS). Never accept a tenant-filtered dump.
DO $$
DECLARE relation_name text; required_foreign_keys integer;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = current_user AND (rolsuper OR rolbypassrls)) THEN
    RAISE EXCEPTION 'Full financial restore verification requires trusted BYPASSRLS backup role';
  END IF;
  FOREACH relation_name IN ARRAY ARRAY['financial_operation', 'ai_provider_tariff', 'ai_budget_account',
    'ai_cost_reservation', 'ai_budget_allocation', 'ai_provider_attempt', 'ai_financial_reconciliation_event',
    'financial_journal', 'financial_ledger_entry'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE c.relname=relation_name AND n.nspname=current_schema() AND c.relrowsecurity AND c.relforcerowsecurity) THEN
      RAISE EXCEPTION 'Financial relation or tenant RLS missing: %', relation_name;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger g JOIN pg_class c ON c.oid=g.tgrelid
      JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=current_schema()
      AND c.relname=relation_name AND g.tgname='financial_no_truncate' AND g.tgenabled IN ('O','A')) THEN
      RAISE EXCEPTION 'Financial truncate protection missing: %', relation_name;
    END IF;
    IF relation_name <> 'financial_journal' AND NOT EXISTS (
      SELECT 1 FROM pg_trigger g JOIN pg_class c ON c.oid=g.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname=current_schema() AND c.relname=relation_name AND g.tgname='financial_immutable'
      AND g.tgenabled IN ('O','A')) THEN RAISE EXCEPTION 'Financial immutability missing: %', relation_name; END IF;
    required_foreign_keys := CASE relation_name WHEN 'financial_operation' THEN 2 WHEN 'ai_provider_tariff' THEN 2
      WHEN 'ai_budget_account' THEN 5 WHEN 'ai_cost_reservation' THEN 6 WHEN 'ai_budget_allocation' THEN 3
      WHEN 'ai_provider_attempt' THEN 4 WHEN 'ai_financial_reconciliation_event' THEN 5
      WHEN 'financial_journal' THEN 3 ELSE 2 END;
    IF (SELECT count(*) FROM pg_constraint k JOIN pg_class c ON c.oid=k.conrelid
      JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=current_schema()
      AND c.relname=relation_name AND k.contype='f' AND k.convalidated) < required_foreign_keys THEN
      RAISE EXCEPTION 'Financial restore is missing required foreign keys: %', relation_name;
    END IF;
  END LOOP;
  IF (SELECT count(*) FROM pg_trigger g JOIN pg_class c ON c.oid=g.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=current_schema()
    AND g.tgname IN ('financial_journal_guard','financial_entry_guard','financial_journal_balanced','financial_entries_balanced')
    AND g.tgenabled IN ('O','A')) <> 4 THEN RAISE EXCEPTION 'Financial ledger triggers missing or disabled'; END IF;
  IF EXISTS (SELECT 1 FROM financial_journal j LEFT JOIN financial_ledger_entry e
    ON e.organization_id=j.organization_id AND e.journal_id=j.id
    GROUP BY j.organization_id,j.id,j.sealed
    HAVING NOT j.sealed OR count(e.id)<2 OR
      COALESCE(sum(CASE WHEN e.side='DEBIT' THEN e.amount_units::numeric ELSE -e.amount_units::numeric END),0)<>0) THEN
    RAISE EXCEPTION 'Restored financial journal is incomplete or unbalanced';
  END IF;
  IF EXISTS (SELECT 1 FROM financial_journal j JOIN ai_financial_reconciliation_event r
    ON r.organization_id=j.organization_id AND r.id=j.reconciliation_event_id
    WHERE j.subledger='AI_EXPENSE' AND (r.operation_id<>j.operation_id OR r.currency<>j.currency
      OR r.monetary_scale<>j.monetary_scale OR r.event_kind NOT IN ('SETTLED','ADJUSTED')
      OR r.amount_units::numeric<>(SELECT COALESCE(sum(e.amount_units::numeric),0) FROM financial_ledger_entry e
        WHERE e.organization_id=j.organization_id AND e.journal_id=j.id AND e.side='DEBIT'))) THEN
    RAISE EXCEPTION 'Restored AI financial journal has mismatched reconciliation evidence';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid
    JOIN pg_namespace n ON n.oid=t.relnamespace WHERE n.nspname=current_schema()
    AND t.relname IN ('financial_operation','ai_provider_tariff','ai_budget_account','ai_cost_reservation',
      'ai_budget_allocation','ai_provider_attempt','ai_financial_reconciliation_event','financial_journal','financial_ledger_entry')
    AND NOT c.convalidated) THEN RAISE EXCEPTION 'Financial restore has unvalidated constraints'; END IF;
END;
$$;
