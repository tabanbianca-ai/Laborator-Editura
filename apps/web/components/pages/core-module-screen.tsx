import type { ApiResult } from "../../lib/api-client";
import type { CoreModuleShellData, CoreModuleRecord } from "../../lib/core-module-client";
import { Badge, Button, DataTable, EmptyState, ErrorState, PageHeader } from "../ui";

interface CoreModuleScreenProps {
  eyebrow: string;
  result: ApiResult<CoreModuleShellData>;
}

function getStatusTone(status: CoreModuleRecord["status"]) {
  if (status === "READY") {
    return "success";
  }

  if (status === "PLANNED") {
    return "info";
  }

  return "neutral";
}

export function CoreModuleScreen({ eyebrow, result }: CoreModuleScreenProps) {
  if (result.error) {
    return (
      <ErrorState
        message={result.error}
        title={`${eyebrow} unavailable`}
      />
    );
  }

  if (!result.data) {
    return (
      <EmptyState
        description="This module has no shell metadata yet."
        title={`No ${eyebrow} data`}
      />
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <Button disabled variant="secondary">
            {result.data.primaryActionLabel}
          </Button>
        }
        eyebrow={eyebrow}
        title={result.data.moduleName}
      />

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Foundation</p>
            <h2>Module shell</h2>
          </div>
          <Badge tone="neutral">{result.data.records.length} items</Badge>
        </div>

        <DataTable
          ariaLabel={`${result.data.moduleName} shell`}
          columns={[
            {
              header: "Name",
              render: (record) => record.name
            },
            {
              header: "Owner",
              render: (record) => record.owner
            },
            {
              header: "Status",
              render: (record) => (
                <Badge tone={getStatusTone(record.status)}>{record.status}</Badge>
              )
            },
            {
              header: "Summary",
              render: (record) => record.summary
            }
          ]}
          emptyTitle={`No ${result.data.moduleName} items`}
          getRowKey={(record) => record.id}
          rows={result.data.records}
        />
      </section>
    </div>
  );
}
