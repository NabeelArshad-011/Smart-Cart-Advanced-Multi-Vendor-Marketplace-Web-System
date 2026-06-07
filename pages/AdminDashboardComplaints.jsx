import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { server } from "../server";

const AdminDashboardComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolutionNote, setResolutionNote] = useState("");
  const [activeComplaintId, setActiveComplaintId] = useState(null);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${server}/complaint/admin-all`, { withCredentials: true });
        setComplaints(data.complaints || []);
      } catch (error) {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const resolveComplaint = async (complaintId) => {
    try {
      await axios.patch(
        `${server}/complaint/resolve/${complaintId}`,
        { status: "resolved", resolutionNote },
        { withCredentials: true }
      );
      setResolutionNote("");
      setActiveComplaintId(null);
      const { data } = await axios.get(`${server}/complaint/admin-all`, { withCredentials: true });
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={8} />
          </div>
          <div className="w-full min-h-screen bg-slate-50 p-6 800px:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Complaints and Disputes</h1>
              <p className="mt-2 text-slate-600">Monitor escalations, resolve issues, and keep moderation transparent.</p>
            </div>

            {loading ? (
              <div className="rounded-2xl bg-white p-8 shadow-sm text-slate-600">Loading complaints...</div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint._id} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold text-slate-900">{complaint.title}</h2>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">{complaint.status}</span>
                        </div>
                        <p className="mt-2 text-slate-600">{complaint.description}</p>
                        <p className="mt-2 text-sm text-slate-500">Category: {complaint.category || "general"} | Severity: {complaint.severity || "medium"}</p>
                        <p className="mt-1 text-sm text-slate-500">Order: {complaint.orderId || "n/a"} | Shop: {complaint.shopId || "n/a"}</p>
                      </div>
                      {complaint.status !== "resolved" && (
                        <div className="min-w-[280px] space-y-3">
                          {activeComplaintId === complaint._id && (
                            <textarea
                              value={resolutionNote}
                              onChange={(event) => setResolutionNote(event.target.value)}
                              placeholder="Enter resolution note"
                              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-slate-400"
                              rows={3}
                            />
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setActiveComplaintId(complaint._id)}
                              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                            >
                              Add Resolution
                            </button>
                            {activeComplaintId === complaint._id && (
                              <button
                                onClick={() => resolveComplaint(complaint._id)}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {complaints.length === 0 && (
                  <div className="rounded-2xl bg-white p-8 shadow-sm text-slate-500">No complaints logged yet.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardComplaints;