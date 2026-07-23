import { useState } from 'react';

export function FlagForm({ onCreate }: { onCreate: (key: string) => Promise<void> }) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    try { await onCreate(key.trim()); setKey(''); } catch { } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handle} className="flex gap-3 mb-8">
      <input placeholder="Feature key (e.g. dark-mode)" value={key} onChange={(e) => setKey(e.target.value)} className="flex-1 p-3 border rounded font-mono" required />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? '...' : 'Create'}
      </button>
    </form>
  );
}
