import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { categoriesData } from "../../static/data";
import {
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { IoChevronDownOutline } from "react-icons/io5";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      {/* Top Bar */}
      <div className="w-full bg-black text-white py-3">
        <div className="w-[95%] max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="logo"
              className="h-8 brightness-0 invert"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-11 px-4 pr-12 rounded-lg bg-gray-900 border border-gray-800 focus:border-white focus:outline-none text-white placeholder-gray-500"
              />
              <button className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-white">
                <HiOutlineSearch size={20} />
              </button>
              
              {/* Search Results Dropdown */}
              {searchData && searchData.length !== 0 && (
                <div className="absolute w-full mt-2 bg-gray-900 rounded-lg shadow-lg border border-gray-800 py-2 z-50">
                  {searchData.map((item) => (
                    <Link 
                      to={`/product/${item._id}`} 
                      key={item._id}
                      className="flex items-center px-4 py-2 hover:bg-gray-800"
                    >
                      <img 
                        src={item.images[0]?.url} 
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="ml-3 text-gray-300">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link 
                to={`${isSeller ? "/dashboard" : "/shop-create"}`}
                className="text-gray-300 hover:text-white font-medium"
              >
                {isSeller ? "Dashboard" : "Become Seller"}
              </Link>

              <button 
                onClick={() => setOpenWishlist(true)}
                className="relative p-2 text-gray-300 hover:text-white"
              >
                <HiOutlineHeart size={24} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setOpenCart(true)}
                className="relative p-2 text-gray-300 hover:text-white"
              >
                <HiOutlineShoppingBag size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-medium">
                    {cart.length}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border border-gray-800"
                  />
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="text-gray-300 hover:text-white"
                >
                  <CgProfile size={24} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              <HiOutlineMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation - Desktop */}
      <div className={`w-full bg-gray-900 ${active ? 'fixed top-0 left-0 z-20 animate-slideDown' : ''}`}>
        <div className="w-[95%] max-w-[1400px] mx-auto h-14 flex items-center justify-between">
          {/* Categories Dropdown */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setDropDown(!dropDown)}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white"
            >
              <HiOutlineMenu size={20} />
              <span>Categories</span>
              <IoChevronDownOutline size={16} />
            </button>
            {dropDown && (
              <div className="absolute top-full left-0 mt-1">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:block ">
            <Navbar active={activeHeading} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 w-[80%] h-full bg-gray-900">
            <div className="p-4 border-b border-gray-800">
              <button 
                onClick={() => setOpen(false)}
                className="p-2 text-gray-300 hover:text-white"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-11 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-white focus:outline-none"
              />
            </div>

            {/* Mobile Navigation */}
            <div className="p-4">
              <Navbar active={activeHeading} />
            </div>

            {/* Mobile Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <img
                    src={user?.avatar?.url}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                  />
                  <div>
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/login"
                    className="flex-1 px-4 py-2 text-center bg-white text-black rounded-lg hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="flex-1 px-4 py-2 text-center border border-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {openCart && <Cart setOpenCart={setOpenCart} />}

      {/* Wishlist Sidebar */}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;