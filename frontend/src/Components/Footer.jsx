import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Cookies from 'js-cookie';

const Footer = () => {
  const role = Cookies.get("role");  // replace "role" with your actual cookie name for role

  return (
    <footer className="bg-gradient-to-r from-black via-black to-green-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap justify-between">
          {/* Kompania */}
          <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
            <h2 className="text-lg font-bold mb-4">Smart Buy</h2>
            <p className="text-sm font-extrabold text-center text-green-400">
              Delivering love since 2007
            </p>
          </div>

          {/* Lidhje të shpejta */}
          <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
            <h2 className="text-lg font-bold mb-4">Fast Connections</h2>
            <ul>
              {[
                { label: "Home", href: "/" },
  { 
    label: "Contact", 
    href: role === "Admin" ? "/chatcomponent" : "/chatcomponentforusers" 
  },
  { label: "Products", href: "/productlist" },
              ].map(({ label, href }, i) => (
                <li key={i} className="mb-2">
                  <a
                    href={href}
                    className="text-sm hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-green-400 hover:via-lime-400 hover:to-emerald-500"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informata për kontaktin */}
          <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
            <h2 className="text-lg font-bold mb-4">Contact</h2>
            <p className="text-sm">Rruga Adem Jashari, Qyteti Vushtrri, 42000</p>
            <p className="text-sm mt-2">Email: smartbuy@gmail.com</p>
            <p className="text-sm mt-2">Phone: +383 49 456 780</p>
          </div>

          {/* Media Sociale */}
          <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
            <h2 className="text-lg font-bold mb-4">Follow us</h2>
            <div className="flex space-x-4">
              {[
                { icon: faFacebook, href: 'https://facebook.com' },
                { icon: faTwitter, href: 'https://twitter.com' },
                { icon: faInstagram, href: 'https://instagram.com' },
                { icon: faYoutube, href: 'https://youtube.com' },
              ].map(({ icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition duration-300 transform hover:scale-110 hover:text-green-400"
                >
                  <FontAwesomeIcon icon={icon} size="lg" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-green-800 pt-4 text-center">
          <p className="text-sm lg:text-base">
            &copy; 2007 - {new Date().getFullYear()} SmartBuy, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
