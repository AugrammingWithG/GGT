"use client";

import KanbanBoard from "@/components/admin/KanbanBoard";

export default function EnquiriesPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h1 className="text-2xl font-semibold text-white">Enquiries</h1>
      <p className="mb-5 mt-1 text-sm text-muted-foreground">
        Drag a card between columns to update its status.
      </p>
      <KanbanBoard />
    </div>
  );
}
