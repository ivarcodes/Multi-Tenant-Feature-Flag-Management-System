import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/api';
import { FlagForm } from '../../components/admin/FlagForm';
import { FlagList } from '../../components/admin/FlagList';
import { Pagination } from '../../components/common/Pagination';
import type { FeatureFlag } from '../../types';

export function DashboardPage() {
  const [page, setPage] = useState(1);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await api.getFlags({ page: p, limit: 10 });
      setFlags(res.data);
      setPages(res.pagination.pages);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Feature Flags</h1>
          <button onClick={async () => { await logout(); navigate('/admin/login'); }} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
        </div>
        <FlagForm onCreate={async (key) => { await api.createFlag({ key }); await load(page); }} />
        {loading ? <p className="text-gray-500">Loading...</p> : <FlagList data={flags} onToggle={(id, cur) => api.updateFlag(id, { enabled: !cur }).then(() => load(page))} onDelete={(id) => { if (confirm('Delete this flag?')) api.deleteFlag(id).then(() => load(page)); }} />}
        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>
    </div>
  );
}
