import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const brandName = "TechHub";
  
  return (
    <div className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold">
                Subscribe to our newsletter
              </h2>
              <p className="mt-2 text-gray-400">
                Stay updated with our latest news, events, and exclusive offers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
                required
              />
              <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="Logo"
              className="h-8 brightness-0 invert mb-6"
            />
            <p className="text-gray-400 mb-6">
              The home and elements needed to create beautiful products.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <AiFillFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <AiOutlineTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <AiFillInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <AiFillYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerProductLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {footercompanyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerSupportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} {brandName}. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
              <span>·</span>
              <a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
            </div>
            <div className="flex justify-center md:justify-end">
              <img
                src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
                alt="Payment methods"
                className="h-8 brightness-0 invert opacity-75"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;