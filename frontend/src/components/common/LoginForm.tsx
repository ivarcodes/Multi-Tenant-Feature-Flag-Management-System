import { useState } from 'react';

export function LoginForm({ title, gradient = 'from-indigo-600 to-purple-600', submitLabel, initialEmail, extra, onSubmit }: {
  title: string;
  gradient?: string;
  submitLabel?: string;
  initialEmail?: string;
  extra?: React.ReactNode;
  onSubmit: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try { await onSubmit(email, password); } catch { setErr('Invalid credentials'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <form onSubmit={handle} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-indigo-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{title}</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" required />
          </div>

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {err}
            </div>
          )}

          <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl bg-linear-to-r ${gradient} text-white font-semibold hover:brightness-110 disabled:opacity-50 transition transform hover:scale-[1.02] active:scale-[0.98]`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Signing in...
              </span>
            ) : submitLabel || 'Sign In'}
          </button>
        </div>

        {extra}
      </form>
    </div>
  );
}
