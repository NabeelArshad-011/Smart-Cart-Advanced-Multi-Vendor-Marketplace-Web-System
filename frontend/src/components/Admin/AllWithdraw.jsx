import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil, BsCashCoin } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState('Processing');

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Withdraw ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "shopId",
      headerName: "Shop ID",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => (
        <div className="font-medium text-gray-900">{params.value}</div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${params.value === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Request Date",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "",
      type: "number",
      minWidth: 100,
      flex: 0.4,
      renderCell: (params) => {
        return (
          <button
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
            className={`${params.row.status !== "Processing" ? 'hidden' : ''} 
              p-2 text-blue-600 hover:text-blue-700 transition-colors duration-200`}
          >
            <BsPencil size={20} />
          </button>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        { sellerId: withdrawData.shopId },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      });
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "US$ " + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="bg-orange-100 p-3 rounded-xl mr-4">
            <BsCashCoin size={24} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Withdrawals</h2>
            <p className="text-gray-500 mt-1">Manage withdrawal requests from sellers</p>
          </div>
        </div>
      </div>

      {/* DataGrid Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            className="border-0"
            sx={{
              '& .MuiDataGrid-cell': {
                borderColor: '#F3F4F6',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#F9FAFB',
                color: '#4B5563',
                fontWeight: '600',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#F9FAFB',
                borderTop: '1px solid #F3F4F6',
              },
            }}
          />
        </div>
      </div>

      {/* Update Status Modal */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative z-50">
              <div className="flex justify-end">
                <button 
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <RxCross1 size={20} />
                </button>
              </div>
              <div className="text-center mt-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Update Withdrawal Status
                </h3>
                <select
                  onChange={(e) => setWithdrawStatus(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={withdrawStatus}>{withdrawData.status}</option>
                  <option value={withdrawStatus}>Succeed</option>
                </select>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;