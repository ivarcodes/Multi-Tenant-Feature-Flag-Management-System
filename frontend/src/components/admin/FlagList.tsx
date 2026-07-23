import type { FeatureFlag } from '../../types';

export function FlagList({ data, onToggle, onDelete }: {
  data: FeatureFlag[];
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  if (data.length === 0) return <p className="text-gray-500">No flags yet.</p>;
  return (
    <div className="bg-white rounded-lg shadow">
      {data.map((f) => (
        <div key={f._id} className="flex items-center justify-between p-4 border-b last:border-0">
          <span className="font-mono font-medium">{f.key}</span>
          <div className="flex items-center gap-4">
            <button onClick={() => onToggle(f._id, f.enabled)} className={`px-3 py-1 rounded text-sm ${f.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {f.enabled ? 'Enabled' : 'Disabled'}
            </button>
            <button onClick={() => onDelete(f._id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
