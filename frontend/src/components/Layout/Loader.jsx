import React from "react";
import Lottie from "react-lottie";
import animationData from "../../Assests/animations/24151-ecommerce-animation.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <Lottie 
          options={defaultOptions} 
          width={250} 
          height={250}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;