import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";

const Categories = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-900 py-16">
      {/* Branding Section */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {brandingData.map((item, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-yellow-500 text-4xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">
                    {item.Description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="categories">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/products?category=${category.title}`)}
              className="bg-gray-800 rounded-2xl p-6 cursor-pointer group hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-yellow-500 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col items-center justify-between h-full space-y-4">
                <img
                  src={category.image_Url}
                  alt={category.title}
                  className="w-24 h-24 object-contain transition-transform group-hover:scale-110"
                />
                <h3 className="text-lg font-medium text-white group-hover:text-yellow-500 transition-colors text-center">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;

