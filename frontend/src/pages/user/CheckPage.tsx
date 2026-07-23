import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/api';

export function CheckPage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<{ key: string; enabled: boolean; exists?: boolean } | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setErr('');
    setResult(null);
    try {
      const res = await api.checkFlag(key.trim());
      setResult(res.data);
    } catch {
      setErr('Flag not found or error checking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Check Feature Flag</h1>
          <button onClick={async () => { await logout(); navigate('/user/login'); }} className="px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition font-medium">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            placeholder="Flag key (e.g. dark-mode)" value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-mono focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            required
          />
          <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:brightness-110 disabled:opacity-50 transition transform hover:scale-[1.02] active:scale-[0.98]">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Checking...
              </span>
            ) : 'Check'}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        )}

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 text-center">
            {err}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <p className="font-mono text-xl font-bold text-gray-800 mb-4">{result.key}</p>
            <span className={`inline-block px-6 py-2.5 rounded-xl text-sm font-semibold tracking-wide ${result.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result.enabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
