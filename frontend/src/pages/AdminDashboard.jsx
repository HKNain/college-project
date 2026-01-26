import React from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import API from "../utils/axios";
import navigationCards from "../json/cards.json";
import colors from "../json/colors.json";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const getColorClasses = (color) => colors[color];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-700 mb-3">
            Admin Dashboard
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Manage student records, teachers, and assignments
          </p>
        </div>

        {/* Welcome Message */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white text-center">
          <i className="fas fa-graduation-cap text-4xl md:text-5xl mb-4"></i>
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Welcome to the Admin Dashboard
          </h3>
          <p className="text-sm md:text-base opacity-90">
            Use the navigation cards below to manage your institution's data
            efficiently
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {navigationCards.map((card, index) => {
            const colorClasses = getColorClasses(card.color);
            return (
              <div
                key={index}
                className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-2xl shadow-lg transition-all duration-300 ${colorClasses.hover} transform hover:scale-105 hover:shadow-xl overflow-hidden`}
              >
                <div className="p-6 md:p-8 flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div
                    className={`${colorClasses.icon} bg-white rounded-full p-6 mb-6 shadow-md`}
                  >
                    <i className={`fas ${card.icon} text-4xl md:text-5xl`}></i>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 mb-6 grow">
                    {card.description}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => navigate(card.path)}
                    className={`${colorClasses.button} w-full text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    <span>Go to {card.title}</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
