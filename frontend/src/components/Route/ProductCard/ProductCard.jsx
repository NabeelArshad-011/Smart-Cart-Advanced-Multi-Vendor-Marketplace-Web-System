import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
 
  useEffect(() => {
    setClick(wishlist?.find((i) => i._id === data._id) ? true : false);
  }, [wishlist]);
 
  const toggleWishlist = () => {
    if(click) {
      dispatch(removeFromWishlist(data));
    } else {
      dispatch(addToWishlist(data));
    }
    setClick(!click);
  };
 
  const addToCartHandler = () => {
    if (cart?.find((i) => i._id === data._id)) {
      toast.error("Item already in cart!");
      return;
    }
    
    if (data.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }
    
    dispatch(addTocart({ ...data, qty: 1 }));
    toast.success("Added to cart!");
  };
 
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group">
      {/* Image Section */}
      <Link to={`/product/${data._id}${isEvent ? '?isEvent=true' : ''}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={data.images?.[0]?.url}
            alt={data.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Sale Badge */}
          {data.originalPrice > data.discountPrice && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              SALE
            </div>
          )}
          
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-900/50 hover:bg-gray-900 transition-colors"
          >
            {click ? (
              <AiFillHeart className="w-5 h-5 text-red-500" />
            ) : (
              <AiOutlineHeart className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </Link>
 
      {/* Content Section */}
      <div className="p-4">
        {/* Shop Name */}
        <Link 
          to={`/shop/preview/${data?.shop._id}`}
          className="text-xs text-gray-400 hover:text-yellow-500 transition-colors"
        >
          {data.shop.name}
        </Link>
 
        {/* Product Name */}
        <Link to={`/product/${data._id}${isEvent ? '?isEvent=true' : ''}`}>
          <h3 className="mt-1 text-white font-medium line-clamp-2">
            {data.name}
          </h3>
        </Link>
 
        {/* Rating */}
        <div className="mt-2">
          <Ratings rating={data?.ratings} />
        </div>
 
        {/* Price & Cart */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-yellow-500">
              ${data.discountPrice}
            </div>
            {data.originalPrice > data.discountPrice && (
              <div className="text-sm text-gray-500 line-through">
                ${data.originalPrice}
              </div>
            )}
          </div>
          
          <button
            onClick={addToCartHandler}
            className="p-2 rounded-lg bg-gray-700 text-white hover:bg-yellow-500 hover:text-black transition-colors"
          >
            <AiOutlineShoppingCart className="w-5 h-5" />
          </button>
        </div>
 
        {/* Sold Count */}
        <div className="mt-2 text-right">
          <span className="text-xs text-green-500">
            {data?.sold_out} sold
          </span>
        </div>
      </div>
 
      {/* Quick View Modal */}
      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </div>
  );
 };
export default ProductCard;
