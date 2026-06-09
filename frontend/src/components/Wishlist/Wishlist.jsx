import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-gray-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center text-white">
            <AiOutlineHeart size={24} className="text-yellow-500" />
            <span className="ml-3 font-medium">
              Wishlist ({wishlist?.length || 0})
            </span>
          </div>
          <button
            onClick={() => setOpenWishlist(false)}
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <RxCross1 size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-150px)] overflow-y-auto">
          {wishlist?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <AiOutlineHeart size={40} className="mb-4" />
              <p>Your wishlist is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {wishlist?.map((item) => (
                <CartSingle
                  key={item._id}
                  data={item}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  addToCartHandler={addToCartHandler}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  return (
    <div className="p-4 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Image */}
        <div className="relative flex-shrink-0 w-20 h-20">
          <img
            src={data?.images[0]?.url}
            alt={data.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{data.name}</h3>
          <p className="mt-1 text-yellow-500 font-medium">
            US${data.discountPrice}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => addToCartHandler(data)}
            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
            title="Add to cart"
          >
            <BsCartPlus size={20} />
          </button>
          <button
            onClick={() => removeFromWishlistHandler(data)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <RxCross1 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;