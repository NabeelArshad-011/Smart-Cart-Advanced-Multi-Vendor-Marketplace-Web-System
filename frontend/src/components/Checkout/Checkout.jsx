import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
   if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""){
      toast.error("Please choose your delivery address!")
   } else{
    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
    }

    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
   }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  console.log(discountPercentenge);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Shipping Info */}
          <div className="lg:w-2/3">
            <ShippingInfo
              user={user}
              country={country}
              setCountry={setCountry}
              city={city}
              setCity={setCity}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              address1={address1}
              setAddress1={setAddress1}
              address2={address2}
              setAddress2={setAddress2}
              zipCode={zipCode}
              setZipCode={setZipCode}
            />
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:w-1/3">
            <CartData
              handleSubmit={handleSubmit}
              totalPrice={totalPrice}
              shipping={shipping}
              subTotalPrice={subTotalPrice}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              discountPercentenge={discountPercentenge}
            />
          </div>
        </div>

        <button
          onClick={paymentSubmit}
          className="mt-8 w-full lg:w-auto lg:ml-auto block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors duration-200"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gray-700 rounded-xl">
          <IoLocationOutline className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold">Shipping Information</h2>
      </div>

      <form className="space-y-6">
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user?.name}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={user?.phoneNumber}
              readOnly
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Select City</option>
              {State.getStatesOfCountry(country).map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>
      </form>

      {/* Saved Addresses */}
      <div className="mt-8">
        <button
          onClick={() => setUserInfo(!userInfo)}
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          Choose from saved addresses
        </button>
        
        {userInfo && (
          <div className="mt-4 space-y-3">
            {user?.addresses.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                  onClick={() => {
                    setAddress1(item.address1);
                    setAddress2(item.address2);
                    setZipCode(item.zipCode);
                    setCountry(item.country);
                    setCity(item.city);
                  }}
                />
                <span className="text-gray-300">{item.addressType}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gray-700 rounded-xl">
          <HiOutlineShoppingBag className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span className="font-medium">${subTotalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>
        {discountPercentenge && (
          <div className="flex justify-between text-gray-300">
            <span>Discount</span>
            <span className="font-medium text-green-400">
              -${discountPercentenge.toFixed(2)}
            </span>
          </div>
        )}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between">
            <span className="text-lg">Total</span>
            <span className="text-lg font-semibold">${totalPrice}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200"
          >
            Apply Coupon
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
