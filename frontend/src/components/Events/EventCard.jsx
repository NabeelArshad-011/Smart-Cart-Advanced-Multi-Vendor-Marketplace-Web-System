import React from "react";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { HiOutlineShoppingBag, HiOutlineEye, HiOutlineFire } from "react-icons/hi";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
 
  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  }
 
  return (
    <div className={`bg-gray-900 rounded-2xl shadow-lg border border-gray-800 ${active ? "mb-0" : "mb-12"}`}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Image */}
        <div className="relative h-[400px] lg:h-full p-8 bg-gray-800 rounded-l-2xl">
          <div className="absolute top-6 left-6 bg-yellow-500 text-black px-4 py-2 rounded-full font-medium flex items-center shadow-lg">
            <HiOutlineFire className="mr-2" />
            Flash Sale
          </div>
          <img 
            src={data.images[0]?.url} 
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </div>
 
        {/* Right Side - Content */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            {/* Timer Section */}
            <div className="mb-8">
              <div className="text-gray-400 uppercase tracking-wider text-sm mb-2">
                Sale Ends In
              </div>
              <CountDown data={data} />
            </div>
 
            {/* Product Info */}
            <h2 className="text-2xl font-bold text-white mb-4">{data.name}</h2>
            <p className="text-gray-400 mb-8 line-clamp-3">{data.description}</p>
 
            {/* Price and Sales Info */}
            <div className="flex items-center justify-between mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Current Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-yellow-500">
                    ${data.discountPrice}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${data.originalPrice}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Units Sold</p>
                <p className="text-xl font-semibold text-yellow-500">
                  {data.sold_out}
                </p>
              </div>
            </div>
          </div>
 
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to={`/product/${data._id}?isEvent=true`}
              className="flex-1"
            >
              <button className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600">
                <HiOutlineEye className="w-5 h-5" />
                See Details
              </button>
            </Link>
            <button 
              onClick={() => addToCartHandler(data)}
              className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
 };
 
 export default EventCard;