import { useState } from 'react';

export function SignupForm({ onSubmit, extra }: {
  onSubmit: (email: string, password: string, orgId: string) => Promise<void>;
  extra?: React.ReactNode;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    try { await onSubmit(email, password, orgId); } catch { setErr(true); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handle} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Signup</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded mb-4" required />
        <input placeholder="Organization ID" value={orgId} onChange={(e) => setOrgId(e.target.value)} className="w-full p-3 border rounded mb-4" required />
        {err && <p className="text-red-500 text-sm mb-4">Signup failed</p>}
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:opacity-50">
          {loading ? '...' : 'Sign Up'}
        </button>
        {extra}
      </form>
    </div>
  );
}
