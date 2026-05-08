import { Suspense } from "react";
import PreviewPageClient from "./preview-page-client";

export default function PreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewPageClient />
    </Suspense>
  );
}
