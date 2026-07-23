import type { Organization } from '../../types';

export function OrgList({ data }: { data: Organization[] }) {
  if (data.length === 0) return <p className="text-gray-500">No organizations yet.</p>;
  return (
    <div className="bg-white rounded-lg shadow">
      {data.map((o) => (
        <div key={o._id} className="flex justify-between p-4 border-b last:border-0">
          <span className="font-medium">{o.name}</span>
          <span className="text-sm text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}
