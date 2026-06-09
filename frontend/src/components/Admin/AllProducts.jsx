import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${server}/product/admin-all-products`, {withCredentials: true}).then((res) => {
        setData(res.data.products);
    })
  }, []);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.id}`}>
            <button className="flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
              <AiOutlineEye size={20} />
            </button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-xl mr-4">
            <AiOutlineShoppingCart size={24} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-gray-500 mt-1">Manage your product inventory</p>
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
    </div>
  );
};

export default AllProducts;