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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Organizations</h1>
          <button onClick={async () => { await logout(); navigate('/super-admin/login'); }} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
        </div>
        <OrgForm onCreate={async (name) => { await api.createOrganization({ name }); await load(page); }} />
        {loading ? <p className="text-gray-500">Loading...</p> : <OrgList data={data} />}
        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>
    </div>
  );
}
