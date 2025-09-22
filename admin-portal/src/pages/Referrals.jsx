import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import api from '../services/api';

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Expired', value: 'expired' },
];

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));

      const { data } = await api.get(`/admin/referrals?${params.toString()}`);
      setReferrals(data.data.referrals || []);
      setTotal(data.data.total || 0);
    } catch (e) {
      // console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, pageSize]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <button
          onClick={fetchReferrals}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
        >
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg px-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (setPage(1), fetchReferrals())}
              placeholder="Search by code or email"
              className="w-full px-3 py-2 outline-none"
            />
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg px-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value); }}
              className="w-full px-3 py-2 outline-none bg-transparent"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg px-3">
            <span className="text-gray-500 mr-2">Page size</span>
            <select
              value={pageSize}
              onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
              className="px-2 py-2 outline-none bg-transparent"
            >
              {[10, 20, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => { setPage(1); fetchReferrals(); }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >Apply</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">Loading...</td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">No referrals found</td>
                </tr>
              ) : (
                referrals.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-mono text-sm">{r.referralCode}</td>
                    <td className="px-4 py-3 text-sm">{r.referrerName || r.referrerEmail || '-'}</td>
                    <td className="px-4 py-3 text-sm">{r.referredEmail || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'completed' ? 'bg-green-100 text-green-700' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">₹{r.discountAmount || 0}</td>
                    <td className="px-4 py-3 text-sm">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 text-sm">{r.usedAt ? new Date(r.usedAt).toLocaleString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">Page {page} of {totalPages} • {total} total</div>
            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
              >Prev</button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
