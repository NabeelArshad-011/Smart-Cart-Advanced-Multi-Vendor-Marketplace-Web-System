import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
 
  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);
 
  const data = orders?.find((item) => item._id === id);
 
  const statusMessages = {
    "Processing": "Order is being processed",
    "Transferred to delivery partner": "Order has been picked up by delivery partner", 
    "Shipping": "Order is in transit with delivery partner",
    "Received": "Order has reached your city",
    "On the way": "Delivery agent is en route to deliver",
    "Delivered": "Order has been delivered successfully",
    "Processing refund": "Refund is being processed", 
    "Refund Success": "Refund has been completed"
  };
 
  const getStatusColor = (status) => {
    const colors = {
      "Delivered": "text-green-500",
      "Refund Success": "text-green-500",
      "Processing refund": "text-yellow-500",
      "Processing": "text-yellow-500",
      "default": "text-gray-200"
    };
    return colors[status] || colors.default;
  };
 
  return (
    <div className="min-h-[80vh] bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-gray-800 rounded-xl p-8 text-center">
        {data && (
          <>
            <h2 className="text-xl font-medium text-gray-200 mb-4">
              Order Status
            </h2>
            <div className="border border-gray-700 rounded-lg p-6">
              <p className={`text-xl font-medium ${getStatusColor(data.status)}`}>
                {statusMessages[data.status]}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400">
                  Order ID: {data._id}
                </p>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                    style={{
                      width: data.status === "Delivered" ? "100%" : "60%" 
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
 };
 
 export default TrackOrder;