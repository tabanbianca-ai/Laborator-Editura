import { LoadingState } from "../../components/ui";

export default function DocumentsLoading() {
  return (
    <section className="content-panel">
      <LoadingState label="Loading documents" />
    </section>
  );
}
