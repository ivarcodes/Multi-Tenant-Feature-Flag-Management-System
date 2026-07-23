export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="px-4 py-2 border rounded disabled:opacity-30">Previous</button>
      <span className="px-4 py-2 text-sm">Page {page} of {pages}</span>
      <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="px-4 py-2 border rounded disabled:opacity-30">Next</button>
    </div>
  );
}
