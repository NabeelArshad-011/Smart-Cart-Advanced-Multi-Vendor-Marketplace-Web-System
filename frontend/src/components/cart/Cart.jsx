import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center">
              <IoBagHandleOutline className="text-yellow-500 w-6 h-6" />
              <span className="ml-3 text-lg font-medium text-white">
                Cart ({cart.length} items)
              </span>
            </div>
            <button
              onClick={() => setOpenCart(false)}
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-full transition-colors duration-200"
            >
              <RxCross1 className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center flex-col p-8">
              <IoBagHandleOutline className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
              <button
                onClick={() => setOpenCart(false)}
                className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                {cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-800 p-6">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <Link to="/checkout">
                  <button className="w-full py-4 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200">
                    Checkout • ${totalPrice.toFixed(2)}
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-800 transition-colors duration-200">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800">
        <img
          src={data?.images[0]?.url}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white truncate">{data.name}</h3>
        <p className="mt-1 text-sm text-gray-400">${data.discountPrice} each</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center mt-2 space-x-3">
          <button
            onClick={() => decrement(data)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors duration-200"
          >
            <HiOutlineMinus className="w-4 h-4" />
          </button>
          <span className="text-gray-300 w-8 text-center">{value}</span>
          <button
            onClick={() => increment(data)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors duration-200"
          >
            <HiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end">
        <span className="font-medium text-yellow-500">
          ${totalPrice.toFixed(2)}
        </span>
        <button
          onClick={() => removeFromCartHandler(data)}
          className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Cart;