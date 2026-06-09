import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const { id } = useParams();
 
  
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);
 
  const data = orders?.find((item) => item._id === id);
 
  const handleReview = async () => {
    try {
      const res = await axios.put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(null);
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };
 
  const handleRefund = async () => {
    try {
      const res = await axios.put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund"
      });
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BsFillBagFill size={24} className="text-yellow-500" />
            <h1 className="ml-3 text-2xl font-bold text-white">Order Details</h1>
          </div>
          <div className="text-sm text-gray-400">
            <p>Order #{data?._id?.slice(0, 8)}</p>
            <p className="mt-1">Placed on {data?.createdAt?.slice(0, 10)}</p>
          </div>
        </div>
 
        {/* Order Items */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="p-6">
            {data?.cart.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 py-4 border-b border-gray-700 last:border-0">
                <img 
                  src={item.images[0]?.url}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">{item.name}</h3>
                  <p className="text-gray-400">
                    US${item.discountPrice} x {item.qty}
                  </p>
                </div>
                {data?.status == "Delivered" && (
                  <button
                    onClick={() => setOpen(true) || setSelectedItem(item)}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
                  >
                    Write Review
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="bg-gray-900 p-6 text-right">
            <p className="text-lg text-white">
              Total: <span className="font-bold">US${data?.totalPrice}</span>
            </p>
          </div>
        </div>
 
        {/* Shipping & Payment */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Shipping Address
            </h3>
            <div className="space-y-2 text-gray-300">
              <p>{data?.shippingAddress.address1}</p>
              <p>{data?.shippingAddress.address2}</p>
              <p>{data?.shippingAddress.city}, {data?.shippingAddress.country}</p>
              <p>{data?.user?.phoneNumber}</p>
            </div>
          </div>
 
          {/* Payment */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Payment Information
            </h3>
            <p className="text-gray-300 mb-6">
              Status: <span className="text-yellow-500">
                {data?.paymentInfo?.status || "Not Paid"}
              </span>
            </p>
            {data?.status === "Delivered" && (
              <button
                onClick={handleRefund}
                className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors"
              >
                Request Refund
              </button>
            )}
          </div>
        </div>
 
        {/* Review Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full mx-4 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Write a Review</h2>
                <button 
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <RxCross1 size={24} />
                </button>
              </div>
 
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={selectedItem?.images[0]?.url}
                  alt={selectedItem?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {selectedItem?.name}
                  </h3>
                  <p className="text-gray-400">
                    US${selectedItem?.discountPrice} x {selectedItem?.qty}
                  </p>
                </div>
              </div>
 
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button 
                      key={i}
                      onClick={() => setRating(i)}
                      className="text-yellow-500"
                    >
                      {rating >= i ? (
                        <AiFillStar size={24} />
                      ) : (
                        <AiOutlineStar size={24} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
 
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about the product..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={4}
                />
              </div>
 
              <button
                onClick={rating > 1 ? handleReview : null}
                className={`w-full py-3 ${
                  rating > 1 
                    ? "bg-yellow-500 hover:bg-yellow-400" 
                    : "bg-gray-700 cursor-not-allowed"
                } text-black font-medium rounded-lg transition-colors`}
              >
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
 };
 
 export default UserOrderDetails;