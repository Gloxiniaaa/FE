import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";

const LoginRegister = () => {
  // State to toggle between login and register forms
  const [isLogin, setIsLogin] = useState(true);

  // Mock Google sign-in handler (replace with real implementation)
  const handleGoogleSignIn = () => {
    console.log("Sign in with Google clicked!");
    // Add Firebase/Google Auth logic here later
  };

  // Form submission handlers (placeholders)
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log(isLogin ? "Login data:" : "Register data:", data);
    // Add real authentication logic here
  };

  return (
    <div className="min-h-screen bg-farmGray-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-farmGreen-700">
              {isLogin ? "Login" : "Register"} to FARMGENIUS GRAPEGROW
            </h2>
            <p className="mt-2 text-farmGray-600">
              {isLogin
                ? "Access your farm monitoring dashboard"
                : "Create an account to start monitoring your farm"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-farmGray-600"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="mt-1 w-full px-3 py-2 border border-farmGray-200 rounded-md shadow-sm focus:outline-none focus:ring-farmGreen-700 focus:border-farmGreen-700"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-farmGray-600"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full px-3 py-2 border border-farmGray-200 rounded-md shadow-sm focus:outline-none focus:ring-farmGreen-700 focus:border-farmGreen-700"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-farmGray-600"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full px-3 py-2 border border-farmGray-200 rounded-md shadow-sm focus:outline-none focus:ring-farmGreen-700 focus:border-farmGreen-700"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-farmGreen-700 text-white py-2 px-4 rounded-md hover:bg-farmGreen-900 transition-colors duration-200"
            >
              {isLogin ? "Sign In" : "Register"}
            </button>
          </form>

          {/* Google Sign-In Button */}
          <div className="mt-2">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-farmGray-200 text-farmGray-600 py-2 px-4 rounded-md hover:bg-farmGray-100 transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 3.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm0 2c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5-4.5-2.015-4.5-4.5 2.015-4.5 4.5-4.5z"
                  fill="#4285F4"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* Toggle between Login and Register */}
          <div className="text-center text-sm">
            <p className="text-farmGray-600">
              {isLogin ? "Need an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-farmGreen-700 hover:text-farmGreen-900 font-medium"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link
              to="/"
              className="text-farmGreen-700 hover:text-farmGreen-900 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default LoginRegister;