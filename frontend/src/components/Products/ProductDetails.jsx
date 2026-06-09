import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg =  totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);


  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {data && (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div>
              <div className="aspect-w-1 aspect-h-1 bg-gray-800 rounded-2xl overflow-hidden">
                <img
                  src={data.images[select]?.url}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {data.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelect(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                      select === index ? 'ring-2 ring-yellow-500' : 'ring-1 ring-gray-700'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white">{data.name}</h1>
                <p className="mt-4 text-gray-400">{data.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-4">
                <h2 className="text-3xl font-bold text-yellow-500">${data.discountPrice}</h2>
                {data.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${data.originalPrice}</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decrementCount}
                    className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-white">{count}</span>
                  <button
                    onClick={incrementCount}
                    className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  {click ? (
                    <AiFillHeart className="w-6 h-6 text-red-500" />
                  ) : (
                    <AiOutlineHeart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                  )}
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCartHandler(data._id)}
                className="w-full py-3 px-8 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>Add to Cart</span>
                <AiOutlineShoppingCart className="w-5 h-5" />
              </button>

              {/* Shop Info */}
              <div className="border-t border-gray-800 pt-8">
                <div className="flex items-center space-x-4">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={data?.shop?.avatar?.url}
                      alt={data?.shop?.name}
                      className="w-12 h-12 rounded-full border border-gray-700"
                    />
                  </Link>
                  <div>
                    <Link 
                      to={`/shop/preview/${data?.shop._id}`}
                      className="text-lg font-medium text-white hover:text-yellow-500"
                    >
                      {data.shop.name}
                    </Link>
                    <p className="text-sm text-gray-400">
                      {averageRating} out of 5 ({totalReviewsLength} reviews)
                    </p>
                  </div>
                  <button
                    onClick={handleMessageSubmit}
                    className="ml-auto px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Message Seller</span>
                    <AiOutlineMessage className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <ProductDetailsInfo
              data={data}
              products={products}
              totalReviewsLength={totalReviewsLength}
              averageRating={averageRating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, name: "Product Details" },
    { id: 2, name: "Product Reviews" },
    { id: 3, name: "Seller Information" }
  ];

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden">
      <div className="border-b border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                active === tab.id
                  ? "text-yellow-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.name}
              {active === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {active === 1 && (
          <p className="text-gray-300 whitespace-pre-line">{data.description}</p>
        )}

        {active === 2 && (
          <div className="space-y-6">
            {data.reviews.length > 0 ? (
              data.reviews.map((review, index) => (
                <div key={index} className="flex space-x-4">
                  <img
                    src={review.user.avatar?.url}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium">{review.user.name}</h3>
                      <Ratings rating={review.rating} />
                    </div>
                    <p className="mt-1 text-gray-400">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No reviews yet</p>
            )}
          </div>
        )}

        {active === 3 && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-4">
                <img
                  src={data?.shop?.avatar?.url}
                  alt={data?.shop?.name}
                  className="w-16 h-16 rounded-full border border-gray-700"
                />
                <div>
                  <h3 className="text-lg font-medium text-white">{data.shop.name}</h3>
                  <p className="text-sm text-gray-400">
                    {averageRating} out of 5 ({totalReviewsLength} reviews)
                  </p>
                </div>
              </div>
              <p className="mt-4 text-gray-300">{data.shop.description}</p>
            </div>
            <div className="space-y-4 text-right">
              <p className="text-gray-300">
                <span className="font-medium text-white">Joined:</span>{" "}
                {data.shop?.createdAt?.slice(0, 10)}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Total Products:</span>{" "}
                {products?.length}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-white">Total Reviews:</span>{" "}
                {totalReviewsLength}
              </p>
              <Link to={`/shop/preview/${data?.shop._id}`}>
                <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors">
                  Visit Shop
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;