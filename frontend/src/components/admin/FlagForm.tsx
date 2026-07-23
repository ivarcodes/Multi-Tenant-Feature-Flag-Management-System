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
      <input
        placeholder="Feature key (e.g. dark-mode)" value={key}
        onChange={(e) => setKey(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
        required
      />
      <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:brightness-110 disabled:opacity-50 transition transform hover:scale-[1.02] active:scale-[0.98]">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Creating...
          </span>
        ) : 'Create'}
      </button>
    </form>
  );
}
