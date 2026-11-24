import { Suspense } from "react";
import EditRecord from "@/components/EditRecord";

/** F-12 記録の編集 /history/[date] */
export default function EditRecordPage({ params }: PageProps<"/history/[date]">) {
  return (
    <Suspense fallback={<h1 className="text-xl font-bold">記録の編集</h1>}>
      <EditRecord params={params} />
    </Suspense>
  );
}
