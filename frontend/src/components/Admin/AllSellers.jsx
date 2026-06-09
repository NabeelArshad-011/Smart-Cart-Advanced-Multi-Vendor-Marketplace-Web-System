import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye, AiOutlineShop } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });
    dispatch(getAllSellers());
  };

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "preview",
      flex: 0.5,
      minWidth: 80,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/shop/preview/${params.id}`}>
            <button className="flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
              <AiOutlineEye size={20} />
            </button>
          </Link>
        );
      },
    },
    {
      field: "delete",
      flex: 0.5,
      minWidth: 80,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <button 
            onClick={() => setUserId(params.id) || setOpen(true)}
            className="flex items-center justify-center p-2 text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            <AiOutlineDelete size={20} />
          </button>
        );
      },
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt.slice(0, 10),
        address: item.address,
      });
    });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-xl mr-4">
            <AiOutlineShop size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sellers</h2>
            <p className="text-gray-500 mt-1">Manage your platform sellers</p>
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

      {/* Delete Confirmation Modal */}
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete this seller? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setOpen(false) || handleDelete(userId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
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

export default AllSellers;