import React, { useState, useEffect } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";


const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  // Initialize form fields when user data is loaded
  useEffect(() => {
    if (user?._id) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setPhoneNumber(user?.phoneNumber || "");
    }
  }, [user?._id]); // Only run when user ID changes (i.e., on login/logout)

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then(() => {
            dispatch(loadUser());
            toast.success("Profile picture updated!");
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || "Update failed");
          });
      }
    };
    reader.readAsDataURL(file);
  };

  const ProfileForm = () => (
    <div className="bg-gray-900 rounded-xl shadow-lg p-8">
      {/* Profile Picture */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img
            src={user?.avatar?.url}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-yellow-500"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <AiOutlineCamera className="text-gray-300 hover:text-yellow-500" size={20} />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              onChange={handleImage}
              accept="image/*"
            />
          </label>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password to Confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full max-w-[200px] py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );

  // Main content renderer based on active tab
  const renderContent = () => {
    switch (active) {
      case 1:
        return <ProfileForm />;
      case 2:
        return <AllOrders />;
      case 3:
        return <AllRefundOrders />;
      case 5:
        return <TrackOrder />;
      case 6:
        return <ChangePassword />;
      case 7:
        return <Address />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 p-6">
      {renderContent()}
    </div>
  );
};


// Orders Components
const OrdersGrid = ({ title, rows, columns }) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          className="text-white"
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
              backgroundColor: '#1F2937'
            },
            '& .MuiDataGrid-cell': {
              borderColor: '#374151'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#111827',
              color: '#FFFFFF'  ,
              borderBottom: '1px solid #374151'
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#111827',
              borderTop: '1px solid #374151'
            },
            '& .status-delivered': {
              color: '#10B981'
            },
            '& .status-processing': {
              color: '#F59E0B'
            }
          }}
        />
      </div>
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [user?._id, dispatch]);

  const columns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 150, 
      flex: 0.7,
      renderCell: (params) => (
        <span className="text-white">{params.value}</span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${params.value === "Delivered" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {params.value}
        </span>
      )
    },
    {
      field: "itemsQty",
      headerName: "Items",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span className="text-gray-300">{params.value}</span>
      )
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <span className="text-white font-medium">{params.value}</span>
      )
    },
    {
      field: "action",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200">
            <AiOutlineArrowRight size={20} />
          </button>
        </Link>
      )
    }
  ];

  const rows = orders?.map((order) => ({
    id: order._id,
    itemsQty: order.cart.length,
    total: `US$ ${order.totalPrice}`,
    status: order.status
  })) || [];

  return <OrdersGrid title="All Orders" rows={rows} columns={columns} />;
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [user?._id, dispatch]);

  const columns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 150, 
      flex: 0.7,
      renderCell: (params) => (
        <span className="text-gray-300">{params.value}</span>
      )
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
          {params.value}
        </span>
      )
    },
    {
      field: "itemsQty",
      headerName: "Items",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span className="text-gray-300">{params.value}</span>
      )
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <span className="text-yellow-500 font-medium">{params.value}</span>
      )
    },
    {
      field: "action",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200">
            <AiOutlineArrowRight size={20} />
          </button>
        </Link>
      )
    }
  ];

  const refundOrders = orders?.filter(order => order.status === "Processing refund");
  const rows = refundOrders?.map((order) => ({
    id: order._id,
    itemsQty: order.cart.length,
    total: `US$ ${order.totalPrice}`,
    status: order.status
  })) || [];

  return <OrdersGrid title="Refund Orders" rows={rows} columns={columns} />;
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [user?._id, dispatch]);

  const columns = [
    { 
      field: "id", 
      headerName: "Order ID", 
      minWidth: 150, 
      flex: 0.7 
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${params.value === "Delivered" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {params.value}
        </span>
      )
    },
    {
      field: "itemsQty",
      headerName: "Items",
      minWidth: 130,
      flex: 0.7
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <span className="text-yellow-500 font-medium">{params.value}</span>
      )
    },
    {
      field: "action",
      headerName: "",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200">
            <MdTrackChanges size={20} />
          </button>
        </Link>
      )
    }
  ];

  const rows = orders?.map((order) => ({
    id: order._id,
    itemsQty: order.cart.length,
    total: `US$ ${order.totalPrice}`,
    status: order.status
  })) || [];

  return <OrdersGrid title="Track Orders" rows={rows} columns={columns} />;
};

// Address Component
const Address = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    zipCode: "",
    address1: "",
    address2: "",
    addressType: ""
  });
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = ["Default", "Home", "Office"];

  const handleSubmit = (e) => {
    e.preventDefault();
    const { country, city, address1, address2, zipCode, addressType } = formData;

    if (!addressType || !country || !city) {
      toast.error("Please fill all required fields!");
      return;
    }

    dispatch(updatUserAddress(country, city, address1, address2, zipCode, addressType));
    setOpen(false);
    setFormData({
      country: "",
      city: "",
      zipCode: "",
      address1: "",
      address2: "",
      addressType: ""
    });
  };

  const handleAddressFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const AddressModal = () => (
    <div className="fixed inset-0 z-50 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Add New Address</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <RxCross1 size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Country Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleAddressFieldChange('country', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleAddressFieldChange('city', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select City</option>
              {State.getStatesOfCountry(formData.country).map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address Fields */}
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.address1}
                onChange={(e) => handleAddressFieldChange('address1', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.address2}
                onChange={(e) => handleAddressFieldChange('address2', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleAddressFieldChange('zipCode', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address Type
            </label>
            <select
              value={formData.addressType}
              onChange={(e) => handleAddressFieldChange('addressType', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select Type</option>
              {addressTypeData.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Add Address
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">My Addresses</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Add New
        </button>
      </div>

      {/* Addresses List */}
      <div className="space-y-4">
        {user?.addresses?.map((address, index) => (
          <div 
            key={index}
            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs font-medium text-white">
                  {address.addressType}
                </span>
              </div>
              <p className="text-gray-300">{address.address1}</p>
              {address.address2 && (
                <p className="text-gray-400">{address.address2}</p>
              )}
              <p className="text-gray-400">
                {address.city}, {address.country} {address.zipCode}
              </p>
            </div>
            <button
              onClick={() => dispatch(deleteUserAddress(address._id))}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <AiOutlineDelete size={20} />
            </button>
          </div>
        ))}

        {(!user?.addresses || user.addresses.length === 0) && (
          <div className="text-center py-8 text-gray-400">
            No saved addresses
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {open && <AddressModal />}
    </div>
  );
};

// Password Change Component
const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${server}/user/update-user-password`,
        passwordData,
        { withCredentials: true }
      );
      toast.success(res.data.success);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) => setPasswordData({
              ...passwordData,
              oldPassword: e.target.value
            })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({
              ...passwordData,
              newPassword: e.target.value
            })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value
            })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ProfileContent;