import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order successful!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PaymentInfo
              user={user}
              open={open}
              setOpen={setOpen}
              onApprove={onApprove}
              createOrder={createOrder}
              paymentHandler={paymentHandler}
              cashOnDeliveryHandler={cashOnDeliveryHandler}
            />
          </div>
          <div>
            <CartData orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  const PaymentOption = ({ value, title, selected, onSelect }) => (
    <div className="flex items-center gap-3 py-4 border-b border-gray-800">
      <button
        onClick={() => onSelect(value)}
        className={`w-5 h-5 rounded-full border-2 ${
          selected ? 'border-yellow-500' : 'border-gray-600'
        } flex items-center justify-center transition-colors duration-200`}
      >
        {selected && (
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        )}
      </button>
      <span className="text-gray-200 font-medium">{title}</span>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-6">Payment Method</h3>

      {/* Payment Options */}
      <div className="space-y-2">
        <PaymentOption
          value={1}
          title="Pay with Credit/Debit Card"
          selected={select === 1}
          onSelect={setSelect}
        />
        
        {select === 1 && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <form onSubmit={paymentHandler} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name on Card
                  </label>
                  <input
                    required
                    placeholder={user?.name}
                    value={user?.name}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expiration Date
                  </label>
                  <CardExpiryElement 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#ffffff",
                          "::placeholder": {
                            color: "#9CA3AF",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <CardNumberElement 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#ffffff",
                          "::placeholder": {
                            color: "#9CA3AF",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CVV
                  </label>
                  <CardCvcElement 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#ffffff",
                          "::placeholder": {
                            color: "#9CA3AF",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors duration-200"
              >
                Pay Now
              </button>
            </form>
          </div>
        )}

        <PaymentOption
          value={2}
          title="Pay with PayPal"
          selected={select === 2}
          onSelect={setSelect}
        />
        
        {select === 2 && (
          <div className="mt-4">
            <button
              onClick={() => setOpen(true)}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors duration-200"
            >
              Continue with PayPal
            </button>
          </div>
        )}

        <PaymentOption
          value={3}
          title="Cash on Delivery"
          selected={select === 3}
          onSelect={setSelect}
        />
        
        {select === 3 && (
          <div className="mt-4">
            <form onSubmit={cashOnDeliveryHandler}>
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors duration-200"
              >
                Confirm Order
              </button>
            </form>
          </div>
        )}
      </div>

      {/* PayPal Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-xl w-full mx-4 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <RxCross1 size={24} />
            </button>
            <PayPalScriptProvider
              options={{
                "client-id": "Aczac4Ry9_QA1t4c7TKH9UusH3RTe6onyICPoCToHG10kjlNdI-qwobbW9JAHzaRQwFMn2-k660853jn"
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                onApprove={onApprove}
                createOrder={createOrder}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      )}
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6">Order Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span className="font-medium">${orderData?.subTotalPrice}</span>
        </div>

        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span className="font-medium">${shipping}</span>
        </div>

        <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-4">
          <span>Discount</span>
          <span className="font-medium text-yellow-500">
            {orderData?.discountPrice ? "-$" + orderData.discountPrice : "-"}
          </span>
        </div>

        <div className="flex justify-between pt-2">
          <span className="text-lg font-medium text-white">Total</span>
          <span className="text-lg font-bold text-white">${orderData?.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;