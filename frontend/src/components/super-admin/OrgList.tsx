import type { Organization } from '../../types';

export function OrgList({ data }: { data: Organization[] }) {
  if (data.length === 0) return (
    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
      <p className="text-gray-400 text-lg font-medium">No organizations yet</p>
      <p className="text-gray-400 text-sm mt-1">Create your first organization above</p>
    </div>
  );
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {data.map((o, i) => (
        <div key={o._id} className={`flex items-center justify-between p-5 ${i < data.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {o.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{o.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">ID: {o._id}</p>
            </div>
          </div>
          <span className="text-sm text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}
