import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Main Content Section */}
      <section className="bg-gradient-to-r from-gray-900 via-emerald-900 to-gray-800 text-white py-24">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
            Welcome to Your Go-To Destination for the Latest Tech & Gadgets!
          </h1>
          <p className="text-base sm:text-lg mb-8 md:mb-12 text-gray-300">
            Explore powerful features that make your shopping experience smarter, faster, and more enjoyable. Tech has never been this accessible!
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-yellow-400 text-black py-3 px-6 sm:px-8 rounded-full text-sm sm:text-lg font-semibold hover:bg-amber-500 transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-gray-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-300 mb-4 sm:mb-6">Tech That Inspires</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-4">
            Did you know the average person interacts with over 30 gadgets a day? It’s time to make yours smarter.
          </p>
          <p className="text-sm sm:text-base text-gray-300 mb-4">
            Discover the tools that power your productivity, enhance your entertainment, and bring your ideas to life.
          </p>
          <p className="text-sm sm:text-base text-gray-300">
            From cutting-edge laptops to smart home essentials — we’ve got what you need to stay ahead.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-emerald-400 mb-4">Curated Selection</h3>
              <p className="text-sm sm:text-base text-gray-300">
                We handpick the latest and greatest in tech — from trusted brands and emerging innovators alike.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-emerald-400 mb-4">Fast & Secure Checkout</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Experience a smooth, fast, and safe shopping process with multiple payment options and quick delivery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold text-emerald-400 mb-4">Smart Support</h3>
              <p className="text-sm sm:text-base text-gray-300">
                Got questions? Our support team is tech-savvy, friendly, and always ready to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Tips Section */}
      <section className="bg-emerald-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-4 sm:mb-6">Quick Tech Tips</h2>
          <div className="text-left inline-block">
            <p className="text-sm sm:text-base text-gray-100 mb-2 sm:mb-4">1. Keep your software updated — it’s the easiest way to stay secure.</p>
            <p className="text-sm sm:text-base text-gray-100 mb-2 sm:mb-4">2. Use a surge protector to safeguard your electronics during storms.</p>
            <p className="text-sm sm:text-base text-gray-100 mb-2 sm:mb-4">3. Organize your cables with simple ties or a cable box to avoid tangles.</p>
            <p className="text-sm sm:text-base text-gray-100">4. Clean your screens regularly with microfiber cloths to extend their life.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-green-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-6">
            Ready to Upgrade Your Tech?
          </h2>
          <p className="text-sm sm:text-lg mb-6 sm:mb-8">
            Join us and experience the smartest way to shop for cutting-edge technology!
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-yellow-400 text-black py-2 px-6 sm:py-3 sm:px-8 rounded-full text-sm sm:text-lg font-semibold hover:bg-amber-500 transition-all duration-300"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
