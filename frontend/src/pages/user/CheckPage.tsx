import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/api';

export function CheckPage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [result, setResult] = useState<{ key: string; enabled: boolean } | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setErr(false);
    setResult(null);
    try {
      const res = await api.checkFlag(key.trim());
      setResult(res.data);
    } catch { setErr(true); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Check Feature Flag</h1>
          <button onClick={async () => { await logout(); navigate('/user/login'); }} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input placeholder="Flag key (e.g. dark-mode)" value={key} onChange={(e) => setKey(e.target.value)} className="flex-1 p-3 border rounded font-mono" required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50">Check</button>
        </form>
        {loading && <p className="text-gray-500">Loading...</p>}
        {err && <p className="text-red-500">Flag not found or error checking.</p>}
        {result && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="font-mono text-lg mb-2">{result.key}</p>
            <span className={`inline-block px-4 py-2 rounded text-sm font-medium ${result.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result.enabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
