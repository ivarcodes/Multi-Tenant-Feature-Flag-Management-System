import type { FeatureFlag } from '../../types';

export function FlagList({ data, onToggle, onDelete }: {
  data: FeatureFlag[];
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  if (data.length === 0) return (
    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
      <p className="text-gray-400 text-lg font-medium">No flags yet</p>
      <p className="text-gray-400 text-sm mt-1">Create your first feature flag above</p>
    </div>
  );
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {data.map((f, i) => (
        <div key={f._id} className={`flex items-center justify-between p-5 ${i < data.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition`}>
          <div>
            <span className="font-mono font-semibold text-gray-800">{f.key}</span>
            <p className="text-xs text-gray-400 mt-0.5">ID: {f._id}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onToggle(f._id, f.enabled)} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${f.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {f.enabled ? 'Enabled' : 'Disabled'}
            </button>
            <button onClick={() => onDelete(f._id)} className="px-3 py-1.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition font-medium">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
