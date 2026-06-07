import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80)"
        }}
      />
 
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
        <div className="max-w-2xl">
          <span className="block mb-4 text-yellow-500 text-lg font-medium">
            Latest Tech Innovation
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Premium Tech & 
            <span className="block">Gadgets Collection</span>
          </h1>
 
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Discover cutting-edge technology and premium gadgets that enhance your digital lifestyle. 
            Explore the latest smartphones, laptops, accessories and smart devices from top brands worldwide.
          </p>
 
          <Link 
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-lg transition-colors duration-200"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </div>
  );
 };
 
 export default Hero;
