import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../../static/data';

const Navbar = ({active}) => {
  return (
    <nav className="block 800px:flex items-center gap-2">
      {navItems && navItems.map((item, index) => (
        <div key={index} className="relative group">
          <Link
            to={item.url}
            className={`
              relative px-4 py-2 font-medium text-sm transition-colors duration-200
              ${active === index + 1 
                ? "text-yellow-500" 
                : "text-black 800px:text-gray-300 hover:text-white"}
            `}
          >
            {item.title}
            {active === index + 1 && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-full"></span>
            )}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;