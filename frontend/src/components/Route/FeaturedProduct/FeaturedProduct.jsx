import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";
import { HiOutlineStar } from "react-icons/hi";

const FeaturedProduct = () => {
 const { allProducts } = useSelector((state) => state.products);
  
 return (
   <div className="bg-gray-900 py-16">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       {/* Header */}
       <div className="flex items-center justify-center mb-12">
         <div className="text-center">
           <div className="flex items-center justify-center mb-6">
             <div className="p-4 bg-yellow-500/10 rounded-2xl">
               <HiOutlineStar className="w-8 h-8 text-yellow-500" />
             </div>
           </div>
           <h2 className="text-3xl font-bold text-white mb-3">
             Featured Products
           </h2>
           <p className="text-gray-400 text-lg">
             Handpicked selections just for you
           </p>
         </div>
       </div>

       {/* Products Grid */}
       {allProducts && allProducts.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
           {allProducts.map((product, index) => (
             <ProductCard 
               data={product} 
               key={index} 
             />
           ))}
         </div>
       ) : (
         <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-700/50 mb-6">
             <HiOutlineStar className="w-8 h-8 text-gray-400" />
           </div>
           <h3 className="text-xl font-medium text-white mb-3">
             No Products Available
           </h3>
           <p className="text-gray-400 max-w-md mx-auto">
             Check back soon for our featured product collection!
           </p>
         </div>
       )}
     </div>
   </div>
 );
};

export default FeaturedProduct;