import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full min-h-screen">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow  bg-white w-full">  {/*  */}
        <nav className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Logo"
              className="h-8"
            />
            <span className="text-2xl font-semibold">Cozy Haven Stay</span>
          </div>
          <ul className="hidden md:flex space-x-6 font-medium ">
            <li><a href="#home" className="hover:text-blue-600">Home</a></li>
            <li><a href="#about" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#contact" className="hover:text-blue-600">Contact Us</a></li>
            <li><a href="/login" className="hover:text-blue-600">Sign In</a></li>
            <li><a href="/register" className="hover:text-blue-600">Sign Up</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section
  id="home"
  className="pt-32 pb-24 px-8 text-center  w-full"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1500&auto=format&fit=crop&q=60')",
  }}
>
  <h1 className="text-5xl font-bold mb-6 text-gray-900">
    Discover Your Next Stay With <br /> Cozy Haven
  </h1>
  <div className="bg-white shadow-3xl rounded-xl px-8 py-10 max-w-4xl mx-auto">
  <p className="text-gray-700 text-lg mb-6">
    Book premium rooms, plan vacations, and experience comfort like never before.
  </p>
  <p className="text-gray-700 text-lg mb-6">
    With a wide selection of hotels, resorts, and homestays, we ensure a relaxing experience tailored just for you.
  </p>
  <p className="text-gray-700 text-lg mb-0">
    Enjoy easy booking, seamless check-ins, and exclusive member-only discounts — all at your fingertips.
  </p>
</div>

 <div className="mt-10 flex items-center justify-center gap-x-6">
  <div
    onClick={() => navigate("/register")}
    className="cursor-pointer rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    Get started - Sign Up
  </div>
</div>

</section>

{/* About Us Section */}
<section id="about" className="w-screen py-20 px-8 bg-white text-center">
  <h2 className="text-4xl font-semibold mb-6 text-gray-800">About Us</h2>
  <p className="text-gray-600 max-w-3xl mx-auto mb-4">
    Cozy Haven Stay is your ideal platform for finding and booking hotels across cities.
  </p>
  <p className="text-gray-600 max-w-3xl mx-auto mb-4">
    Whether you're planning a weekend getaway or a business trip, we help you discover the perfect place to stay.
  </p>
  <p className="text-gray-600 max-w-3xl mx-auto mb-4">
    Our team partners with top-rated hotels and verified hosts to bring you an experience that’s secure and satisfying.
  </p>
  <p className="text-gray-600 max-w-3xl mx-auto">
    With 24/7 support, advanced filters, and transparent reviews, we ensure your travel plans are stress-free.
  </p>
</section>

{/* Contact Us Section */}
<section id="contact" className="w-screen py-20 px-8 bg-gray-100 text-center">
  <h2 className="text-4xl font-semibold mb-6 text-gray-800">Contact Us</h2>
  <p className="text-gray-600 max-w-3xl mx-auto mb-4">
    Got questions or suggestions? We'd love to hear from you! Reach out to us anytime.
  </p>
  <p className="text-gray-600 max-w-3xl mx-auto mb-4">
    Our customer service team is available 24/7 to help you with bookings, cancellations, or feedback.
  </p>
  <p className="text-gray-600 max-w-3xl mx-auto mb-8">
    Whether you're a traveler or a hotel owner, we’re here to make your journey with Cozy Haven seamless and enjoyable.
  </p>
  <a
    href="mailto:support@cozyhaven.com"
    className="text-blue-600 underline text-lg"
  >
    support@cozyhaven.com
  </a>
</section>

{/* Footer */}
<footer className="w-full bg-gray-900 text-white py-6 text-center w-screen py-20 px-8 bg-gray-100 text-center">
  <p>&copy; 2025 Cozy Haven Stay. All rights reserved.</p>
</footer>

    </div>
  );
}
