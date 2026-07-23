import { useState } from 'react';

export function OrgForm({ onCreate }: { onCreate: (name: string) => Promise<void> }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try { await onCreate(name.trim()); setName(''); } catch { } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handle} className="flex gap-3 mb-8">
      <input placeholder="Organization name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 p-3 border rounded" required />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? '...' : 'Create'}
      </button>
    </form>
  );
}
