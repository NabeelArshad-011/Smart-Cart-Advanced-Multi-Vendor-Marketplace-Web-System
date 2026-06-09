import React from "react";
import { useNavigate } from "react-router-dom";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  
  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="w-[270px] bg-white absolute z-30 rounded-xl shadow-lg py-2">
      {categoriesData &&
        categoriesData.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors duration-200 group"
            onClick={() => submitHandle(item)}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <img
                src={item.image_Url}
                className="w-5 h-5 object-contain select-none"
                alt={item.title}
              />
            </div>
            <span className="ml-3 text-gray-700 font-medium select-none group-hover:text-gray-900">
              {item.title}
            </span>
          </div>
        ))}
    </div>
  );
};

export default DropDown;