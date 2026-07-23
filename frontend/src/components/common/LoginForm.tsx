import { useState } from 'react';

export function LoginForm({ title, submitLabel, initialEmail, extra, onSubmit }: {
  title: string;
  submitLabel?: string;
  initialEmail?: string;
  extra?: React.ReactNode;
  onSubmit: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    try { await onSubmit(email, password); } catch { setErr(true); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handle} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded mb-4" required />
        {err && <p className="text-red-500 text-sm mb-4">Invalid credentials</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? '...' : submitLabel || 'Login'}
        </button>
        {extra}
      </form>
    </div>
  );
}
