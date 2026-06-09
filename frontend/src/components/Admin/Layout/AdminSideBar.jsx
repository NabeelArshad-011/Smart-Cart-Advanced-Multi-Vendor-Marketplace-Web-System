import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import { MdReportProblem } from "react-icons/md";

const AdminSideBar = ({ active }) => {
  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: RxDashboard,
      label: "Dashboard",
      id: 1,
    },
    {
      path: "/admin-orders",
      icon: FiShoppingBag,
      label: "All Orders",
      id: 2,
    },
    {
      path: "/admin-sellers",
      icon: HiOutlineUserGroup,
      label: "All Sellers",
      id: 3,
    },
    {
      path: "/admin-users",
      icon: HiOutlineUserGroup,
      label: "All Users",
      id: 4,
    },
    {
      path: "/admin-products",
      icon: BsHandbag,
      label: "All Products",
      id: 5,
    },
    {
      path: "/admin-events",
      icon: MdOutlineLocalOffer,
      label: "All Events",
      id: 6,
    },
    {
      path: "/admin-withdraw-request",
      icon: CiMoneyBill,
      label: "Withdraw Request",
      id: 7,
    },
    {
      path: "/admin-complaints",
      icon: MdReportProblem,
      label: "Complaints",
      id: 8,
    }
  ];

  return (
    <div className="w-full h-[90vh] bg-gray-900 shadow-xl  overflow-y-auto sticky top-0 left-0 z-10 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
      <div className="p-6 space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`w-full flex items-center p-4 rounded-lg transition-all duration-300 group ${
              active === item.id
                ? "bg-cyan-500/10 text-cyan-400"
                : "hover:bg-gray-800/80 text-gray-400 hover:text-gray-200"
            }`}
          >
            <item.icon
              size={20}
              className={`transition-transform duration-300 group-hover:scale-110 ${
                active === item.id ? "text-cyan-400" : "text-gray-400 group-hover:text-gray-200"
              }`}
            />
            <span
              className={`hidden 800px:block pl-4 text-sm font-medium tracking-wide ${
                active === item.id ? "text-cyan-400" : "text-gray-400 group-hover:text-gray-200"
              }`}
            >
              {item.label}
            </span>
            {active === item.id && (
              <div className="ml-auto w-1 h-8 bg-cyan-400 rounded-full animate-pulse" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminSideBar;