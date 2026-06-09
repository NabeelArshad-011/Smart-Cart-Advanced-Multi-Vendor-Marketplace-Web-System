import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { productData } from "../../static/data";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState();
 
  useEffect(() => {
    const relatedProducts = allProducts?.filter((i) => i.category === data.category);
    setProductData(relatedProducts);
  }, []);
 
  if (!data) return null;
 
  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Related Products
          </h2>
          <div className="h-0.5 flex-1 ml-8 bg-gray-800"></div>
        </div>
 
        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {productData?.map((product, index) => (
            <ProductCard
              key={index}
              data={product}
            />
          ))}
        </div>
 
        {/* Empty State */}
        {(!productData || productData.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No related products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
 };
 
 export default SuggestedProduct;
