import React from 'react';
import { HiOutlineHome, HiOutlineShoppingBag, HiOutlineUsers } from 'react-icons/hi';
import { BsBox, BsGrid } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-gray-900 sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      {/* Logo */}
      <div>
        <Link to="/">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt=""
            className="h-8"
          />
        </Link>
      </div>

      {/* Navigation and Profile */}
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          {/* Dashboard */}
          <Link to="/admin/dashboard" className="800px:block hidden">
            <div className="mx-4 cursor-pointer group">
              <div className="flex flex-col items-center">
                <HiOutlineHome 
                  size={24} 
                  className="text-gray-300 group-hover:text-cyan-400 transition-colors" 
                />
                <span className="text-xs text-gray-400 group-hover:text-cyan-400 mt-1">Dashboard</span>
              </div>
            </div>
          </Link>

          {/* Orders */}
          <Link to="/admin-orders" className="800px:block hidden">
            <div className="mx-4 cursor-pointer group">
              <div className="flex flex-col items-center">
                <HiOutlineShoppingBag 
                  size={24} 
                  className="text-gray-300 group-hover:text-cyan-400 transition-colors" 
                />
                <span className="text-xs text-gray-400 group-hover:text-cyan-400 mt-1">Orders</span>
              </div>
            </div>
          </Link>

          {/* Sellers */}
          <Link to="/admin-sellers" className="800px:block hidden">
            <div className="mx-4 cursor-pointer group">
              <div className="flex flex-col items-center">
                <BsGrid 
                  size={22} 
                  className="text-gray-300 group-hover:text-cyan-400 transition-colors" 
                />
                <span className="text-xs text-gray-400 group-hover:text-cyan-400 mt-1">Sellers</span>
              </div>
            </div>
          </Link>

          {/* Users */}
          <Link to="/admin-users" className="800px:block hidden">
            <div className="mx-4 cursor-pointer group">
              <div className="flex flex-col items-center">
                <HiOutlineUsers 
                  size={24} 
                  className="text-gray-300 group-hover:text-cyan-400 transition-colors" 
                />
                <span className="text-xs text-gray-400 group-hover:text-cyan-400 mt-1">Users</span>
              </div>
            </div>
          </Link>

          {/* Products */}
          <Link to="/admin-products" className="800px:block hidden">
            <div className="mx-4 cursor-pointer group">
              <div className="flex flex-col items-center">
                <BsBox 
                  size={22} 
                  className="text-gray-300 group-hover:text-cyan-400 transition-colors" 
                />
                <span className="text-xs text-gray-400 group-hover:text-cyan-400 mt-1">Products</span>
              </div>
            </div>
          </Link>

          {/* Profile Picture */}
          <div className="relative ml-4">
            <div className="p-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500">
              <img
                src={user?.avatar?.url}
                alt=""
                className="w-[45px] h-[45px] rounded-full object-cover border-2 border-gray-900"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;