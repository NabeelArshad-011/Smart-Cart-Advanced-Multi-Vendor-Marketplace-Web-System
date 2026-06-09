import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineCalendar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    axios.get(`${server}/event/admin-all-events`, {withCredentials: true}).then((res) =>{
      setEvents(res.data.events);
    });
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
          <Link to={`/product/${params.id}?isEvent=true`}>
            <button className="flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
              <AiOutlineEye size={20} />
            </button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
      });
    });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <AiOutlineCalendar size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Events</h2>
            <p className="text-gray-500 mt-1">Manage your special events and offers</p>
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

export default AllEvents;