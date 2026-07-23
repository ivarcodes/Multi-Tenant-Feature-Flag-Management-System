import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/api';
import { OrgForm } from '../../components/super-admin/OrgForm';
import { OrgList } from '../../components/super-admin/OrgList';
import { Pagination } from '../../components/common/Pagination';
import type { Organization } from '../../types';

export function OrganizationsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Organization[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await api.getOrganizations({ page: p, limit: 10 });
      setData(res.data);
      setPages(res.pagination.pages);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Organizations</h1>
          <button onClick={async () => { await logout(); navigate('/super-admin/login'); }} className="px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition font-medium">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <OrgForm onCreate={async (name) => { await api.createOrganization({ name }); await load(page); }} />

        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="animate-spin h-10 w-10 text-purple-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          </div>
        ) : (
          <>
            <OrgList data={data} />
            <Pagination page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </main>
    </div>
  );
}
