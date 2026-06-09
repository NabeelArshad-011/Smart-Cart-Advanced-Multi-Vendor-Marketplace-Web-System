import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlinePassword,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.user);
 
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, { withCredentials: true });
      toast.success(res.data.message);
      navigate("/login");
      window.location.reload(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };
 
  const menuItems = [
    { id: 1, icon: RxPerson, label: "Profile" },
    { id: 2, icon: HiOutlineShoppingBag, label: "Orders" },
    { id: 3, icon: HiOutlineReceiptRefund, label: "Refunds" },
    { id: 4, icon: AiOutlineMessage, label: "Inbox", onClick: () => navigate("/inbox") },
    { id: 5, icon: MdOutlineTrackChanges, label: "Track Order" },
    { id: 6, icon: RiLockPasswordLine, label: "Change Password" },
    { id: 7, icon: TbAddressBook, label: "Address" }
  ];
 
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 h-fit">
      {/* Menu Items */}
      <div className="space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActive(item.id);
              item.onClick?.();
            }}
            className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 
              ${active === item.id 
                ? 'bg-yellow-500/10 text-yellow-500' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
          >
            <item.icon size={20} />
            <span className="ml-3 hidden 800px:block font-medium">
              {item.label}
            </span>
          </button>
        ))}
 
        {/* Admin Dashboard */}
        {user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <button 
              className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors duration-200"
            >
              <MdOutlineAdminPanelSettings size={20} />
              <span className="ml-3 hidden 800px:block font-medium">
                Admin Dashboard
              </span>
            </button>
          </Link>
        )}
 
        {/* Logout Button */}
        <button
          onClick={logoutHandler}
          className="w-full flex items-center p-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors duration-200"
        >
          <AiOutlineLogin size={20} />
          <span className="ml-3 hidden 800px:block font-medium">
            Log out
          </span>
        </button>
      </div>
    </div>
  );
 };
 
 export default ProfileSidebar;