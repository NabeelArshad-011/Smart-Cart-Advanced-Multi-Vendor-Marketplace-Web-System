import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import { server } from "../../server";

const StatCard = ({ label, value, tone }) => (
  <div className={`rounded-2xl p-5 shadow-sm border ${tone} bg-white`}>
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
  </div>
);

const ShopAnalyticsPage = () => {
  const { seller } = useSelector((state) => state.seller);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!seller?._id) {
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(`${server}/assistant/seller-analytics/${seller._id}`);
        setAnalytics(data.analytics);
      } catch (error) {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [seller?._id]);

  const totals = analytics?.totals || {};

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={12} />
        </div>
        <div className="w-full p-6 800px:p-10 bg-slate-50 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Seller Analytics</h1>
            <p className="mt-2 text-slate-600">Revenue, conversion, stock risk, and product performance in one view.</p>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-8 shadow-sm text-slate-600">Loading analytics...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Conversion Rate" value={`${Number(analytics?.metrics?.conversionRate || 0).toFixed(1)}%`} tone="border-blue-100" />
                <StatCard label="Net Revenue" value={`$${Number(totals.netRevenue || 0).toFixed(2)}`} tone="border-emerald-100" />
                <StatCard label="Low Stock Alerts" value={totals.lowStock || 0} tone="border-amber-100" />
                <StatCard label="Customer Reviews" value={totals.reviews || 0} tone="border-violet-100" />
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Top Products</h2>
                  <div className="mt-4 space-y-3">
                    {(analytics?.topProducts || []).map((product) => (
                      <div key={product.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">Sold out: {product.soldOut} | Stock: {product.stock}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{Number(product.rating || 0).toFixed(1)} rating</span>
                      </div>
                    ))}
                    {(analytics?.topProducts || []).length === 0 && <p className="text-slate-500">No product activity yet.</p>}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Low Stock Alerts</h2>
                  <div className="mt-4 space-y-3">
                    {(analytics?.lowStockProducts || []).map((product) => (
                      <div key={product.id} className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-600">Category: {product.category}</p>
                        </div>
                        <span className="rounded-full bg-amber-200 px-3 py-1 text-sm font-medium text-amber-900">{product.stock} left</span>
                      </div>
                    ))}
                    {(analytics?.lowStockProducts || []).length === 0 && <p className="text-slate-500">No low-stock products right now.</p>}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Revenue Trend</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {(analytics?.revenueTrend || []).map((item) => (
                    <div key={item.month} className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.month}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">${Number(item.revenue || 0).toFixed(2)}</p>
                    </div>
                  ))}
                  {(analytics?.revenueTrend || []).length === 0 && <p className="text-slate-500">No delivered orders yet.</p>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopAnalyticsPage;