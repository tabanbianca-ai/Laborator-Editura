import { LoadingState } from "../../components/ui";

export default function EditorLoading() {
  return (
    <section className="content-panel">
      <LoadingState label="Loading editor" />
    </section>
  );
}
