import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear, MdTrendingUp } from "react-icons/md";
import { BsBarChart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders,adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

   const adminEarning = adminOrders && adminOrders.reduce((acc,item) => acc + item.totalPrice * .10, 0);


   const adminBalance = adminEarning?.toFixed(2);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  adminOrders &&
  adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + " $",
        status: item?.status,
        createdAt: item?.createdAt.slice(0,10),
      });
    });

    return (
      <>
        {adminOrderLoading ? (
          <Loader />
        ) : (
          <div className="w-full min-h-screen bg-gray-50">
            {/* Main Stats Section */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Revenue</p>
                      <h3 className="text-3xl font-bold mt-2">$ {adminBalance}</h3>
                    </div>
                    <div className="bg-blue-400/30 p-3 rounded-xl">
                      <MdTrendingUp size={24} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-blue-100">
                    <BsBarChart className="mr-2" />
                    <span className="text-sm">+12.5% from last month</span>
                  </div>
                </div>
  
                {/* Sellers Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Total Sellers</p>
                      <h3 className="text-3xl font-bold mt-2 text-gray-800">
                        {sellers && sellers.length}
                      </h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <MdBorderClear size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <Link to="/admin-sellers">
                    <button className="mt-4 w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-200">
                      View All Sellers
                    </button>
                  </Link>
                </div>
  
                {/* Orders Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500">Total Orders</p>
                      <h3 className="text-3xl font-bold mt-2 text-gray-800">
                        {adminOrders && adminOrders.length}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl">
                      <AiOutlineMoneyCollect size={24} className="text-green-600" />
                    </div>
                  </div>
                  <Link to="/admin-orders">
                    <button className="mt-4 w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-200">
                      View All Orders
                    </button>
                  </Link>
                </div>
              </div>
            </div>
  
            {/* Orders Table Section */}
            <div className="p-8 pt-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Latest Orders</h3>
                    <Link to="/admin-orders">
                      <button className="flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium">
                        View All
                        <AiOutlineArrowRight className="ml-2" />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={4}
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
                      '& .greenColor': {
                        color: '#059669',
                        fontWeight: '600',
                      },
                      '& .redColor': {
                        color: '#DC2626',
                        fontWeight: '600',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
};

export default AdminDashboardMain;
